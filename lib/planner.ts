import type {Air,Profile} from "./air";
export type ForecastPoint=Air["hourly"][number];
export type Period="morning"|"afternoon"|"evening";
export type PlannerDay="today"|"tomorrow";
const ranges:Record<Period,[number,number]>={morning:[6,11],afternoon:[12,17],evening:[17,22]};
const labels:Record<Period,string>={morning:"6–11 AM",afternoon:"12–5 PM",evening:"5–10 PM"};
export function localDateFromAir(air:Air){return air.updated.slice(0,10)}
export function dateOffset(localDate:string,days:number){const parsed=new Date(localDate+"T12:00:00Z");if(Number.isNaN(parsed.getTime()))return "";parsed.setUTCDate(parsed.getUTCDate()+days);return parsed.toISOString().slice(0,10)}
export function forecastForDate(air:Air,date:string,period:Period){const [first,last]=ranges[period];const points=air.hourly.filter(p=>!air.isStale&&p.time.slice(0,10)===date&&Number(p.time.slice(11,13))>=first&&Number(p.time.slice(11,13))<last&&typeof p.aqi==="number");const values=points.map(p=>p.aqi as number);return {date,period,label:labels[period],min:values.length?Math.min(...values):null,max:values.length?Math.max(...values):null,average:values.length?Math.round(values.reduce((a,b)=>a+b,0)/values.length):null,points}}
export function forecastFor(air:Air,day:PlannerDay,period:Period){return forecastForDate(air,dateOffset(localDateFromAir(air),day==="tomorrow"?1:0),period)}
export function nextDaySchedule(air:Air,day:PlannerDay,p:Profile){return (["morning","afternoon","evening"] as const).map(period=>{const forecast=forecastFor(air,day,period);const value=forecast.max;const caution=p.family!=="general";const recommendation=value===null?"Forecast unavailable: check again before going outside.":value>200?"Avoid outdoor exercise; minimize unavoidable outdoor exposure.":value>150?"Prefer indoor exercise; reduce outdoor exposure and exertion.":value>100?(caution?"For sensitive family members, limit prolonged outdoor exertion.":"Consider lighter outdoor activities away from traffic."):value>50?"Check local conditions before longer outdoor activity.":"Lower modeled pollution; normal precautions still apply.";return {...forecast,recommendation}})}
export function relevantForecast(air:Air,message:string,p:Profile){
 const q=message.toLowerCase();
 const explicitDate=q.match(/\b\d{4}-\d{2}-\d{2}\b/)?.[0];
 const requestedTomorrow=/tomorrow|next day|kal\b|कल|अगले दिन|अगली सुबह/.test(q);
 const date=explicitDate||dateOffset(localDateFromAir(air),requestedTomorrow?1:0);
 const tomorrow=date===dateOffset(localDateFromAir(air),1);
 const day:PlannerDay=tomorrow?"tomorrow":"today";
 const period:Period=/morning|subah|सुबह|school|स्कूल/.test(q)?"morning":/afternoon|dopahar|दोपहर/.test(q)?"afternoon":/evening|night|shaam|शाम|रात/.test(q)?"evening":p.outdoor;
 const window=forecastForDate(air,date,period);
 const twelveHour=q.match(/\b(1[0-2]|0?[1-9])(?::([0-5]\d))?\s*(am|pm)\b/);
 const twentyFourHour=q.match(/\b(?:at\s+)?([01]?\d|2[0-3]):([0-5]\d)\b/);
 const hour=twelveHour?((Number(twelveHour[1])%12)+(twelveHour[3]==="pm"?12:0)):twentyFourHour?Number(twentyFourHour[1]):null;
 const hourKey=hour===null?null:date+"T"+String(hour).padStart(2,"0")+":00";
 const hourValue=hourKey&&!air.isStale?air.hourly.find(p=>p.time.slice(0,13)===hourKey.slice(0,13)&&typeof p.aqi==="number")?.aqi??null:null;
 return {day,date,period:window.period,clock:window.label,requestedHour:hour,hourAqi:hourValue,windowMinAqi:window.min,windowMaxAqi:window.max,windowAverageAqi:window.average,hasForecast:window.average!==null,forecastBasis:"Open-Meteo modeled US AQI hourly forecast in city-local clock time",todayRequested:/today|aaj\b|आज/.test(q),futureRequested:tomorrow||Boolean(explicitDate&&explicitDate!==localDateFromAir(air))}
}
