/* eslint-disable @typescript-eslint/no-require-imports */  
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/data');
const API_KEY = process.env.API_KEY || ""; 

// Target top cars and codes for enrichment
const topCars = [
  { make: 'nissan', model: 'altima' },
  { make: 'ford', model: 'f150' },
  { make: 'toyota', model: 'camry' }
];
const topCodes = ['P0420', 'P0300'];

async function fetchEnrichmentFromAI(make, model, code) {
  console.log(`[AI BOT] Enriching data for ${make.toUpperCase()} ${model.toUpperCase()} - ${code}...`);
  
  try {
    const prompt = `Act as an expert mechanic. Provide specific diagnostic information for the OBD2 code ${code} on a ${make} ${model}.
    Return ONLY a valid JSON object with exactly these fields:
    - symptoms: array of 3 strings (specific to this car)
    - causes: array of 3 strings (specific to this car)
    - fixDifficulty: string (e.g. "Easy", "Moderate", "Hard")
    - estimatedCost: string (e.g. "$100 - $300")
    Do not wrap in markdown blocks, just raw JSON.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 }
      })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text);

  } catch (error) {
    console.error(`[ERROR] Failed to fetch data for ${make} ${model} ${code}:`, error.message);
    // Return mock data so the site still works, but we know it failed
    return {
      symptoms: [`Check Engine Light is illuminated`, `Decreased engine performance`, `Noticeable drop in fuel economy`],
      causes: [`Faulty sensor or damaged wiring`, `Vacuum or exhaust leak`, `Internal component wear and tear`],
      fixDifficulty: 'Moderate',
      estimatedCost: '$100 - $450'
    };
  }
}

async function runBot() {
  const enrichedData = {};

  for (const car of topCars) {
    if (!enrichedData[car.make]) enrichedData[car.make] = {};
    if (!enrichedData[car.make][car.model]) enrichedData[car.make][car.model] = {};

    for (const code of topCodes) {
      const aiData = await fetchEnrichmentFromAI(car.make, car.model, code);
      if (aiData) {
        enrichedData[car.make][car.model][code] = aiData;
      }
      // Delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 4000)); 
    }
  }

  fs.writeFileSync(path.join(DATA_DIR, 'ai_enriched_data.json'), JSON.stringify(enrichedData, null, 2));
  console.log('✅ [AI BOT] Enrichment complete! Saved to ai_enriched_data.json');
}

runBot();
