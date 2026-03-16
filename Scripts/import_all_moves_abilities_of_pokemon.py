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

BASE = "https://pokeapi.co/api/v2"
POKEMON_ENDPOINT = f"{BASE}/pokemon?limit=100&offset=0"
SESSION = requests.Session()
SESSION.headers.update({"User-Agent": "pokemon-mapping-script/1.0"})


def fetch_all_pokemon_urls():
    """Retrieve the URLs for all Pokémon from the paginated API endpoint."""
    url = POKEMON_ENDPOINT
    urls = []
    while url:
        r = SESSION.get(url, timeout=15)
        r.raise_for_status()
        data = r.json()
        urls.extend([p["url"] for p in data["results"]])
        url = data.get("next")
        time.sleep(0.1)
    return urls


def fetch_pokemon_data(pokemon_url):
    """Fetch both abilities and moves for a single Pokémon by its API URL."""
    r = SESSION.get(pokemon_url, timeout=15)
    r.raise_for_status()
    data = r.json()
    
    abilities = [a["ability"]["name"] for a in data["abilities"]]
    moves = [m["move"]["name"] for m in data["moves"]]
    
    return {
        "abilities": abilities,
        "moves": moves
    }


def build_pokemon_mapping(save_to="data/pokemon_mapping.json"):
    """Build and save the combined moves/abilities mapping to disk."""
    Path("data").mkdir(exist_ok=True)
    urls = fetch_all_pokemon_urls()
    print(f"Found {len(urls)} Pokémon forms. Fetching abilities and moves...")

    all_mapping = {}
    for i, url in enumerate(urls, start=1):
        # Extract the ID or Name from the URL (e.g., "1" or "bulbasaur")
        pokemon_identifier = url.split("/")[-2] 
        
        try:
            pokemon_data = fetch_pokemon_data(url)
        except Exception as e:
            print(f"[WARN] failed for {url}: {e}. Retrying once...")
            time.sleep(1)
            pokemon_data = fetch_pokemon_data(url)
            
        all_mapping[pokemon_identifier] = pokemon_data
        
        if i % 50 == 0:
            print(f"  -> Processed {i}/{len(urls)} Pokémon")
            
        time.sleep(0.07)

    with open(save_to, "w", encoding="utf-8") as f:
        json.dump(all_mapping, f, indent=2, ensure_ascii=False)
    print(f"✅ Saved all Pokémon mappings to {save_to}")


if __name__ == "__main__":
    build_pokemon_mapping()