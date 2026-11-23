import {advice,category,commuteImpact,type Air,type Profile} from "./air";
export function ruleBasedAnswer(question:string,air:Air,p:Profile){
 const q=question.toLowerCase(); const level=category(air.usAqi).level;
 const location=air.city+(air.isDemo?" (illustrative demo air readings)":" (modeled air-quality estimate)");
 const cautious=level>=4?"At this level, minimize unnecessary time outdoors and avoid strenuous outdoor activity.":level>=3?"Consider reducing outdoor exertion, particularly for more sensitive family members.":"Even when area-wide pollution looks lower, avoid heavy traffic and local smoke.";
 const vulnerable=p.family!=="general"?" Children, older adults, and people with respiratory sensitivities may need extra precautions.":"";
 const intro="For "+location+", US AQI is "+(air.usAqi??"not available")+". "+cautious+vulnerable;
 const indoor="For a lower-cost indoor plan: avoid incense, smoking, candles and unnecessary frying smoke; wet-dust or damp-mop rather than dry-sweeping; seal obvious drafts where practical. If outdoor pollution is high, avoid leaving windows open continuously; ventilate briefly only when outdoor conditions improve and ventilation is necessary. A correctly sized HEPA purifier can reduce fine particles, but without an indoor sensor we cannot quantify indoor air quality.";
 const masks="If going outside is unavoidable, reduce time near busy roads and heavy exertion. A correctly fitted N95 or equivalent respirator can help filter particles, but must fit the wearer; do not assume respirators are appropriate for very young children. Follow local health and school advisories.";
 const commute=commuteImpact(p);
 const transport="For a "+p.distance+" km one-way commute, this simple round-trip comparison estimates "+commute.soloKg+" kg CO₂e by solo car versus "+commute.transitKg+" kg CO₂e by shared transit — about "+commute.savedKg+" kg less with shared transit, using illustrative assumptions only. The greener choice is not automatically the lowest-exposure journey; favor well-ventilated or filtered vehicles and avoid high-traffic roadside waiting where possible.";
 const child="For school and children: check the school and local authority advisory, avoid outdoor PE/assembly during elevated pollution, prioritize indoor activities in lower-smoke or filtered rooms, and shorten unavoidable roadside exposure. Families should discuss any respiratory treatment plan with a clinician.";
 const activity="For exercise, choose an indoor workout in a lower-pollution space when outdoor AQI is elevated. Compare the modeled hourly trend, but a lower forecast value isn't a guarantee of safety; avoid treating a specific clock hour as safe.";
 const symptoms="For coughing or irritation, reduce smoke and dust exposure and follow existing medical guidance. I can't diagnose symptoms. Severe breathlessness, chest pain, blue lips, confusion, or rapidly worsening breathing warrants urgent medical attention.";
 const plants="Houseplants are not a substitute for HEPA filtration or source control. Their ability to clear fine particles in typical homes is too small to rely upon. Avoid indoor smoke sources and use appropriate filtration instead.";
 let body=activity+" "+masks;
 if(/school|child|kid|baby|bach|बच्च|स्कूल|student/.test(q))body=child+" "+masks;
 else if(/purif|indoor|home|room|window|ventilat|filter|sasta|budget|घर|खिड़|कमरा|सस्ता|clean air/.test(q))body=indoor;
 else if(/plant|money plant|snake plant/.test(q))body=plants+" "+indoor;
 else if(/metro|bus|commut|traffic|car|travel|office|bike|walk|carbon|co2|emission|transport|ride|बस|गाड़ी/.test(q))body=transport;
 else if(/cough|asthma|breath|symptom|chest|doctor|खांसी|सांस/.test(q))body=symptoms+" "+masks;
 else if(/exercise|running|jog|walk|play|outdoor|park|morning|evening|workout|सुबह|शाम|दौड़/.test(q))body=activity+" "+masks;
 else body=advice(air.usAqi,p).map(t=>t.title+": "+t.body).join(" ")+" "+masks;
 const hindi=/[\u0900-\u097F]/.test(question);
 if(hindi)return "आपके शहर "+air.city+" का मॉडल-आधारित US AQI "+(air.usAqi??"उपलब्ध नहीं")+" है। प्रदूषण बढ़ने पर बाहर मेहनत वाला व्यायाम कम रखें। घर में अगरबत्ती/धुआँ कम करें, ज़रूरत हो तो सही HEPA फिल्टर इस्तेमाल करें। बच्चों और बुज़ुर्गों के लिए स्थानीय स्वास्थ्य/स्कूल निर्देश देखें। "+(air.isDemo?"ये डेमो रीडिंग है। ":"")+"यह सामान्य सलाह है, मेडिकल निदान नहीं।";
 return intro+"\n\n"+body+"\n\nThis is general guidance, not medical diagnosis. Air measurements are modeled and indoor air is not monitored.";
}
