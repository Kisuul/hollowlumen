// Design-token checks — built-in Node.js modules only; no runtime app imports.
import { readFileSync } from "node:fs";
const data = JSON.parse(readFileSync(new URL("../docs/design/tokens/visual.tokens.json",import.meta.url),"utf8"));
const errors=[];
const get=path=>path.split(".").reduce((o,k)=>o?.[k],data);
const reference=/^\{([a-z0-9.-]+)\}$/i;
function resolve(path,seen=new Set()){
 if(seen.has(path))throw Error("Alias cycle: "+path);
 const token=get(path); if(!token||!("$value" in token))throw Error("Unknown token: "+path);
 const next=new Set(seen);next.add(path);const v=token.$value;
 if(typeof v==="string"&&reference.test(v))return resolve(reference.exec(v)[1],next);
 if(path.startsWith("palette.")){
   if(!v||v.colorSpace!=="srgb"||!Array.isArray(v.components)||v.components.length!==3||!/^#[a-f\d]{6}$/i.test(v.hex))throw Error("Bad color: "+path);
   const bytes=[1,3,5].map(i=>parseInt(v.hex.slice(i,i+2),16)/255);
   if(bytes.some((x,i)=>Math.abs(x-v.components[i])>1e-9))throw Error("Bad hex/components: "+path);
 }
 return v;
}
function luminance(hex){const [r,g,b]=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*r+.7152*g+.0722*b;}
function contrast(a,b){let x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
let checked=0;
function visit(node,parts=[]){
 if(node&&typeof node==="object"){
  if("$value" in node){try{resolve(parts.join("."));checked++;}catch(e){errors.push(e.message)}}
  else for(const [k,v]of Object.entries(node))if(!k.startsWith("$"))visit(v,[...parts,k]);
 }
}
visit(data);
const roles=["canvas","surface","surface-raised","text-primary","text-secondary","action-bg","action-fg","secondary-bg","secondary-fg","accent","focus","outline","separator","selection-bg","selection-fg","scene-warm","scene-cool","scene-flora","scene-petal"];
for(const mode of ["day","night"]){
 const c=role=>resolve("theme."+mode+"."+role).hex;
 for(const k of roles)try{c(k);checked++}catch(e){errors.push(e.message)}
 for(const [fg,bg,min]of[["text-primary","canvas",4.5],["text-primary","surface",4.5],["text-primary","surface-raised",4.5],["text-secondary","surface",4.5],["text-secondary","surface-raised",4.5],["action-fg","action-bg",4.5],["secondary-fg","secondary-bg",4.5],["selection-fg","selection-bg",4.5],["outline","surface",3],["focus","canvas",3],["focus","surface",3]]){
  try{const r=contrast(c(fg),c(bg));checked++;if(r<min)errors.push(mode+" "+fg+"/"+bg+" "+r.toFixed(2)+":1 < "+min+":1")}catch(e){errors.push(e.message)}
 }
}
if(errors.length){console.error("FAIL: "+errors.join("; "));process.exitCode=1;}else console.log("PASS: "+checked+" design-token and contrast checks");
