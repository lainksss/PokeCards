import requests
import time
import json
import os
from pathlib import Path
from import_utils import build_retry_session, get_json, load_checkpoint, save_checkpoint, clear_checkpoint

BASE = "https://pokeapi.co/api/v2"
SESSION = build_retry_session("pokemon-types-script/2.0")
CHECKPOINT_PATH = "Scripts/checkpoints/types.checkpoint.json"

def fetch_all_types(save_to="frontend/public/data/types.json"):
    Path("data").mkdir(exist_ok=True)
    print("Fetching the exact number of types...")
    
    initial_request = get_json(SESSION, f'{BASE}/type')
    total_count = initial_request['count']
    print(f"Found {total_count} types. Starting data collection...")
    
    response = get_json(SESSION, f'{BASE}/type?limit={total_count}')
    start_index, types_data = load_checkpoint(CHECKPOINT_PATH, [])

    for index, item in enumerate(response['results']):
        if index < start_index:
            continue

        type_url = item['url']
        
        try:
            type_info = get_json(SESSION, type_url)
            
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
            save_checkpoint(CHECKPOINT_PATH, index + 1, types_data)
            
        except Exception as e:
            print(f"Error fetching type {item['name']}: {e}")
            
        time.sleep(0.05)

    with open(save_to, "w", encoding="utf-8") as f:
        json.dump(types_data, f, indent=4, ensure_ascii=False)
    clear_checkpoint(CHECKPOINT_PATH)
    print(f"✅ All types saved in {save_to}")

if __name__ == "__main__":
    try:
        fetch_all_types()
    except KeyboardInterrupt:
        print("\n[INFO] Interrupted by user. Progress kept in checkpoint.")