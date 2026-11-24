import type {Air} from "./air";
export const SNAPSHOT_KEY="saans-air-snapshot-v1";
export function validateSnapshot(value:unknown):Air|null{
 if(!value||typeof value!=="object")return null;
 const d=value as Partial<Air>;
 if(typeof d.city!=="string"||d.city.length<2||typeof d.updated!=="string"||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(d.updated)||!Array.isArray(d.hourly)||d.hourly.length>96)return null;
 const metric=(n:unknown)=>n===null||(typeof n==="number"&&Number.isFinite(n)&&n>=0&&n<5000);
 if(!metric(d.usAqi)||!metric(d.pm25)||!metric(d.pm10))return null;
 if(!d.hourly.every(v=>v&&typeof v.time==="string"&&metric(v.aqi)&&metric(v.pm25)))return null;
 if(typeof d.country!=="string"||typeof d.latitude!=="number"||typeof d.longitude!=="number"||!Number.isFinite(d.latitude)||!Number.isFinite(d.longitude))return null;
 return {...d,city:d.city.slice(0,80),source:"Open-Meteo",hourly:d.hourly.slice(0,72),isStale:true,isDemo:Boolean(d.isDemo)} as Air;
}
export function snapshotAgeHours(air:Air,now=new Date()):number|null{
 const last=Date.parse(air.updated);
 if(!Number.isFinite(last))return null;
 return Math.max(0,(now.getTime()-last)/3600000);
}
