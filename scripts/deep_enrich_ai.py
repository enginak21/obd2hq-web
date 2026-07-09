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
    print("Starting Deep Enrichment for OBD2 Codes using Gemini AI...")
    
    client = genai.Client(api_key=api_key)
    
    # Path to the base codes JSON file
    db_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'base_codes.json')
    
    if not os.path.exists(db_path):
        print(f"Error: {db_path} not found.")
        return
        
    with open(db_path, 'r', encoding='utf-8') as f:
        codes = json.load(f)
        
    total_codes = len(codes)
    print(f"Loaded {total_codes} codes from base_codes.json")
    
    # Prompt template
    system_prompt = """
    You are an ASE Certified Master Mechanic with 30 years of experience.
    Your task is to provide extremely detailed, accurate, and unique diagnostic and repair information for the given OBD2 code.
    You must return a JSON object with the following schema:
    {
      "diagnosticSteps": ["Step 1...", "Step 2..."], // 3-5 highly detailed, practical steps to diagnose the issue
      "commonFixes": ["Replace X", "Clean Y"], // 2-4 actual solutions to fix the code
      "drivingSafety": {
        "level": "safe" | "caution" | "danger",
        "description": "Short explanation of whether it's safe to drive with this code and why."
      },
      "costBreakdown": {
        "parts": "$X - $Y",
        "labor": "$X - $Y"
      }
    }
    Make sure the content is highly specific to the code provided, not generic. Use a professional, authoritative tone.
    """

    count = 0
    # Process only codes that don't have the new fields yet
    for code, data in codes.items():
        if "diagnosticSteps" in data:
            continue # Skip already enriched codes
            
        print(f"\nProcessing {code} ({count+1}/{total_codes}): {data.get('title')}")
        
        user_prompt = f"Provide detailed diagnostic and repair information for OBD2 code {code}: {data.get('title')}\nDescription: {data.get('description')}"
        
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
            
            # Merge new data into existing code
            data["diagnosticSteps"] = enrichment_data.get("diagnosticSteps", [])
            data["commonFixes"] = enrichment_data.get("commonFixes", [])
            data["drivingSafety"] = enrichment_data.get("drivingSafety", {})
            data["costBreakdown"] = enrichment_data.get("costBreakdown", {})
            
            # Save progress every 10 codes
            count += 1
            if count % 10 == 0:
                with open(db_path, 'w', encoding='utf-8') as f:
                    json.dump(codes, f, indent=2)
                print(f"--- Saved progress ({count} codes processed) ---")
                
            time.sleep(1) # Simple rate limiting
            
        except Exception as e:
            print(f"Error processing {code}: {e}")
            time.sleep(5) # Wait a bit before retrying next
            
    # Final save
    with open(db_path, 'w', encoding='utf-8') as f:
        json.dump(codes, f, indent=2)
        
    print("\nDeep Enrichment Completed Successfully!")

if __name__ == "__main__":
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if len(sys.argv) > 1:
        api_key = sys.argv[1]
        
    if not api_key:
        print("Usage: python deep_enrich_ai.py <GEMINI_API_KEY>")
        print("Or set GEMINI_API_KEY in the .env file")
        sys.exit(1)
        
    enrich_codes(api_key)
