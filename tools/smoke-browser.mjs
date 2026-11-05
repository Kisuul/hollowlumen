// Optional CI-only browser smoke. Run after npm ci, npm run build, and
// npm install --no-save --no-package-lock playwright@1.56.1.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync } from 'node:fs';
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
  await slider.evaluate(el=>el.blur()); // Keep the screenshot separate from the keyboard focus audit.
  if(viewport.width !== 320){
    mkdirSync('artifacts/visual',{recursive:true});
    await page.screenshot({path:'artifacts/visual/hollow-day-'+viewport.width+'.png',fullPage:true});
  }
  await slider.fill('0');
  assert.equal(await page.locator('.time-preview output').innerText(),'00:00');
  const nightLighting=await page.locator('.hollow-scene').evaluate(el=>el.style.getPropertyValue('--scene-daylight'));
  assert.notEqual(noonLighting,nightLighting,'Solar preview must change actual scene lighting variables');
  assert.equal(await page.locator('html').getAttribute('data-ui-theme'),'night');
  await slider.evaluate(el=>el.blur());
  const nightButton = await page.getByRole('button',{name:/^(Open|Close) gate/}).evaluate(el=>{
    const style=getComputedStyle(el);
    return { background:style.backgroundColor, color:style.color,
      tokenBackground:getComputedStyle(document.documentElement).getPropertyValue('--hl-secondary-bg').trim() };
  });
  const luminance = (css) => {
    const channels = css.match(/\d+(?:\.\d+)?/g)?.slice(0,3).map(Number);
    assert.equal(channels?.length,3,'Expected an RGB color: '+css);
    const [r,g,b]=channels.map(channel=>{
      const value=channel/255;
      return value<=.04045?value/12.92:((value+.055)/1.055)**2.4;
    });
    return .2126*r+.7152*g+.0722*b;
  };
  const light=luminance(nightButton.color),dark=luminance(nightButton.background);
  const contrast=(Math.max(light,dark)+.05)/(Math.min(light,dark)+.05);
  assert.ok(contrast>=4.5,'Night secondary button has insufficient text contrast: '+contrast.toFixed(2)+':1');
  console.log('Secondary button/night '+viewport.width+'px: '+JSON.stringify({...nightButton,contrast:contrast.toFixed(2)}));
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
  // Visual and interaction evidence for the new two-companion collection at both themes.
  await nav.getByRole('link',{name:'Yarn'}).click();
  await page.getByRole('button',{name:/Make another Lumenette/}).click();
  assert.equal(await page.locator('.critter-card').count(),2,
    'Collection must display two separately owned individuals on '+viewport.width+'px');
  assert.equal(await page.locator('body').evaluate(el=>el.scrollWidth>window.innerWidth+2),false,
    'New collection overflows at '+viewport.width+'px');
  if(viewport.width !== 320){
    await page.screenshot({path:'artifacts/visual/collection-night-'+viewport.width+'.png',fullPage:true});
    await interfacePicker.selectOption('light');
    await page.screenshot({path:'artifacts/visual/collection-day-'+viewport.width+'.png',fullPage:true});
  }
  console.log('PASS '+viewport.width+'px: palette switching, 24-hour preview, persistence, 5 dark routes');
  console.log('PASS '+viewport.width+'px: 5 routes, navigation, game state persistence, layout');
  await page.close();
 }
 // Checkpoint 2: migrate a real legacy Zustand envelope inside Chromium.
 const legacyEnvelope=JSON.parse(readFileSync(
   new URL('../tests/fixtures/v1-pip-customized.json',import.meta.url),'utf8'));
 const legacyPage=await browser.newPage({viewport:{width:390,height:844}});
 legacyPage.on('pageerror',err=>errors.push('legacy: pageerror '+err.message));
 await legacyPage.addInitScript(({envelope})=>{
   const key='lumenette-hollow-save';
   if(localStorage.getItem(key)===null)localStorage.setItem(key,JSON.stringify(envelope));
 },{envelope:legacyEnvelope});
 await legacyPage.goto(host,{waitUntil:'networkidle'});
 await legacyPage.getByRole('navigation',{name:'Mobile navigation'})
   .getByRole('link',{name:'Yarn'}).click();
 await legacyPage.waitForFunction(()=>document.querySelector('.preview-card h2')?.textContent?.includes('Pip the First'),
   null,{timeout:4000});
 const afterHydration=await legacyPage.evaluate(
   ()=>JSON.parse(localStorage.getItem('lumenette-hollow-save')));
 assert.equal(afterHydration.version,2,'v1 envelope was not migrated to persist version 2');
 assert.equal(afterHydration.state.saveVersion,2,'v2 domain version was not persisted');
 for(const field of ['yarn','level','ownedColors','decor','battery','lastClaimMs','nextUpgradeMs','wanderCount','visitCount','gateOpen']){
   assert.deepEqual(afterHydration.state[field],legacyEnvelope.state[field],
     'v1 migration lost historic field '+field);
 }
 assert.equal(afterHydration.state.critters.length,1,'Migrating v1 must not duplicate Pip');
 assert.equal(afterHydration.state.critters[0].id,'critter-000001');
 assert.equal(afterHydration.state.critters[0].name,'Pip the First');
 assert.equal(afterHydration.state.critters[0].appearance.color,'lavender');
 assert.equal(afterHydration.state.activeCritterId,'critter-000001');
 assert.equal(afterHydration.state.favoriteCritterId,'critter-000001');
 for(const obsolete of ['name','color','face','accessory']){
   assert.equal(Object.hasOwn(afterHydration.state,obsolete),false,
     'Legacy view field '+obsolete+' must not be persisted as canonical state');
 }
 const backup=await legacyPage.evaluate(
   ()=>localStorage.getItem('lumenette-hollow-save-v1-backup'));
 assert.deepEqual(JSON.parse(backup),legacyEnvelope,'Original v1 envelope was not backed up intact');
 const appearanceBefore=await legacyPage.evaluate(
   ()=>localStorage.getItem('lumenette-hollow-appearance-v1'));

 // Create an independently named critter; distinguish active from favorite.
 await legacyPage.getByRole('button',{name:/Make another Lumenette/}).click();
 assert.equal(await legacyPage.locator('.critter-card').count(),2);
 const second=legacyPage.locator('.critter-card').nth(1);
 await second.getByRole('button',{name:'Favorite Lumenette 2'}).click();
 await legacyPage.getByRole('textbox',{name:"Companion's name"}).fill('Wisp');
 await legacyPage.getByRole('button',{name:'Save',exact:true}).click();
 assert.ok((await second.innerText()).includes('Wisp'));
 await legacyPage.locator('.critter-card').first().getByRole('button',{name:'Customize',exact:true}).click();
 assert.ok((await legacyPage.locator('.preview-card h2').innerText()).includes('Pip the First'));
 const edited=await legacyPage.evaluate(
   ()=>JSON.parse(localStorage.getItem('lumenette-hollow-save')));
 assert.equal(edited.state.critters.length,2);
 assert.equal(edited.state.critters[0].name,'Pip the First');
 assert.equal(edited.state.critters[1].name,'Wisp');
 assert.equal(edited.state.favoriteCritterId,'critter-000002');
 assert.equal(edited.state.activeCritterId,'critter-000001');
 assert.deepEqual(edited.state.household.residentIds,['critter-000001','critter-000002']);
 assert.equal(await legacyPage.evaluate(
   ()=>localStorage.getItem('lumenette-hollow-appearance-v1')),appearanceBefore);

 await legacyPage.reload({waitUntil:'networkidle'});
 assert.ok((await legacyPage.locator('.preview-card h2').innerText()).includes('Pip the First'));
 assert.equal(await legacyPage.locator('.critter-card').count(),2);
 const afterReload=await legacyPage.evaluate(
   ()=>JSON.parse(localStorage.getItem('lumenette-hollow-save')));
 assert.deepEqual(afterReload.state,edited.state,'v2 collection changed across browser reload');
 assert.deepEqual(JSON.parse(await legacyPage.evaluate(
   ()=>localStorage.getItem('lumenette-hollow-save-v1-backup'))),legacyEnvelope,
 'Backup changed after v2 reload');
 await legacyPage.close();
 console.log('PASS: Chromium migrated synthetic v1 Pip to v2; independent favorite, rename and reload preserved');
 if(errors.length)throw Error(errors.join('\n'));
 console.log('PASS: no JS page or console errors');
}finally{await browser?.close();server.kill();}
