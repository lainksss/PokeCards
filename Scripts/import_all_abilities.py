import requests
import json
import os
from import_utils import build_retry_session, get_json, load_checkpoint, save_checkpoint, clear_checkpoint


BASE_URL = 'https://pokeapi.co/api/v2'
CHECKPOINT_PATH = 'Scripts/checkpoints/abilities.checkpoint.json'
OUTPUT_PATH = 'frontend/public/data/abilities.json'

def fetch_all_abilities():
    os.makedirs('data', exist_ok=True)
    session = build_retry_session('pokemon-abilities-script/2.0')
    print("Fetching the exact number of abilities...")

    initial_request = get_json(session, f'{BASE_URL}/ability')
    total_count = initial_request['count']
    print(f"Found {total_count} abilities. Starting data collection...")

    response = get_json(session, f'{BASE_URL}/ability?limit={total_count}')
    start_index, abilities_data = load_checkpoint(CHECKPOINT_PATH, [])

    for index, item in enumerate(response['results']):
        if index < start_index:
            continue

        ability_url = item['url']
        ability_info = get_json(session, ability_url)
        
        names = {n['language']['name']: n['name'] for n in ability_info['names']}
        
        descriptions = {}
        for entry in ability_info['flavor_text_entries']:
            lang = entry['language']['name']
            if lang not in descriptions:
                descriptions[lang] = entry['flavor_text'].replace('\n', ' ').replace('\f', ' ')

        ability_dict = {
            "id": ability_info['id'],
            "names": names,
            "descriptions": descriptions
        }
        abilities_data.append(ability_dict)
        print(f"Fetched ability: {item['name']}")

        save_checkpoint(CHECKPOINT_PATH, index + 1, abilities_data)

    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(abilities_data, f, ensure_ascii=False, indent=4)
    clear_checkpoint(CHECKPOINT_PATH)
    print(f"✅ All abilities saved in {OUTPUT_PATH}")

if __name__ == "__main__":
    try:
        fetch_all_abilities()
    except KeyboardInterrupt:
        print("\n[INFO] Interrupted by user. Progress kept in checkpoint.")