import requests
import json
import os

def fetch_all_abilities():
    os.makedirs('data', exist_ok=True)
    print("Fetching the exact number of abilities...")
    
    initial_request = requests.get('https://pokeapi.co/api/v2/ability').json()
    total_count = initial_request['count']
    print(f"Found {total_count} abilities. Starting data collection...")
    
    response = requests.get(f'https://pokeapi.co/api/v2/ability?limit={total_count}').json()
    abilities_data = []

    for item in response['results']:
        ability_url = item['url']
        ability_info = requests.get(ability_url).json()
        
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

    with open('data/abilities.json', 'w', encoding='utf-8') as f:
        json.dump(abilities_data, f, ensure_ascii=False, indent=4)
    print("✅ All abilities saved in data/abilities.json")

if __name__ == "__main__":
    fetch_all_abilities()