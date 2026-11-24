const windows=new Map<string,{start:number,count:number}>();
export function allowChatRequest(identity:string,now=Date.now(),limit=20,windowMs=60000){
 if(windows.size>4096){for(const [key,entry] of windows){if(now-entry.start>=windowMs)windows.delete(key)}}
 const entry=windows.get(identity);
 if(!entry||now-entry.start>=windowMs){windows.set(identity,{start:now,count:1});return true}
 if(entry.count>=limit)return false;
 entry.count++;
 return true;
}
export function validAirContext(input:unknown){
 if(!input||typeof input!=="object")return false;
 const a=input as Record<string,unknown>;
 const num=(value:unknown,max:number)=>value===null||(typeof value==="number"&&Number.isFinite(value)&&value>=0&&value<=max);
 if(typeof a.city!=="string"||a.city.length<2||a.city.length>100||typeof a.updated!=="string"||a.updated.length>45||!Array.isArray(a.hourly)||a.hourly.length>96||!num(a.usAqi,600)||!num(a.pm25,2000)||!num(a.pm10,3000))return false;
 return a.hourly.every((point:unknown)=>{if(!point||typeof point!=="object")return false;const p=point as Record<string,unknown>;return typeof p.time==="string"&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(p.time)&&num(p.aqi,600)&&num(p.pm25,2000)});
}
export function validProfile(input:unknown){
 if(!input||typeof input!=="object")return false;
 const p=input as Record<string,unknown>;
 return ["car","bus","metro","walk","bike"].includes(String(p.transport))&&["general","children","elderly","sensitive"].includes(String(p.family))&&["morning","afternoon","evening"].includes(String(p.outdoor))&&typeof p.distance==="number"&&Number.isFinite(p.distance)&&p.distance>=0&&p.distance<=50&&typeof p.purifier==="boolean";
}
