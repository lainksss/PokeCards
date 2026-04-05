import requests
import json
import os
import time
from import_utils import build_retry_session, get_json, load_checkpoint, save_checkpoint, clear_checkpoint

BASE_URL = "https://pokeapi.co/api/v2"
SESSION = build_retry_session("pokemon-basic-info-script/2.0")
CHECKPOINT_PATH = "Scripts/checkpoints/pokemon_basic_info.checkpoint.json"

def fetch_all_pokemon():
    os.makedirs('frontend/public/data', exist_ok=True)
    print("Fetching the exact number of Pokemon forms...")
    
    # We query 'pokemon' instead of 'pokemon-species' to get ALL forms (Megas, Alolan, etc.)
    initial_request = get_json(SESSION, f'{BASE_URL}/pokemon')
    total_count = initial_request['count']
    print(f"Found {total_count} Pokemon (including forms). Starting data collection...")
    
    response = get_json(SESSION, f'{BASE_URL}/pokemon?limit={total_count}')
    start_index, checkpoint_data = load_checkpoint(
        CHECKPOINT_PATH,
        {"pokemon_data": [], "species_cache": {}},
    )
    pokemon_data = checkpoint_data.get("pokemon_data", [])

    # Simple cache to avoid requesting the same species multiple times
    species_cache = checkpoint_data.get("species_cache", {})

    for i, item in enumerate(response['results'], start=1):
        index = i - 1
        if index < start_index:
            continue

        pkmn_url = item['url']
        
        try:
            # 1. Fetch the specific Pokemon form data
            pkmn_info = get_json(SESSION, pkmn_url)
            pkmn_id = pkmn_info['id']
            
            # 1.5 Extract types (list of type names)
            types = [t['type']['name'] for t in pkmn_info.get('types', [])]
            
            # 2. Fetch the Species data to get localized names
            species_url = pkmn_info['species']['url']
            
            # Use cache to speed up the process for alternate forms of the same species
            if species_url not in species_cache:
                species_info = get_json(SESSION, species_url)
                species_names = {n['language']['name']: n['name'] for n in species_info.get('names', [])}
                species_cache[species_url] = species_names
                time.sleep(0.05) # Delay only when hitting the API for new species
            
            names = species_cache[species_url]
            
            # 3. Extract raw sprite data
            raw_sprites = pkmn_info.get('sprites', {})
            other_sprites = raw_sprites.get('other', {})
            versions = raw_sprites.get('versions', {})
            
            # Helper function to safely extract front sprites from generations
            def get_version_sprite(gen, game, shiny=False):
                key = 'front_shiny' if shiny else 'front_default'
                return versions.get(gen, {}).get(game, {}).get(key)

            # Build the multigen and shiny sprite dictionary (Front only)
            sprites = {
                "official_artwork": {
                    "normal": other_sprites.get('official-artwork', {}).get('front_default'),
                    "shiny": other_sprites.get('official-artwork', {}).get('front_shiny')
                },
                "home": {
                    "normal": other_sprites.get('home', {}).get('front_default'),
                    "shiny": other_sprites.get('home', {}).get('front_shiny')
                },
                "showdown": {
                    "normal": other_sprites.get('showdown', {}).get('front_default'),
                    "shiny": other_sprites.get('showdown', {}).get('front_shiny')
                },
                "gen3_emerald": {
                    "normal": get_version_sprite('generation-iii', 'emerald'),
                    "shiny": get_version_sprite('generation-iii', 'emerald', shiny=True)
                },
                "gen4_platinum": {
                    "normal": get_version_sprite('generation-iv', 'platinum'),
                    "shiny": get_version_sprite('generation-iv', 'platinum', shiny=True)
                },
                "gen5_black_white": {
                    "normal": get_version_sprite('generation-v', 'black-white'),
                    "shiny": get_version_sprite('generation-v', 'black-white', shiny=True)
                },
                "gen6_xy": {
                    "normal": get_version_sprite('generation-vi', 'x-y'),
                    "shiny": get_version_sprite('generation-vi', 'x-y', shiny=True)
                },
                "gen7_sun_moon": {
                    "normal": get_version_sprite('generation-vii', 'icons'),
                    "shiny": get_version_sprite('generation-vii', 'icons', shiny=True)
                },
                "default_modern": {
                    "normal": raw_sprites.get('front_default'),
                    "shiny": raw_sprites.get('front_shiny')
                }
            }

            pkmn_dict = {
                "id": pkmn_id,
                "name_en": item['name'], # Internal name like 'venusaur-mega'
                "names": names, # Translated base name like 'Florizarre'
                "types": types, # List of type names like ['grass', 'poison']
                "sprites": sprites
            }
            pokemon_data.append(pkmn_dict)
            print(f"Fetched Pokemon: {item['name']} ({i}/{total_count})")
            save_checkpoint(
                CHECKPOINT_PATH,
                index + 1,
                {"pokemon_data": pokemon_data, "species_cache": species_cache},
            )
            
        except Exception as e:
            print(f"[WARN] Error fetching data for {item['name']}: {e}")

        # Small delay to prevent rate-limiting from the API for the main pokemon endpoint
        time.sleep(0.05)

    with open('frontend/public/data/pokemon.json', 'w', encoding='utf-8') as f:
        json.dump(pokemon_data, f, ensure_ascii=False, indent=4)
    clear_checkpoint(CHECKPOINT_PATH)
    print("✅ All Pokemon saved in frontend/public/data/pokemon.json")

if __name__ == "__main__":
    try:
        fetch_all_pokemon()
    except KeyboardInterrupt:
        print("\n[INFO] Interrupted by user. Progress kept in checkpoint.")