export function indoorSizing(length:number,width:number,height:number,cadr:number,targetAch:number){
 const valid=[length,width,height,targetAch].every(v=>Number.isFinite(v)&&v>0);
 if(!valid)return null;
 const volume=length*width*height;
 return {volume,requiredCadr:volume*targetAch,providedAch:Number.isFinite(cadr)&&cadr>=0?cadr/volume:null};
}

export function ventilationWindows(air:{updated:string;hourly:{time:string;pm25:number|null}[]}){
 const start=air.updated.slice(0,13)+":00";
 const points=air.hourly.filter(p=>p.time.slice(0,16)>start).sort((a,b)=>a.time.localeCompare(b.time)).slice(0,24);
 return points.filter(p=>p.pm25!==null&&Number.isFinite(p.pm25)&&p.pm25>=0).sort((a,b)=>a.pm25!-b.pm25!).slice(0,3);
}
