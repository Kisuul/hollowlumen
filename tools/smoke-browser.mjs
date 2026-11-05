// Optional CI-only browser smoke. Run after npm ci, npm run build, and
// npm install --no-save --no-package-lock playwright@1.56.1.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import assert from 'node:assert/strict';
const host='http://127.0.0.1:4173';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4173','--strictPort'],{stdio:'pipe'});
let browser;const errors=[];
try{
 let ready=false;
 for(let retry=0;retry<70;retry++){
  if(server.exitCode!==null)throw Error('Vite preview exited: '+server.exitCode);
  try{const r=await fetch(host);if(r.ok){ready=true;break;}}catch{}
  await delay(200);
 }
 if(!ready)throw Error('Vite preview never started');
 browser=await chromium.launch({headless:true});
 for(const viewport of [{width:1280,height:800},{width:390,height:844},{width:320,height:700}]){
  const page=await browser.newPage({viewport,deviceScaleFactor:1});
  page.on('pageerror',err=>errors.push(viewport.width+': pageerror '+err.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(viewport.width+': console '+message.text())});
  await page.goto(host,{waitUntil:'networkidle'});
  const nav=page.getByRole('navigation',{name:viewport.width>850?'Main navigation':'Mobile navigation'});
  for(const item of [
   {label:'Home',url:'/'},
   {label:'Wander',url:'/wander'},
   {label:'Idle',url:'/idle'},
   {label:'Yarn',url:'/yarn'},
   {label:'Shop',url:'/shop'}
  ]){
    await nav.getByRole('link',{name:item.label}).click();
    await page.waitForURL(url=>new URL(url).pathname===item.url,{timeout:4000});
    assert.equal(await page.locator('h1').count(),1,'Missing heading for '+item.label);
    if(await page.locator('body').evaluate(el=>el.scrollWidth>window.innerWidth+2))throw Error('Horizontal overflow at '+viewport.width+' on '+item.label);
  }
  await nav.getByRole('link',{name:'Home'}).click();
  const toggle=page.getByRole('button',{name:/^(Open|Close) gate/});
  const before=await toggle.innerText();
  await toggle.click();
  const after=await toggle.innerText();
  assert.notEqual(before,after,'Gate did not toggle');
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.getByRole('button',{name:/^(Open|Close) gate/}).innerText(),after,'Gate did not persist across reload');
  console.log('PASS '+viewport.width+'px: 5 routes, navigation, game state persistence, layout');
  await page.close();
 }
 if(errors.length)throw Error(errors.join('\n'));
 console.log('PASS: no JS page or console errors');
}finally{await browser?.close();server.kill();}
