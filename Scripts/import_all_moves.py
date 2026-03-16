import requests
import json
import os

def fetch_all_moves():
    os.makedirs('data', exist_ok=True)
    print("Fetching the exact number of moves...")
    
    # Get the total count dynamically to avoid hardcoded limits
    initial_request = requests.get('https://pokeapi.co/api/v2/move').json()
    total_count = initial_request['count']
    print(f"Found {total_count} moves. Starting data collection...")
    
    response = requests.get(f'https://pokeapi.co/api/v2/move?limit={total_count}').json()
    moves_data = []

    for item in response['results']:
        move_url = item['url']
        move_info = requests.get(move_url).json()
        
        # Extracting multilingual names
        names = {n['language']['name']: n['name'] for n in move_info['names']}
        
        # Extracting descriptions (keeping the first one found per language)
        descriptions = {}
        for entry in move_info['flavor_text_entries']:
            lang = entry['language']['name']
            if lang not in descriptions:
                descriptions[lang] = entry['flavor_text'].replace('\n', ' ').replace('\f', ' ')

        move_dict = {
            "id": move_info['id'],
            "power": move_info['power'],
            "accuracy": move_info['accuracy'],
            "pp": move_info['pp'],
            "type": move_info['type']['name'],
            "names": names,
            "descriptions": descriptions
        }
        moves_data.append(move_dict)
        print(f"Fetched move: {item['name']}")

    with open('data/moves.json', 'w', encoding='utf-8') as f:
        json.dump(moves_data, f, ensure_ascii=False, indent=4)
    print("✅ All moves saved in data/moves.json")

if __name__ == "__main__":
    fetch_all_moves()