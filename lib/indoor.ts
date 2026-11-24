export function indoorSizing(length:number,width:number,height:number,cadr:number,targetAch:number){
 const valid=[length,width,height,targetAch].every(v=>Number.isFinite(v)&&v>0);
 if(!valid)return null;
 const volume=length*width*height;
 return {volume,requiredCadr:volume*targetAch,providedAch:Number.isFinite(cadr)&&cadr>=0?cadr/volume:null};
}
