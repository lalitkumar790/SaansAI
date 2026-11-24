import test from "node:test";
import assert from "node:assert/strict";
import ts from "typescript";
import {readFileSync} from "node:fs";
const source=readFileSync(new URL("../lib/indoor.ts",import.meta.url),"utf8");
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {indoorSizing}=await import("data:text/javascript;base64,"+Buffer.from(js).toString("base64"));
test("room sizing uses volume and equivalent air changes",()=>{
 const r=indoorSizing(4,3,3,180,5);
 assert.deepEqual(r,{volume:36,requiredCadr:180,providedAch:5});
});
test("invalid room dimensions and targets are rejected",()=>{
 for(const n of [0,-1,NaN,Infinity])assert.equal(indoorSizing(n,3,3,180,5),null);
 assert.equal(indoorSizing(4,3,3,180,0),null);
});
test("missing purifier delivery is not interpreted as measured air quality",()=>{
 assert.equal(indoorSizing(4,3,3,NaN,5).providedAch,null);
 assert.equal(indoorSizing(4,3,3,0,5).providedAch,0);
});
