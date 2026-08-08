import os
import json
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
import re
import time
import sys

try:
    from dotenv import load_dotenv
except ModuleNotFoundError:
    def load_dotenv():
        pass

load_dotenv()
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
NEWS_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "data", "news")

os.makedirs(NEWS_DIR, exist_ok=True)

RSS_FEEDS = [
    "https://www.autoblog.com/category/news/rss.xml",
    "https://www.motor1.com/rss/news/all/"
]

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

def call_gemini(prompt, temperature=0.7):
    if not GEMINI_API_KEY:
        return None
    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": temperature}
    }
    req = urllib.request.Request(api_url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
    
    for attempt in range(3):
        try:
            response = urllib.request.urlopen(req)
            result = json.loads(response.read().decode('utf-8'))
            text = result['candidates'][0]['content']['parts'][0]['text'].strip()
            
            # Clean Markdown JSON wrappers
            if text.startswith('```json'): text = text[7:]
            if text.startswith('```'): text = text[3:]
            if text.endswith('```'): text = text[:-3]
            return json.loads(text.strip())
        except urllib.error.HTTPError as e:
            if e.code == 429:
                print("Rate limit (429), sleeping 15s...")
                time.sleep(15)
            else:
                print(f"API Error: {e}")
                return None
        except Exception as e:
            print(f"JSON/API Parse Error: {e}")
            return None
    return None

def get_existing_news_titles():
    existing = []
    if os.path.exists(NEWS_DIR):
        for fname in os.listdir(NEWS_DIR):
            if fname.endswith('.json'):
                try:
                    with open(os.path.join(NEWS_DIR, fname), 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        if 'title' in data and 'en' in data['title']:
                            existing.append({"slug": data.get("slug", ""), "title": data['title']['en']})
                except:
                    pass
    return existing

def check_topical_relevance(title, description):
    prompt = f"""Evaluate if this news article is highly relevant to an OBD2, vehicle diagnostics, automotive technology, and car repair website.
    Relevant topics: OBD, ECU, diagnostics, vehicle repair, recalls, engine tech, EV/hybrid diagnostics, emissions, sensors, ADAS, major tech developments.
    Irrelevant topics: General gossip, politics, sports, crypto, general phones/gaming, celebrity cars, finance, standard car reviews without deep tech focus.
    
    Title: {title}
    Snippet: {description}
    
    Return strictly JSON: {{"relevant": boolean, "reason": "short explanation"}}
    """
    res = call_gemini(prompt, 0.1)
    if res and isinstance(res, dict):
        return res.get('relevant', False), res.get('reason', '')
    return False, "Parse error"

def check_duplicate(title, existing_titles):
    if not existing_titles:
        return False
        
    recent_titles = [e['title'] for e in existing_titles[-30:]]
    prompt = f"""Compare the NEW article against the EXISTING articles to check if it covers the exact same event, announcement, or subject.
    NEW Title: {title}
    
    EXISTING Titles:
    {json.dumps(recent_titles, indent=2)}
    
    Return strictly JSON: {{"is_duplicate": boolean}}
    """
    res = call_gemini(prompt, 0.1)
    if res and isinstance(res, dict):
        return res.get('is_duplicate', False)
    return False

def generate_english_master(title, description, source_url):
    prompt = f"""Write a highly professional, factual, and deeply informative English master article based on this snippet.
    Title: {title}
    Source URL: {source_url}
    Snippet: {description}
    
    CRITICAL QUALITY RULES:
    1. Information Gain: Extract actual facts. Do not just spin words. Add relevant context about OBD2, automotive technology, or diagnostic implications if applicable. Do NOT invent facts.
    2. Source Attribution: Acknowledge the source naturally (e.g., "According to reports...", "As recently detailed...").
    3. NO BOILERPLATE: Absolutely no copy-paste sentences like "Does this affect service access". Write from scratch.
    4. Length: 4 to 5 rich paragraphs.
    
    Return strictly JSON:
    {{
        "title": "Improved, engaging title",
        "summary": "1-2 sentence powerful summary",
        "content": "The full article text, paragraphs separated by \\n\\n",
        "category": "choose one: brand_news, modified_cars, chronic_issues, industry_news"
    }}
    """
    return call_gemini(prompt, 0.7)

def check_quality_gate(en_data):
    prompt = f"""Rate the quality of this automotive news article on a scale of 0 to 100.
    Criteria:
    - Information Gain & Factual Confidence (Does it sound real and informative?)
    - Source/News Value (Is it a meaningful update?)
    - No Boilerplate/Spam (Does it read like a premium article, free of repetitive AI fluff?)
    
    Article Title: {en_data['title']}
    Article Content: {en_data['content']}
    
    Return strictly JSON: {{"score": number_0_to_100, "reason": "brief explanation"}}
    """
    res = call_gemini(prompt, 0.2)
    if res and isinstance(res, dict):
        return res.get('score', 0), res.get('reason', '')
    return 0, "Parse error"

def translate_article(en_data):
    prompt = f"""Translate this high-quality automotive article into German (de), Spanish (es), Turkish (tr), and French (fr).
    Maintain the professional, authoritative tone. Adapt idioms naturally. Do not do word-for-word robotic translation.
    
    English Title: {en_data['title']}
    English Summary: {en_data['summary']}
    English Content: {en_data['content']}
    
    Return strictly JSON matching this structure:
    {{
        "title": {{"en": "...", "de": "...", "es": "...", "tr": "...", "fr": "..."}},
        "summary": {{"en": "...", "de": "...", "es": "...", "tr": "...", "fr": "..."}},
        "content": {{"en": "...", "de": "...", "es": "...", "tr": "...", "fr": "..."}}
    }}
    (Use the original English texts for the 'en' fields).
    """
    return call_gemini(prompt, 0.3)

def fetch_and_process():
    print(f"Starting Quality-First Daily News Bot at {datetime.now(timezone.utc).isoformat()}...")
    existing_news = get_existing_news_titles()
    print(f"Loaded {len(existing_news)} existing articles for duplicate checking.")
    
    discovered = []
    for feed_url in RSS_FEEDS:
        print(f"Fetching {feed_url}...")
        try:
            req = urllib.request.Request(feed_url, headers={'User-Agent': 'Mozilla/5.0'})
            response = urllib.request.urlopen(req)
            xml_data = response.read()
            root = ET.fromstring(xml_data)
            for item in root.findall('.//item')[:20]: # Check up to 20 items per feed
                title = item.find('title').text if item.find('title') is not None else ''
                link = item.find('link').text if item.find('link') is not None else ''
                description = item.find('description').text if item.find('description') is not None else ''
                
                image_url = ''
                enclosure = item.find('enclosure')
                if enclosure is not None and enclosure.get('url'):
                    image_url = enclosure.get('url')
                else:
                    media_content = item.find('.//{http://search.yahoo.com/mrss/}content')
                    if media_content is not None and media_content.get('url'):
                        image_url = media_content.get('url')
                        
                slug = slugify(title)[:60].strip('-')
                discovered.append({'title': title, 'link': link, 'description': description, 'slug': slug, 'image_url': image_url})
        except Exception as e:
            print(f"Error reading RSS: {e}")
            
    print(f"Discovered {len(discovered)} items.")
    
    published_count = 0
    for item in discovered:
        print(f"\n--- Processing: {item['title']} ---")
        
        # 1. Topical Check
        is_relevant, reason = check_topical_relevance(item['title'], item['description'])
        if not is_relevant:
            print(f"REJECTED: Off-topic ({reason})")
            continue
            
        # 2. Duplicate Check
        if check_duplicate(item['title'], existing_news):
            print("REJECTED: Duplicate event/subject.")
            continue
            
        print("PASSED Topical & Duplicate filters. Generating Master EN...")
        
        # 3. Gen Master
        en_master = generate_english_master(item['title'], item['description'], item['link'])
        if not en_master:
            print("FAILED to generate Master EN.")
            continue
            
        # 4. Quality Gate
        score, q_reason = check_quality_gate(en_master)
        print(f"Quality Score: {score}/100. Reason: {q_reason}")
        if score < 80:
            print("REJECTED: Failed Quality Gate.")
            continue
            
        print("PASSED Quality Gate. Translating...")
        
        # 5. Translate
        final_translations = translate_article(en_master)
        if not final_translations:
            print("FAILED Translation.")
            continue
            
        # Compile final JSON
        final_data = {
            "id": item['slug'],
            "date": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "image": item['image_url'] if item['image_url'] else "default-news.jpg",
            "category": en_master.get('category', 'industry_news'),
            "slug": item['slug'],
            "title": final_translations['title'],
            "summary": final_translations['summary'],
            "content": final_translations['content']
        }
        
        file_path = os.path.join(NEWS_DIR, f"{item['slug']}.json")
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(final_data, f, ensure_ascii=False, indent=2)
            
        print(f"PUBLISHED! Saved as {item['slug']}.json")
        published_count += 1
        existing_news.append({"slug": item['slug'], "title": en_master['title']})
        
        time.sleep(5) # Rate limit protection

    print(f"\nWorkflow complete. Discovered: {len(discovered)}, Published: {published_count}")
    return len(discovered), published_count

def git_sync_and_push():
    print("\nStarting Git Conflict Protection Sync...")
    os.system("git config --global user.name 'AI Quality Bot'")
    os.system("git config --global user.email 'bot@example.com'")
    
    # Pre-sync
    os.system("git fetch")
    os.system("git pull --rebase origin main")
    
    # Check changes
    if os.system("git diff --quiet") == 0 and os.system("git diff --staged --quiet") == 0 and os.system("git ls-files --others --exclude-standard") == "":
        print("No new articles to commit.")
        return
        
    os.system("git add src/data/news/*.json")
    os.system("git commit -m 'feat(news): Auto-publish quality-checked news'")
    
    # Final pull before push to avoid conflict
    os.system("git pull --rebase origin main")
    res = os.system("git push origin main")
    if res == 0:
        print("Successfully pushed high-quality news to production.")
    else:
        print("Push failed. Check git logs.")

if __name__ == "__main__":
    fetch_and_process()
    if os.environ.get("GITHUB_ACTIONS"):
        git_sync_and_push()
