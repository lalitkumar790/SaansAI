import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {setTimeout as sleep} from "node:timers/promises";

const port=3010;
const url="http://127.0.0.1:"+port;
const child=spawn(process.execPath,["node_modules/next/dist/bin/next","start","-p",String(port)],{
 cwd:process.cwd(),env:{...process.env,GEMINI_API_KEY:""},stdio:["ignore","pipe","pipe"]
});
let serverLogs="";
for(const stream of [child.stdout,child.stderr])stream.on("data",chunk=>{serverLogs+=String(chunk).slice(0,2000)});
try{
 let healthy=false;
 for(let i=0;i<60;i++){if(child.exitCode!==null)break;try{const r=await fetch(url,{signal:AbortSignal.timeout(1200)});if(r.status===200){healthy=true;break}}catch{}await sleep(500)}
 assert.ok(healthy,"Next.js server did not start. "+serverLogs.slice(-1000));
 const home=await fetch(url);assert.equal(home.status,200);assert.match(await home.text(),/SaansAI/);
 const air={city:"Agra",country:"India",latitude:27.17,longitude:78.0,updated:"2026-11-24T15:00",usAqi:176,pm25:70,pm10:120,source:"Open-Meteo",isDemo:true,hourly:[{time:"2026-11-25T08:00",aqi:167,pm25:69},{time:"2026-11-25T09:00",aqi:165,pm25:67}]};
 const profile={family:"children",transport:"car",distance:8,outdoor:"morning",purifier:false};
 const call=async(payload)=>fetch(url+"/api/chat",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)});
 const reply=await call({message:"My 8-year-old child goes to school tomorrow at 8 AM",air,profile});
 assert.equal(reply.status,200);const data=await reply.json();assert.equal(data.mode,"rules");assert.match(data.reply,/2026-11-25/);assert.match(data.reply,/167/);
 const emergency=await call({message:"My child cannot breathe",air,profile});
 assert.equal(emergency.status,200);assert.match((await emergency.json()).reply,/emergency/i);
 const invalid=await call({message:"Hello",air:{},profile});assert.equal(invalid.status,400);
 console.log("HTTP smoke tests passed: homepage, tomorrow forecast fallback, urgent medical guard, invalid input.");
}catch(error){console.error(error);console.error("Server logs:",serverLogs.slice(-2500));process.exitCode=1}finally{child.kill("SIGTERM");await sleep(300)}
