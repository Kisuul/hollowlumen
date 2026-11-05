// Optional CI-only browser smoke. Run after npm ci, npm run build, and
// npm install --no-save --no-package-lock playwright@1.56.1.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
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
  // Stage 2: theme and world lighting are independent, and appearance settings
  // must never overwrite the Stage 1 economy/local-save key.
  const gameSaveBefore = await page.evaluate(() => localStorage.getItem('lumenette-hollow-save'));
  const interfacePicker = page.getByRole('combobox',{name:'Interface appearance'});
  const lightingPicker = page.getByRole('combobox',{name:'Valley lighting'});
  await interfacePicker.selectOption('dark');
  assert.equal(await page.locator('html').getAttribute('data-ui-theme'),'night');
  assert.equal(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(27, 24, 42)');
  await lightingPicker.selectOption('always-day');
  assert.equal(await page.locator('.scene-weather').innerText().then(t=>t.includes('Gentle daylight')),true);
  assert.equal(await page.locator('html').getAttribute('data-ui-theme'),'night','Dark UI must coexist with daylight scene');
  await interfacePicker.selectOption('follow-world');
  assert.equal(await page.locator('html').getAttribute('data-ui-theme'),'day');
  await lightingPicker.selectOption('always-night');
  assert.equal(await page.locator('html').getAttribute('data-ui-theme'),'night');
  await interfacePicker.selectOption('light');
  assert.equal(await page.locator('html').getAttribute('data-ui-theme'),'day','Light UI must coexist with night scene');
  await lightingPicker.selectOption('follow-device-time');
  await interfacePicker.selectOption('follow-world');
  const slider=page.getByRole('slider',{name:'Preview valley time of day'});
  await slider.fill('12');
  assert.equal(await page.locator('.time-preview output').innerText(),'12:00');
  const noonLighting=await page.locator('.hollow-scene').evaluate(el=>el.style.getPropertyValue('--scene-daylight'));
  assert.ok(noonLighting.endsWith('%'));
  assert.equal(await page.locator('html').getAttribute('data-ui-theme'),'day');
  if(viewport.width !== 320){
    mkdirSync('artifacts/visual',{recursive:true});
    await page.screenshot({path:'artifacts/visual/hollow-day-'+viewport.width+'.png',fullPage:true});
  }
  await slider.fill('0');
  assert.equal(await page.locator('.time-preview output').innerText(),'00:00');
  const nightLighting=await page.locator('.hollow-scene').evaluate(el=>el.style.getPropertyValue('--scene-daylight'));
  assert.notEqual(noonLighting,nightLighting,'Solar preview must change actual scene lighting variables');
  assert.equal(await page.locator('html').getAttribute('data-ui-theme'),'night');
  if(viewport.width !== 320)await page.screenshot({path:'artifacts/visual/hollow-night-'+viewport.width+'.png',fullPage:true});
  await page.getByRole('button',{name:'Return to live'}).click();
  assert.equal(await page.locator('.time-preview output').innerText(),'Live clock');
  assert.equal(await page.evaluate(() => localStorage.getItem('lumenette-hollow-save')),gameSaveBefore);
  await interfacePicker.selectOption('dark');
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.locator('html').getAttribute('data-ui-theme'),'night','Appearance preference must persist across reload');
  for(const label of ['Wander','Idle','Yarn','Shop','Home']){
    await nav.getByRole('link',{name:label}).click();
    const bg=await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor);
    assert.equal(bg,'rgb(27, 24, 42)','Dark palette missing on '+label);
    assert.equal(await page.locator('body').evaluate(el=>el.scrollWidth>window.innerWidth+2),false,'Dark overflow on '+label);
  }
  console.log('PASS '+viewport.width+'px: palette switching, 24-hour preview, persistence, 5 dark routes');
  console.log('PASS '+viewport.width+'px: 5 routes, navigation, game state persistence, layout');
  await page.close();
 }
 if(errors.length)throw Error(errors.join('\n'));
 console.log('PASS: no JS page or console errors');
}finally{await browser?.close();server.kill();}
