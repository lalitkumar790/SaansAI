import test from "node:test";
import assert from "node:assert/strict";
import ts from "typescript";
import {readFileSync} from "node:fs";
const load=async(name,deps={})=>{
 let src=readFileSync(new URL("../lib/"+name+".ts",import.meta.url),"utf8");
 let js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 for(const [k,v] of Object.entries(deps))js=js.replaceAll('"./'+k+'"',JSON.stringify(v));
 const url="data:text/javascript;base64,"+Buffer.from(js).toString("base64");
 return {url,mod:await import(url)};
};
const airLib=await load("air");
const {mod:assistant}=await load("assistant",{air:airLib.url});
const {mod:planner}=await load("planner");
const {mod:commute}=await load("commute");
const air={city:"Agra",country:"India",updated:"2026-11-24T06:00",usAqi:176,pm25:90,pm10:120,hourly:[{time:"2026-11-24T07:00",aqi:170,pm25:90},{time:"2026-11-24T08:00",aqi:150,pm25:70}],source:"Open-Meteo",isDemo:false};
const profile={family:"elderly",transport:"walk",distance:8,outdoor:"morning",purifier:false};
test("elderly sensitive family receives conservative guidance",()=>assert.match(assistant.ruleBasedAnswer("elderly outdoor plans",air,profile),/older adults|respiratory/i));
test("Hindi and Hinglish guidance",()=>{
 assert.match(assistant.ruleBasedAnswer("बच्चे स्कूल जाएं?",air,profile),/[\u0900-\u097f]/);
 assert.match(assistant.ruleBasedAnswer("mera bachcha school jaye kya",air,profile),/School advisory check karein/);
});
test("emergency takes precedence over school and indoor context",()=>{
 assert.match(assistant.ruleBasedAnswer("My child at school cannot breathe",air,profile),/emergency medical help immediately/i);
 assert.match(assistant.ruleBasedAnswer("सीने में दर्द",air,profile),/आपातकालीन/);
});
test("unsupported future date never receives current AQI as forecast",()=>{
 const f=planner.relevantForecast(air,"school on 2026-12-25",profile);
 assert.equal(f.hasForecast,false);assert.equal(f.windowAverageAqi,null);
});
test("missing forecast prevents incomplete commute exposure calculation",()=>{
 assert.deepEqual(commute.departureOptions({...air,hourly:[]},8,"walk"),[]);
 assert.deepEqual(commute.departureOptions({...air,hourly:[air.hourly[0]]},8,"walk"),[]);
});
test("missing AQI explicitly disclosed",()=>assert.match(assistant.ruleBasedAnswer("outdoor plans",{...air,usAqi:null},profile),/unavailable/));
