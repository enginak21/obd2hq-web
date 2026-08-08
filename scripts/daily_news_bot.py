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

MAX_DAILY_MASTER = 3

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
    prompt = f"""Evaluate if this news article is strictly relevant to the topical authority of OBD2HQ (OBD2, vehicle diagnostics, automotive repair technology, ECU, engine tech, emissions, sensors, ADAS, EVs, hybrid diagnostics, major automotive technical developments, recalls).
    General automotive news (just mentioning a car), gossip, sports, crypto, finance, or generic phone/gaming tech MUST be rejected.
    
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
    prompt = f"""Compare the NEW article against the EXISTING articles to check if it covers the exact same event (Same-Event Clustering) or has deep semantic similarity (announcing the same product/recall/tech).
    NEW Title: {title}
    
    EXISTING Titles:
    {json.dumps(recent_titles, indent=2)}
    
    Return strictly JSON: {{"is_duplicate": boolean, "reason": "short explanation"}}
    """
    res = call_gemini(prompt, 0.1)
    if res and isinstance(res, dict):
        return res.get('is_duplicate', False)
    return False

def generate_english_master(title, description, source_url):
    prompt = f"""Write a highly factual, Information-Gain focused English master article based on this snippet.
    Title: {title}
    Source URL: {source_url}
    Snippet: {description}
    
    CRITICAL QUALITY RULES (SAFE MODE):
    1. Information Gain: Extract verifiable facts. Add relevant OBD2HQ context. Do not invent facts not in the source.
    2. Source Attribution: Clearly attribute the source (do not hide it) but do not use long direct quotes.
    3. Template Protection: DO NOT use repetitive structures (e.g. "In this article, we will explore...", "The practical question is...", "Conclusion:"). 
    4. Write naturally, as if analyzing the event freshly without boilerplate intros or forced FAQs.
    
    Return strictly JSON:
    {{
        "title": "Improved, engaging title",
        "summary": "1-2 sentence powerful summary",
        "content": "The full article text, paragraphs separated by \\n\\n",
        "category": "choose one: brand_news, modified_cars, chronic_issues, industry_news"
    }}
    """
    return call_gemini(prompt, 0.6)

def check_quality_gate(en_data):
    prompt = f"""Rate the quality of this automotive news article on a scale of 0 to 100.
    Criteria:
    - Fact Consistency & Information Gain: Does it provide real value and verifiable facts?
    - Template Phrase Repetition: Check if the text sounds like generic AI boilerplate or repeats cliche structures. If it does, score it very low.
    - Original Structure: Does it read like a genuine, uniquely structured news report?
    
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
    
    discovered = []
    for feed_url in RSS_FEEDS:
        try:
            req = urllib.request.Request(feed_url, headers={'User-Agent': 'Mozilla/5.0'})
            response = urllib.request.urlopen(req)
            xml_data = response.read()
            root = ET.fromstring(xml_data)
            for item in root.findall('.//item')[:15]: 
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
            pass
            
    published_count = 0
    for item in discovered:
        if published_count >= MAX_DAILY_MASTER:
            print(f"Max daily limit of {MAX_DAILY_MASTER} reached. Stopping.")
            break
            
        print(f"\n--- Processing: {item['title']} ---")
        
        is_relevant, reason = check_topical_relevance(item['title'], item['description'])
        if not is_relevant:
            print(f"REJECTED: Off-topic ({reason})")
            continue
            
        if check_duplicate(item['title'], existing_news):
            print("REJECTED: Same-Event / Semantic Duplicate.")
            continue
            
        en_master = generate_english_master(item['title'], item['description'], item['link'])
        if not en_master:
            continue
            
        score, q_reason = check_quality_gate(en_master)
        print(f"Quality Score: {score}/100. Reason: {q_reason}")
        if score < 80:
            print("REJECTED: Failed Quality Gate.")
            continue
            
        final_translations = translate_article(en_master)
        if not final_translations:
            continue
            
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
        
        time.sleep(5) 

    return len(discovered), published_count

def git_sync_and_push():
    print("\nStarting Git Agent Conflict Protection Sync...")
    os.system("git config --global user.name 'AI Quality Bot'")
    os.system("git config --global user.email 'bot@example.com'")
    
    res_fetch = os.system("git fetch")
    if res_fetch != 0:
        print("Git fetch failed. Aborting push to avoid conflicts.")
        sys.exit(1)
        
    res_pull = os.system("git pull --rebase origin main")
    if res_pull != 0:
        print("Git pull rebase failed. Conflict detected. Aborting to let another agent resolve.")
        os.system("git rebase --abort")
        sys.exit(1)
    
    if os.system("git diff --quiet") == 0 and os.system("git diff --staged --quiet") == 0 and os.system("git ls-files --others --exclude-standard") == "":
        print("No new articles to commit.")
        return
        
    os.system("git add src/data/news/*.json")
    os.system("git commit -m 'feat(news): Auto-publish safe mode quality-checked news'")
    
    # Final pull before push to avoid tiny race conditions
    res_final_pull = os.system("git pull --rebase origin main")
    if res_final_pull != 0:
         os.system("git rebase --abort")
         sys.exit(1)
         
    res_push = os.system("git push origin main")
    if res_push == 0:
        print("Successfully pushed high-quality news to production.")
    else:
        print("Push failed. Check git logs.")

if __name__ == "__main__":
    fetch_and_process()
    if os.environ.get("GITHUB_ACTIONS"):
        git_sync_and_push()
