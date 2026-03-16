import requests
import json
import os

def fetch_all_natures():
    os.makedirs('data', exist_ok=True)
    print("Fetching the exact number of natures...")
    
    initial_request = requests.get('https://pokeapi.co/api/v2/nature').json()
    total_count = initial_request['count']
    print(f"Found {total_count} natures. Starting data collection...")
    
    response = requests.get(f'https://pokeapi.co/api/v2/nature?limit={total_count}').json()
    natures_data = []

    for item in response['results']:
        nature_url = item['url']
        nature_info = requests.get(nature_url).json()
        
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

    with open('data/natures.json', 'w', encoding='utf-8') as f:
        json.dump(natures_data, f, ensure_ascii=False, indent=4)
    print("✅ All natures saved in data/natures.json")

if __name__ == "__main__":
    fetch_all_natures()