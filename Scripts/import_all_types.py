import requests
import time
import json
import os
from pathlib import Path

BASE = "https://pokeapi.co/api/v2"
SESSION = requests.Session()
SESSION.headers.update({"User-Agent": "pokemon-types-script/1.2"})

def fetch_all_types(save_to="frontend/public/data/types.json"):
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
            names = {n['language']['name']: n['name'] for n in type_info.get('names', [])}
            
            type_id = type_info['id']
            
            if type_id < 10000:
                base_url = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types"
                sprites = {
                    "gen3_emerald": f"{base_url}/generation-iii/emerald/{type_id}.png",
                    "gen4_platinum": f"{base_url}/generation-iv/platinum/{type_id}.png",
                    "gen5_black_white": f"{base_url}/generation-v/black-white/{type_id}.png",
                    "gen6_xy": f"{base_url}/generation-vi/x-y/{type_id}.png",
                    "gen7_sun_moon": f"{base_url}/generation-vii/sun-moon/{type_id}.png",
                    "gen8_sword_shield": f"{base_url}/generation-viii/sword-shield/{type_id}.png",
                    "gen9_scarlet_violet": f"{base_url}/generation-ix/scarlet-violet/{type_id}.png"
                }
            else:
                sprites = None

            type_dict = {
                "id": type_id,
                "name_en": item['name'],
                "names": names,
                "sprites": sprites
            }
            types_data.append(type_dict)
            print(f"Fetched type: {item['name']}")
            
        except Exception as e:
            print(f"Error fetching type {item['name']}: {e}")
            
        time.sleep(0.05)

    with open(save_to, "w", encoding="utf-8") as f:
        json.dump(types_data, f, indent=4, ensure_ascii=False)
    print(f"✅ All types saved in {save_to}")

if __name__ == "__main__":
    fetch_all_types()