import test from "node:test";
import assert from "node:assert/strict";
import ts from "typescript";
import {readFileSync} from "node:fs";
const source=readFileSync(new URL("../lib/commute.ts",import.meta.url),"utf8");
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {compareCommutes,departureOptions}=await import("data:text/javascript;base64,"+Buffer.from(js).toString("base64"));
test("round trip emissions and duration use declared factors",()=>{
 const rows=compareCommutes(8,90);
 assert.equal(rows.length,5);
 assert.equal(rows[0].kg,2.88);
 assert.equal(rows[0].minutes,38);
 assert.equal(rows[0].ambientProxy,57.6);
 assert.equal(rows[3].kg,0);
 assert.ok(rows[3].ambientProxy>rows[0].ambientProxy);
});
test("missing or invalid concentrations do not become zero exposure",()=>{
 for(const pm of [null,NaN,-1,Infinity])assert.ok(compareCommutes(8,pm).every(x=>x.ambientProxy===null));
});
test("zero distance yields zero modeled travel impact",()=>{
 assert.ok(compareCommutes(0,90).every(x=>x.kg===0&&x.minutes===0&&x.ambientProxy===0));
});

test("school and work departure comparison excludes overnight slots",()=>{const slots=Array.from({length:24},(_,h)=>({time:"2026-11-25T"+String(h).padStart(2,"0")+":00",pm25:100-h}));const selections=departureOptions({updated:"2026-11-24T22:00",hourly:slots},4,"bus");assert.ok(selections.length>0);assert.ok(selections.every(x=>Number(x.time.slice(11,13))>=6&&Number(x.time.slice(11,13))<=21));});
