import requests
import json
import os
from import_utils import build_retry_session, get_json, load_checkpoint, save_checkpoint, clear_checkpoint


BASE_URL = 'https://pokeapi.co/api/v2'
CHECKPOINT_PATH = 'Scripts/checkpoints/natures.checkpoint.json'
OUTPUT_PATH = 'frontend/public/data/natures.json'

def fetch_all_natures():
    os.makedirs('data', exist_ok=True)
    session = build_retry_session('pokemon-natures-script/2.0')
    print("Fetching the exact number of natures...")

    initial_request = get_json(session, f'{BASE_URL}/nature')
    total_count = initial_request['count']
    print(f"Found {total_count} natures. Starting data collection...")

    response = get_json(session, f'{BASE_URL}/nature?limit={total_count}')
    start_index, natures_data = load_checkpoint(CHECKPOINT_PATH, [])

    for index, item in enumerate(response['results']):
        if index < start_index:
            continue

        nature_url = item['url']
        nature_info = get_json(session, nature_url)
        
        names = {n['language']['name']: n['name'] for n in nature_info['names']}
        
        # Handle modified stats (can be None if the nature is neutral)
        inc_stat = nature_info['increased_stat']['name'] if nature_info['increased_stat'] else None
        dec_stat = nature_info['decreased_stat']['name'] if nature_info['decreased_stat'] else None

        nature_dict = {
            "id": nature_info['id'],
            "names": names,
            "increased_stat": inc_stat,
            "decreased_stat": dec_stat
        }
        natures_data.append(nature_dict)
        print(f"Fetched nature: {item['name']}")

        save_checkpoint(CHECKPOINT_PATH, index + 1, natures_data)

    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(natures_data, f, ensure_ascii=False, indent=4)
    clear_checkpoint(CHECKPOINT_PATH)
    print(f"✅ All natures saved in {OUTPUT_PATH}")

if __name__ == "__main__":
    try:
        fetch_all_natures()
    except KeyboardInterrupt:
        print("\n[INFO] Interrupted by user. Progress kept in checkpoint.")