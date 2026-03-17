import requests
import time
import json
from pathlib import Path

BASE = "https://pokeapi.co/api/v2"
SESSION = requests.Session()
SESSION.headers.update({"User-Agent": "pokemon-items-filtered-script/1.3"})

def fetch_filtered_items(save_to="frontend/public/data/items.json"):
    Path("data").mkdir(exist_ok=True)
    print("Fetching the exact number of items...")
    
    initial_request = SESSION.get(f'{BASE}/item').json()
    total_count = initial_request['count']
    print(f"Found {total_count} total items. Starting data collection and filtering...\n")
    
    response = SESSION.get(f'{BASE}/item?limit={total_count}').json()
    items_data = []
    skipped_count = 0

    # Categories that are 100% used for holding items in battle
    safe_categories = [
        'species-specific', 'mega-stones', 'z-crystals', 'plates', 'memories', 
        'held-items', 'choice', 'type-enhancement', 'scarf', 'jewels', 'training', 'healing'
    ]

    for item in response['results']:
        item_name = item['name']
        item_url = item['url']
        
        try:
            item_info = SESSION.get(item_url).json()
            
            # Extract attributes and category
            attributes = [a['name'] for a in item_info.get('attributes', [])]
            category = item_info.get('category', {}).get('name', '')
            
            is_holdable_attr = 'holdable' in attributes or 'holdable-active' in attributes
            is_safe_category = category in safe_categories
            
            # --- FILTERING LOGIC WITH PRINT ---
            if not is_holdable_attr and not is_safe_category:
                skipped_count += 1
                print(f"[-] Skipped: {item_name} (Category: {category})")
                time.sleep(0.05)
                continue
            
            print(f"[+] Kept: {item_name} (Category: {category})")
            # ----------------------------------
            
            names = {n['language']['name']: n['name'] for n in item_info.get('names', [])}
            
            descriptions = {}
            for entry in item_info.get('flavor_text_entries', []):
                lang = entry['language']['name']
                if lang not in descriptions:
                    descriptions[lang] = entry['text'].replace('\n', ' ').replace('\f', ' ')

            sprite = item_info['sprites']['default'] if item_info.get('sprites') else None

            item_dict = {
                "id": item_info['id'],
                "sprite": sprite,
                "names": names,
                "descriptions": descriptions,
                "category": category
            }
            items_data.append(item_dict)
            
        except Exception as e:
            print(f"[WARN] Error fetching item {item_name}: {e}")
            
        time.sleep(0.05)

    with open(save_to, "w", encoding="utf-8") as f:
        json.dump(items_data, f, indent=4, ensure_ascii=False)
        
    print(f"\n✅ Filtered items saved in {save_to}")
    print(f"📊 Final Stats: Kept {len(items_data)} usable items, Skipped {skipped_count} useless items.")

if __name__ == "__main__":
    fetch_filtered_items()