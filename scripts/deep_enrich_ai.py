import json
import os
import sys
import time
from dotenv import load_dotenv

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("google-genai is not installed. Please install it using: pip install google-genai")
    sys.exit(1)

def enrich_codes(api_key):
    print("Starting Deep Enrichment for OBD2 Codes using Gemini AI (Multilingual)...")
    
    client = genai.Client(api_key=api_key)
    
    db_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'base_codes.json')
    
    if not os.path.exists(db_path):
        print(f"Error: {db_path} not found.")
        return
        
    with open(db_path, 'r', encoding='utf-8') as f:
        codes = json.load(f)
        
    total_codes = len(codes)
    print(f"Loaded {total_codes} codes from base_codes.json")
    
    system_prompt = """
    You are an ASE Certified Master Mechanic and an expert automotive translator.
    Your task is to provide extremely detailed, accurate, and unique diagnostic and repair information for the given OBD2 code in 5 languages: English (en), Turkish (tr), German (de), Spanish (es), and French (fr).
    You must return a JSON object strictly matching this schema:
    {
      "title": { "en": "...", "tr": "...", "de": "...", "es": "...", "fr": "..." },
      "description": { "en": "...", "tr": "...", "de": "...", "es": "...", "fr": "..." },
      "diagnosticSteps": {
        "en": ["Step 1...", "Step 2..."],
        "tr": ["Adım 1...", "Adım 2..."],
        "de": ["Schritt 1...", "Schritt 2..."],
        "es": ["Paso 1...", "Paso 2..."],
        "fr": ["Étape 1...", "Étape 2..."]
      },
      "commonFixes": {
        "en": ["Replace X", "Clean Y"],
        "tr": ["X'i değiştir", "Y'yi temizle"],
        "de": ["X ersetzen", "Y reinigen"],
        "es": ["Reemplazar X", "Limpiar Y"],
        "fr": ["Remplacer X", "Nettoyer Y"]
      },
      "drivingSafety": {
        "level": "safe", 
        "description": { "en": "...", "tr": "...", "de": "...", "es": "...", "fr": "..." }
      },
      "costBreakdown": {
        "parts": "$X - $Y",
        "labor": "$X - $Y"
      }
    }
    The diagnostic steps should be 3-5 practical steps. Common fixes should be 2-4 solutions.
    Make the content highly specific to the code provided. The tone must be professional.
    Ensure 'title' is a short, accurate translation of the code's official title.
    """

    count = 0
    for code, data in codes.items():
        if "diagnosticSteps" in data:
            continue
            
        # Handle string titles safely
        title_str = data.get('title', '')
        if isinstance(title_str, dict):
            title_str = title_str.get('en', '')
            
        desc_str = data.get('description', '')
        if isinstance(desc_str, dict):
            desc_str = desc_str.get('en', '')

        print(f"\nProcessing {code} ({count+1}/{total_codes}): {title_str}")
        
        user_prompt = f"Provide detailed diagnostic information for OBD2 code {code}. Title: {title_str}. Description: {desc_str}"
        
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    response_mime_type="application/json",
                    temperature=0.2,
                )
            )
            
            enrichment_data = json.loads(response.text)
            
            # Merge new data
            data["title"] = enrichment_data.get("title", data.get("title"))
            data["description"] = enrichment_data.get("description", data.get("description"))
            data["diagnosticSteps"] = enrichment_data.get("diagnosticSteps", {})
            data["commonFixes"] = enrichment_data.get("commonFixes", {})
            data["drivingSafety"] = enrichment_data.get("drivingSafety", {})
            data["costBreakdown"] = enrichment_data.get("costBreakdown", {})
            
            count += 1
            if count % 5 == 0:
                with open(db_path, 'w', encoding='utf-8') as f:
                    json.dump(codes, f, indent=2)
                print(f"--- Saved progress ({count} codes processed) ---")
                
            time.sleep(5) # Delay to respect rate limits
            
        except Exception as e:
            error_msg = str(e)
            print(f"Error processing {code}: {error_msg}")
            if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
                print("Rate limit reached. Waiting for 60 seconds...")
                time.sleep(60)
                with open(db_path, 'w', encoding='utf-8') as f:
                    json.dump(codes, f, indent=2)
            else:
                time.sleep(5)
            
    with open(db_path, 'w', encoding='utf-8') as f:
        json.dump(codes, f, indent=2)
        
    print("\nMultilingual Deep Enrichment Completed Successfully!")

if __name__ == "__main__":
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if len(sys.argv) > 1:
        api_key = sys.argv[1]
        
    if not api_key:
        print("Usage: python deep_enrich_ai.py <GEMINI_API_KEY>")
        sys.exit(1)
        
    enrich_codes(api_key)
