# Agents instructions for PokeCards repository

This file is intended to help AI agents (like GitHub Copilot) understand the structure and intent of this repository, so they can provide better suggestions and make appropriate changes.

## 📌 Repository overview

- **Project name:** PokeCards
- **Purpose:** Generate and use Pokémon data (types, moves, abilities, items, etc.) by fetching it from the PokéAPI and storing it in local JSON files.
- **Main data folder:** `data/`
- **Scripts:** Stored in `Scripts/` and are responsible for fetching and generating the data files.

## 🗂️ Key folders and files

- `data/` - Generated JSON data used by the application.
- `Scripts/` - Python scripts that call the PokéAPI and write JSON files into `data/`.
  - `import_all_files.py` - main entry point that runs all generation scripts in a recommended order.
- `README.md` - Project-level documentation (may be in French).
- `Scripts/README.md` - Documentation for the data generation scripts (now in English).

## 🔍 What the scripts do

Each script in `Scripts/` is focused on one type of data:

- `import_all_types.py` - Types (`types.json`)
- `import_all_natures.py` - Natures (`natures.json`)
- `import_all_items.py` - Items (`items.json`)
- `import_all_abilities.py` - Abilities (`abilities.json`)
- `import_all_moves.py` - Moves (`moves.json`)
- `import_all_basic_pokemon_info.py` - Pokémon base data (`pokemon.json`)
- `import_all_moves_abilities_of_pokemon.py` - Pokémon mapping (abilities + moves per Pokémon) (`pokemon_mapping.json`)

The scripts are designed to:
- Fetch the data from the PokéAPI (`https://pokeapi.co/api/v2`).
- Respect rate limiting (includes delays and custom User-Agent headers).
- Write consistent JSON output for use by the application.

## 🧠 Agent guidance (for Copilot/AI)

When working in this repository, focus on:
- Keeping the generated JSON structure consistent across scripts.
- Avoiding changes that would break the expected data formats read by whatever consumes `data/*.json`.
- Preserving language metadata (multilingual names and descriptions) already present in the data.

If you need clarification about how a script is used, start by inspecting the scripts in `Scripts/` and the JSON files in `data/`.
