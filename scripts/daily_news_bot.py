import os
import json
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
import re
import time
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
NEWS_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "data", "news")

# Ensure the news directory exists
os.makedirs(NEWS_DIR, exist_ok=True)

# Free RSS Feeds for Automotive News
RSS_FEEDS = [
    "https://www.autoblog.com/category/news/rss.xml",
    "https://www.motor1.com/rss/news/all/"
]

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

def fetch_rss_feed(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        xml_data = response.read()
        root = ET.fromstring(xml_data)
        items = []
        for item in root.findall('.//item'):  # Process all items
            title = item.find('title').text if item.find('title') is not None else ''
            link = item.find('link').text if item.find('link') is not None else ''
            description = item.find('description').text if item.find('description') is not None else ''
            
            # Extract image
            image_url = ''
            enclosure = item.find('enclosure')
            if enclosure is not None and enclosure.get('url'):
                image_url = enclosure.get('url')
            else:
                media_content = item.find('.//{http://search.yahoo.com/mrss/}content')
                if media_content is not None and media_content.get('url'):
                    image_url = media_content.get('url')
            
            # Simple check if article already exists by slug
            slug = slugify(title)[:50]
            if not os.path.exists(os.path.join(NEWS_DIR, f"{slug}.json")):
                items.append({'title': title, 'link': link, 'description': description, 'slug': slug, 'image_url': image_url})
        return items
    except Exception as e:
        print(f"Error fetching RSS {url}: {e}")
        return []

def rewrite_article_with_ai(article_data):
    if not GEMINI_API_KEY:
        print("No GEMINI_API_KEY provided, skipping AI generation.")
        return None

    prompt = f"""You are a professional automotive journalist and expert SEO content writer. Write a highly detailed, long-form news article based on the following short description.
    The article MUST be very detailed, deeply engaging, and feel like reading a premium automotive magazine (like TopGear or MotorTrend). 
    Expand on the topic logically. Add technical context, market implications, or historical context where relevant. 
    Write at least 5-6 paragraphs for the main content to make it a long, satisfying read.
    Do not mention that you are an AI. Write as a passionate car enthusiast.
    
    Original Title: {article_data['title']}
    Original Content snippet: {article_data['description']}
    Provided Image URL: {article_data.get('image_url', '')}
    
    You must output a strictly valid JSON object matching this structure exactly:
    {{
        "id": "a-unique-id",
        "date": "YYYY-MM-DDTHH:MM:SSZ",
        "image": "USE_THE_PROVIDED_IMAGE_URL_OR_DEFAULT_IF_EMPTY",
        "category": "choose_one_from: brand_news, modified_cars, chronic_issues, industry_news",
        "slug": "{article_data['slug']}",
        "title": {{
            "en": "...", "de": "...", "es": "...", "tr": "...", "fr": "..."
        }},
        "summary": {{
            "en": "...", "de": "...", "es": "...", "tr": "...", "fr": "..."
        }},
        "content": {{
            "en": "...", "de": "...", "es": "...", "tr": "...", "fr": "..."
        }}
    }}
    
    Make the translations natural and culturally appropriate for each language. The "content" fields should contain the long-form detailed paragraphs separated by double newlines (\n\n). Provide ONLY the JSON, without markdown formatting blocks.
    For the image, if Provided Image URL is not empty, you MUST use it. Otherwise, use a generic high-quality car unsplash image.
    """

    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.7}
    }
    
    req = urllib.request.Request(api_url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = urllib.request.urlopen(req)
            result = json.loads(response.read().decode('utf-8'))
            text_response = result['candidates'][0]['content']['parts'][0]['text']
            
            # Clean up potential markdown formatting around JSON
            text_response = text_response.strip()
            if text_response.startswith('```json'):
                text_response = text_response[7:]
            if text_response.startswith('```'):
                text_response = text_response[3:]
            if text_response.endswith('```'):
                text_response = text_response[:-3]
                
            return json.loads(text_response.strip())
        except urllib.error.HTTPError as e:
            if e.code == 429:
                print(f"Rate limit hit (429). Sleeping for 15 seconds before retry {attempt + 1}/{max_retries}...")
                time.sleep(15)
            else:
                print(f"Error calling Gemini API: {e}")
                return None
        except Exception as e:
            print(f"Error calling Gemini API: {e}")
            return None
            
    print("Failed to generate content after max retries.")
    return None

def main():
    print(f"Starting Daily News Bot at {datetime.now(timezone.utc).isoformat()}...")
    new_articles_count = 0
    
    for feed_url in RSS_FEEDS:
        print(f"Fetching {feed_url}...")
        items = fetch_rss_feed(feed_url)
        
        for item in items:
            print(f"Processing new article: {item['title']}")
            
            ai_data = rewrite_article_with_ai(item)
            if ai_data:
                ai_data['date'] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
                ai_data['id'] = item['slug']
                ai_data['slug'] = item['slug']
                
                file_path = os.path.join(NEWS_DIR, f"{item['slug']}.json")
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(ai_data, f, ensure_ascii=False, indent=2)
                
                print(f"Successfully saved {file_path}")
                new_articles_count += 1
            else:
                print("Failed to generate AI content.")
            
            # Always sleep to respect Gemini API rate limits (even on Plus)
            time.sleep(4)
                
    print(f"Bot finished. Generated {new_articles_count} new articles.")

if __name__ == "__main__":
    main()
