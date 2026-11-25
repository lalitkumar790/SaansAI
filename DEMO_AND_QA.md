# SaansAI — live judging demo and validation guide

**Challenge:** Urban Air Quality Assistant · **Application:** https://saans-ai.vercel.app

## One-sentence pitch
SaansAI transforms modeled outdoor air-quality data into explainable, family-specific choices for school, commuting and cleaner indoor living — without inventing sensor readings or confusing emission savings with health benefits.

## 90-second presenter script
| Time | Action | What to say |
| --- | --- | --- |
| 0–15 seconds | Open the site and select Agra or Delhi | "Air pollution isn't just a number. Families need to know what to do next. These are modeled US AQI estimates, not on-site readings." |
| 15–35 seconds | Choose the **School morning** scenario and inspect the Today/Tomorrow planner | "We personalize the forecast for children and show morning, afternoon and evening conditions. Tomorrow's values are forecast, not current measurements." |
| 35–55 seconds | Ask: **My child has school tomorrow at 8 AM. What should we do?** | "Our assistant extracts tomorrow's date and the requested hour. It handles school precautions and references uncertainty. Gemini can answer, but the safe rules also work without Gemini." |
| 55–72 seconds | Switch family profile to respiratory sensitivity; open the indoor cleaner-air panel | "Indoors, we estimate purifier capacity from room dimensions, but never claim to measure indoor AQI." |
| 72–90 seconds | Open the Impact Studio and compare bus, walking and car | "Lower CO₂e is not necessarily lower roadside particle exposure. Our impact figures are illustrative and show their assumptions." |

## Five-minute extended Q&A
1. **How is AQI calculated?** Open-Meteo provides modeled US AQI, PM2.5 and PM10. SaansAI displays this with attribution. US AQI thresholds are not Indian NAQI thresholds.
2. **What makes it contextual?** Family vulnerability, outdoor time window, city, commute choice and forecast interval change the recommended actions.
3. **How do you handle hallucinations?** Explicit system instructions, a deterministic emergency guard, forecast availability checks and a rules-based fallback. An external model is not a medical device.
4. **What if the network fails?** The UI can show a previously cached snapshot marked **stale**, or illustrative demo readings marked **demo**. Stale data cannot be used to claim future forecast safety.
5. **Can you prove health or environmental outcomes?** No clinical or field exposure validation is claimed. CO₂e factors, nominal travel speeds and ambient concentration-time proxies are examples, not measured benefits.

## Repeatable release checklist
- [ ] Latest GitHub Actions main branch: TypeScript, all tests, production build and HTTP smoke tests pass.
- [ ] Latest Vercel production deployment is **READY** and canonical domain resolves to its commit.
- [ ] Desktop check: city search, scenario selection and chat work after city loads.
- [ ] Mobile check: 360–390px viewport, menu, scenario cards, chart, form and chat do not overlap or clip.
- [ ] Data check: current AQI date/city, today/tomorrow periods and 8 AM forecast are distinct.
- [ ] Negative tests: invalid city, offline API, unavailable future date, emergency prompt, Gemini overload, invalid request.
- [ ] Demo recording: capture page, profile shift, date-specific forecast, explanatory response and impact caveat.
- [ ] Remove or redact API keys, logs, location, personal information and tokens from captures.

## Evidence and validation
- [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)
- [US AQI Basics](https://www.airnow.gov/aqi/aqi-basics/)
- [US EPA — Improving Indoor Air Quality](https://www.epa.gov/indoor-air-quality-iaq/improving-indoor-air-quality)
- [US EPA — Transportation, Air Pollution, and Climate Change](https://www.epa.gov/transportation-air-pollution-and-climate-change)
- [GitHub CI](https://github.com/lalitkumar790/SaansAI/actions)
- [Vercel deployment](https://vercel.com/lalitsikarwar2001-6516s-projects/saans-ai)

## Honest limitations and next research step
No calibrated air sensor, measured indoor AQI, individual dose model, medical outcome verification, validated commute emission factors or longitudinal A/B evaluation is provided. The most meaningful next phase is a small consent-based usability evaluation with ordinary users, plus comparisons against station readings and actual travel routes. These should be reported separately from simulated forecasts or illustrative scenarios.
