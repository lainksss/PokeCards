# Data Generation Scripts

This folder contains Python scripts that fetch data from the PokéAPI (`https://pokeapi.co/api/v2`) and generate JSON files into the `data/` folder. Each script has a specific role and produces one (or more) JSON files ready to be used by the application.

---

## 🧩 General structure

- **Scripts source folder:** `Scripts/`
- **Data output folder:** `data/`
- **Main entry point:** `Scripts/import_all_files.py` (runs all scripts in the recommended order)

---

## 📌 Scripts and their roles

### 1) `import_all_types.py`
- **Role:** Fetches all Pokémon types from the API.
- **Output:** `data/types.json`
- **Details:**
  - Retrieves multilingual type names.
  - Generates links to official sprites (PokeAPI sprites GitHub) for multiple generations.

### 2) `import_all_natures.py`
- **Role:** Fetches all Pokémon natures.
- **Output:** `data/natures.json`
- **Details:**
  - Contains multilingual names and the stats increased/decreased by each nature.

### 3) `import_all_items.py`
- **Role:** Fetches useful Pokémon items (held items, stones, etc.) by filtering out those not used in battle.
- **Output:** `data/items.json`
- **Details:**
  - Filters items based on categories and attributes (e.g., `holdable`, `mega-stones`, `z-crystals`, etc.).
  - Provides multilingual names and descriptions.

### 4) `import_all_abilities.py`
- **Role:** Fetches all Pokémon abilities.
- **Output:** `data/abilities.json`
- **Details:**
  - Contains multilingual names and flavor text descriptions per language.

### 5) `import_all_moves.py`
- **Role:** Fetches all Pokémon moves.
- **Output:** `data/moves.json`
- **Details:**
  - Contains multilingual names, descriptions, power, accuracy, PP, type, and damage category.

### 6) `import_all_basic_pokemon_info.py`
- **Role:** Fetches base Pokémon data (includes all forms: Mega, Alola, etc.).
- **Output:** `data/pokemon.json`
- **Details:**
  - Contains multilingual names, internal name (e.g., `venusaur-mega`), and sprites (official, shiny, by generation).

### 7) `import_all_moves_abilities_of_pokemon.py`
- **Role:** Fetches, for each Pokémon (all forms), its list of abilities and moves.
- **Output:** `data/pokemon_mapping.json`
- **Details:**
  - Produces a compact map `id -> {abilities, moves}` to quickly know which abilities/moves a Pokémon can learn.

---

## ▶️ Execution (recommended order)

1. Open a terminal at the root of the project.
2. Run the top-level script:

```bash
python Scripts/import_all_files.py
```

> This script runs all scripts in the logical order to generate the set of JSON files in `data/`.

---

## 🔁 Individual usage

Each script is standalone. For example, to update only moves:

```bash
python Scripts/import_all_moves.py
```

---

## ✅ Notes

- The scripts automatically create the `data/` folder if it does not exist.
- API calls are intentionally slowed down (delays) to avoid rate limiting.
- Some scripts use custom `User-Agent` headers to avoid being blocked by the API.
