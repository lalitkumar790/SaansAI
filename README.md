# 🌿 SaansAI — Breathe smarter. Live greener.

**Challenge 6 · Urban Air Quality Assistant · Hackathon prototype**

A location-aware, family-first air quality companion that turns pollution readings into **actionable, explainable routines**. Designed to demo in minutes, run on Vercel, and remain honest about uncertainties.

## ✨ The demo
1. Search **Delhi**, **Bhopal**, **Mumbai**, **Lucknow**, or any supported city.
2. See modeled **US AQI**, PM2.5, PM10, and a 12-hour AQI outlook.
3. Choose a household profile: **children**, **older adults**, or **respiratory sensitivity**. Observe advice adapt.
4. Open the **Impact studio** to compare *illustrative* solo-car and shared-transit CO₂e estimates.
5. Ask **SaansAI** about school, exercise, commuting, indoor air, or low-cost mitigation. Add a Gemini API key for generative answers; without one, the assistant clearly identifies its rule-based fallback.

## Why it's different
- **Family-aware**, not one-size-fits-all.
- **Actions + reasons** instead of an AQI number only.
- **Exposure and emissions separated**: a greener journey can still involve high pollution exposure.
- **Transparent data provenance**: Open-Meteo provides modeled environmental estimates; we do **not** claim on-site sensor readings.
- **Graceful degradation**: no AI key required; network outage results in a visibly labeled sample for interface demonstration.

## Stack
- Next.js 15 (App Router), TypeScript, React 19, CSS, Lucide
- Open-Meteo Geocoding API and Air Quality API
- Optional Gemini REST API: server-side, never exposed to browser
- Vercel-ready, no database or login required

## Start locally
```bash
git clone https://github.com/lalitkumar790/SaansAI.git
cd SaansAI
npm install
cp .env.example .env.local
npm run dev
```
On Windows PowerShell, use `Copy-Item .env.example .env.local`. Visit http://localhost:3000.

### Optional AI key
Set `GEMINI_API_KEY` inside `.env.local`. Optionally override `GEMINI_MODEL` with a model available to your key. If absent or upstream fails, chat uses safety-first rule-based guidance and labels it accordingly.

## Deploy to Vercel
Import the GitHub repository into Vercel. Framework preset: **Next.js**. Build command: `npm run build`. Add `GEMINI_API_KEY` as an environment variable if you want GenAI responses. Trigger redeploy after adding the secret. Public air-quality fetch needs outbound network access.

## Limitations and scientific integrity
- **US AQI**, not India's NAQI. Do not mix category thresholds across standards.
- Open-Meteo air quality is **modeled**, not a real-time local sensor measurement. Coverage, temporal accuracy, and location detail vary.
- Indoor air is **not measured**. A HEPA purifier can help reduce particles, but SaansAI does not calculate an actual indoor AQI.
- Forecasted lower AQI does **not** imply outdoor activity is safe.
- Commute numbers are **illustrative assumptions**, not lifecycle analysis or measured emission offsets. They use round-trip kilometers × 180 g CO₂e/pkm (solo car) and 70 g CO₂e/pkm (shared transit), chosen only to make the trade-off understandable. Location-specific emission factors, occupancy, traffic and electricity mix vary.
- Sensitive users should follow local advisories and medical advice. This prototype does not provide diagnoses.
- The city selector accepts approximate place names rather than GPS, protecting privacy by default.

## Demo script (90 seconds)
**0–20 s:** Start in Delhi. Point to the modeled AQI, particulate breakdown and upcoming trend.
**20–45 s:** Change family type from healthy adults to children. Show how advice becomes more protective.
**45–65 s:** Enter a 12 km commute. Show CO₂e estimates and explicitly note that reduced vehicle emissions do not guarantee reduced exposure.
**65–90 s:** Ask, “My child has school tomorrow. What should I do?” Show an answer with precautions and a rationale; distinguish Gemini and fallback modes.

## Prototype roadmap (72 hours)
- **Day 1:** functioning data + dashboard + planner ✅ in repo
- **Day 2:** Gemini key + real-device QA + better city coverage and UI fixes
- **Day 3:** Vercel launch + screenshots + 90-second video + pitch slides

## References
- [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- [US EPA AQI basics](https://www.airnow.gov/aqi/aqi-basics/)
- [US EPA indoor air quality](https://www.epa.gov/indoor-air-quality-iaq)

Built for the **Urban Air Quality Assistant** challenge. 🌱
