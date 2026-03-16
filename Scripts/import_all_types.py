import requests
import time
import json
import os
from pathlib import Path

BASE = "https://pokeapi.co/api/v2"
SESSION = requests.Session()
SESSION.headers.update({"User-Agent": "pokemon-types-script/1.0"})

def fetch_all_types(save_to="data/types.json"):
    Path("data").mkdir(exist_ok=True)
    print("Fetching the exact number of types...")
    
    initial_request = SESSION.get(f'{BASE}/type').json()
    total_count = initial_request['count']
    print(f"Found {total_count} types. Starting data collection...")
    
    response = SESSION.get(f'{BASE}/type?limit={total_count}').json()
    types_data = []

    for item in response['results']:
        type_url = item['url']
        
        try:
            type_info = SESSION.get(type_url).json()
            
            # Extracting multilingual names
            # Some special types (like 'unknown' or 'stellar') might miss some languages, so we use a safe dict comprehension
            names = {n['language']['name']: n['name'] for n in type_info.get('names', [])}
            
            type_dict = {
                "id": type_info['id'],
                "name_en": item['name'], # Keeping the internal english name as reference
                "names": names
            }
            types_data.append(type_dict)
            print(f"Fetched type: {item['name']}")
            
        except Exception as e:
            print(f"Error fetching type {item['name']}: {e}")
            
        time.sleep(0.05) # Small sleep to respect the API

    with open(save_to, "w", encoding="utf-8") as f:
        json.dump(types_data, f, indent=4, ensure_ascii=False)
    print(f"✅ All types saved in {save_to}")

if __name__ == "__main__":
    fetch_all_types()