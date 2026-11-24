import test from "node:test";
import assert from "node:assert/strict";
import ts from "typescript";
import {readFileSync} from "node:fs";
const src=readFileSync(new URL("../lib/planner.ts",import.meta.url),"utf8");
const js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {forecastForDate,relevantForecast,forecastFor}=await import("data:text/javascript;base64,"+Buffer.from(js).toString("base64"));
const air={city:"Agra",updated:"2026-11-24T21:00",hourly:[],usAqi:150,pm25:80,pm10:100,source:"Open-Meteo"};
for(const d of ["24","25","26"]){const date="2026-11-"+d;for(let hour=0;hour<24;hour++){air.hourly.push({time:date+"T"+String(hour).padStart(2,"0")+":00",aqi:Number(d)+(hour%6),pm25:50})}}
const p={outdoor:"morning",family:"children",transport:"bus",distance:7,purifier:false};
test("tomorrow morning uses tomorrow morning only",()=>{const f=forecastFor(air,"tomorrow","morning");assert.equal(f.date,"2026-11-25");assert.equal(f.min,25);assert.equal(f.max,29);});
test("explicit supported future date uses the requested date",()=>{const f=relevantForecast(air,"school on 2026-11-26",p);assert.equal(f.date,"2026-11-26");assert.equal(f.windowMinAqi,26);assert.equal(f.hasForecast,true);});
test("unsupported future date never inherits today's readings",()=>{const f=relevantForecast(air,"school on 2026-12-25",p);assert.equal(f.hasForecast,false);assert.equal(f.windowAverageAqi,null);});
test("stale snapshot never presents forecasts",()=>{const f=forecastForDate({...air,isStale:true},"2026-11-25","morning");assert.equal(f.average,null);});
test("missing forecast entry does not invent values",()=>{const f=forecastForDate({...air,hourly:[]}, "2026-11-25","morning");assert.equal(f.min,null);assert.equal(f.max,null)});
