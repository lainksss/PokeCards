import requests
import json
import os

def fetch_all_items():
    os.makedirs('data', exist_ok=True)
    print("Fetching the exact number of items...")
    
    initial_request = requests.get('https://pokeapi.co/api/v2/item').json()
    total_count = initial_request['count']
    print(f"Found {total_count} items. Starting data collection...")
    
    response = requests.get(f'https://pokeapi.co/api/v2/item?limit={total_count}').json()
    items_data = []

    for item in response['results']:
        item_url = item['url']
        item_info = requests.get(item_url).json()
        
        names = {n['language']['name']: n['name'] for n in item_info['names']}
        
        descriptions = {}
        for entry in item_info['flavor_text_entries']:
            lang = entry['language']['name']
            if lang not in descriptions:
                descriptions[lang] = entry['text'].replace('\n', ' ').replace('\f', ' ')

        # Some items might not have a default sprite
        sprite = item_info['sprites']['default'] if item_info['sprites'] else None

        item_dict = {
            "id": item_info['id'],
            "sprite": sprite,
            "names": names,
            "descriptions": descriptions
        }
        items_data.append(item_dict)
        print(f"Fetched item: {item['name']}")

    with open('data/items.json', 'w', encoding='utf-8') as f:
        json.dump(items_data, f, ensure_ascii=False, indent=4)
    print("✅ All items saved in data/items.json")

if __name__ == "__main__":
    fetch_all_items()