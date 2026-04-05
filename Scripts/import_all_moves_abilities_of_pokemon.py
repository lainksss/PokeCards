# Fetch all Pokémon abilities and moves, saving them into a single compact JSON file.

# Example of the saved file `data/pokemon_mapping.json`:
# {
#   "1": {
#     "abilities": ["overgrow", "chlorophyll"],
#     "moves": ["razor-wind", "swords-dance", "cut", "vine-whip", ...]
#   },
#   "4": {
#     "abilities": ["blaze", "solar-power"],
#     "moves": ["mega-punch", "fire-punch", "scratch", "swords-dance", ...]
#   }
# }

import requests
import time
import json
from pathlib import Path
from import_utils import build_retry_session, get_json, load_checkpoint, save_checkpoint, clear_checkpoint

BASE = "https://pokeapi.co/api/v2"
POKEMON_ENDPOINT = f"{BASE}/pokemon?limit=100&offset=0"
SESSION = build_retry_session("pokemon-mapping-script/2.0")
CHECKPOINT_PATH = "Scripts/checkpoints/pokemon_mapping.checkpoint.json"


def fetch_all_pokemon_urls():
    """Retrieve the URLs for all Pokémon from the paginated API endpoint."""
    url = POKEMON_ENDPOINT
    urls = []
    while url:
        data = get_json(SESSION, url)
        urls.extend([p["url"] for p in data["results"]])
        url = data.get("next")
        time.sleep(0.1)
    return urls


def fetch_pokemon_data(pokemon_url):
    """Fetch both abilities and moves for a single Pokémon by its API URL."""
    data = get_json(SESSION, pokemon_url)
    
    abilities = [a["ability"]["name"] for a in data["abilities"]]
    moves = [m["move"]["name"] for m in data["moves"]]
    
    return {
        "abilities": abilities,
        "moves": moves
    }


def build_pokemon_mapping(save_to="frontend/public/data/pokemon_mapping.json"):
    """Build and save the combined moves/abilities mapping to disk."""
    Path("data").mkdir(exist_ok=True)
    urls = fetch_all_pokemon_urls()
    print(f"Found {len(urls)} Pokémon forms. Fetching abilities and moves...")

    all_mapping = {}
    start_index, all_mapping = load_checkpoint(CHECKPOINT_PATH, {})
    for i, url in enumerate(urls, start=1):
        index = i - 1
        if index < start_index:
            continue

        # Extract the ID or Name from the URL (e.g., "1" or "bulbasaur")
        pokemon_identifier = url.split("/")[-2] 
        
        try:
            pokemon_data = fetch_pokemon_data(url)
        except Exception as e:
            print(f"[WARN] failed for {url}: {e}. Retrying once...")
            time.sleep(1)
            pokemon_data = fetch_pokemon_data(url)
            
        all_mapping[pokemon_identifier] = pokemon_data
        save_checkpoint(CHECKPOINT_PATH, index + 1, all_mapping)
        
        if i % 50 == 0:
            print(f"  -> Processed {i}/{len(urls)} Pokémon")
            
        time.sleep(0.07)

    with open(save_to, "w", encoding="utf-8") as f:
        json.dump(all_mapping, f, indent=2, ensure_ascii=False)
    clear_checkpoint(CHECKPOINT_PATH)
    print(f"✅ Saved all Pokémon mappings to {save_to}")


if __name__ == "__main__":
    try:
        build_pokemon_mapping()
    except KeyboardInterrupt:
        print("\n[INFO] Interrupted by user. Progress kept in checkpoint.")