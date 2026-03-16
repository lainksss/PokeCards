import requests
import json
import os

def fetch_all_pokemon():
    os.makedirs('data', exist_ok=True)
    print("Fetching the exact number of Pokemon species...")
    
    initial_request = requests.get('https://pokeapi.co/api/v2/pokemon-species').json()
    total_count = initial_request['count']
    print(f"Found {total_count} Pokemon. Starting data collection...")
    
    response = requests.get(f'https://pokeapi.co/api/v2/pokemon-species?limit={total_count}').json()
    pokemon_data = []

    for item in response['results']:
        species_url = item['url']
        
        try:
            species_info = requests.get(species_url).json()
            names = {n['language']['name']: n['name'] for n in species_info['names']}
            
            # To get the sprite, we must query the 'pokemon' endpoint, not 'pokemon-species'
            pkmn_id = species_info['id']
            pkmn_info = requests.get(f'https://pokeapi.co/api/v2/pokemon/{pkmn_id}').json()
            
            # Grabbing the default front sprite
            sprite_url = pkmn_info['sprites']['front_default']

            pkmn_dict = {
                "id": pkmn_id,
                "names": names,
                "sprite": sprite_url
            }
            pokemon_data.append(pkmn_dict)
            print(f"Fetched Pokemon: {item['name']}")
            
        except Exception as e:
            print(f"Error fetching data for {item['name']}: {e}")

    with open('data/pokemon.json', 'w', encoding='utf-8') as f:
        json.dump(pokemon_data, f, ensure_ascii=False, indent=4)
    print("✅ All Pokemon saved in data/pokemon.json")

if __name__ == "__main__":
    fetch_all_pokemon()