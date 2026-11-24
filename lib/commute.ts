import type {Profile} from "./air";
export const commuteModes = [
 {mode:"car",label:"Solo car",speed:25,factor:180},
 {mode:"bus",label:"Bus",speed:18,factor:70},
 {mode:"metro",label:"Metro",speed:30,factor:40},
 {mode:"walk",label:"Walking",speed:4.5,factor:0},
 {mode:"bike",label:"Cycling",speed:14,factor:0}
] as const;
export function compareCommutes(distance:number,pm25:number|null){
 const km=Number.isFinite(distance)?Math.max(0,Math.min(200,distance)):0;
 const concentration=pm25!==null&&Number.isFinite(pm25)&&pm25>=0?pm25:null;
 return commuteModes.map(m=>{
  const hours=2*km/m.speed;
  return {mode:m.mode as Profile["transport"],label:m.label,minutes:Math.round(hours*60),kg:Math.round(2*km*m.factor/10)/100,ambientProxy:concentration===null?null:Math.round(concentration*hours*10)/10,speed:m.speed,factor:m.factor};
 });
}
