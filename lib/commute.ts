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

export function departureOptions(air:{updated:string;hourly:{time:string;pm25:number|null}[]},distance:number,mode:Profile["transport"]){
 const m=commuteModes.find(x=>x.mode===mode);
 if(!m||!Number.isFinite(distance)||distance<=0)return [];
 const duration=distance/m.speed;
 const start=air.updated.slice(0,13)+":00";
 const points=air.hourly.slice().sort((a,b)=>a.time.localeCompare(b.time));
 const lookup=new Map(points.map(p=>[p.time.slice(0,16),p.pm25]));
 return points.filter(p=>p.time.slice(0,16)>start&&Number(p.time.slice(11,13))>=6&&Number(p.time.slice(11,13))<=21).slice(0,24).flatMap(p=>{
  const t=Date.parse(p.time.slice(0,16)+":00Z");if(!Number.isFinite(t))return [];
  let total=0;
  for(let i=0;i<Math.ceil(duration);i++){
   const key=new Date(t+i*3600000).toISOString().slice(0,16);
   const pm=lookup.get(key);
   if(pm==null||!Number.isFinite(pm)||pm<0)return [];
   total+=pm*Math.min(1,duration-i);
  }
  return [{time:p.time,minutes:Math.round(duration*60),ambientProxy:Math.round(total*10)/10}];
 }).sort((a,b)=>a.ambientProxy-b.ambientProxy).slice(0,3);
}
