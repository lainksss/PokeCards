import requests
import json
import os
import time
from import_utils import build_retry_session, get_json, load_checkpoint, save_checkpoint, clear_checkpoint


BASE_URL = 'https://pokeapi.co/api/v2'
CHECKPOINT_PATH = 'Scripts/checkpoints/moves.checkpoint.json'
OUTPUT_PATH = 'frontend/public/data/moves.json'

def fetch_all_moves():
    os.makedirs('data', exist_ok=True)
    session = build_retry_session('pokemon-moves-script/2.0')
    print("Fetching the exact number of moves...")

    # Get the total count dynamically to avoid hardcoded limits
    initial_request = get_json(session, f'{BASE_URL}/move')
    total_count = initial_request['count']
    print(f"Found {total_count} moves. Starting data collection...")

    response = get_json(session, f'{BASE_URL}/move?limit={total_count}')
    start_index, moves_data = load_checkpoint(CHECKPOINT_PATH, [])

    for index, item in enumerate(response['results']):
        if index < start_index:
            continue

        move_url = item['url']
        move_info = get_json(session, move_url)
        
        # Extracting multilingual names
        names = {n['language']['name']: n['name'] for n in move_info['names']}
        
        # Extracting descriptions (keeping the first one found per language)
        descriptions = {}
        for entry in move_info['flavor_text_entries']:
            lang = entry['language']['name']
            if lang not in descriptions:
                descriptions[lang] = entry['flavor_text'].replace('\n', ' ').replace('\f', ' ')

        damage_class = move_info.get('damage_class')
        damage_class_name = damage_class['name'] if damage_class else 'unknown'

        move_dict = {
            "id": move_info['id'],
            "power": move_info['power'],
            "accuracy": move_info['accuracy'],
            "pp": move_info['pp'],
            "type": move_info['type']['name'],
            "damage_class": damage_class_name,
            "names": names,
            "descriptions": descriptions
        }
        moves_data.append(move_dict)
        print(f"Fetched move: {item['name']}")

        save_checkpoint(CHECKPOINT_PATH, index + 1, moves_data)
        
        time.sleep(0.05)

    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(moves_data, f, ensure_ascii=False, indent=4)
    clear_checkpoint(CHECKPOINT_PATH)
    print(f"✅ All moves saved in {OUTPUT_PATH}")

if __name__ == "__main__":
    try:
        fetch_all_moves()
    except KeyboardInterrupt:
        print("\n[INFO] Interrupted by user. Progress kept in checkpoint.")