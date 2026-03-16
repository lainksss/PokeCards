# PokeCards

A small project that generates Pokémon flashcard, taking data from the PokéAPI.

This repository contains scripts to fetch Pokémon content (types, natures, items, abilities, moves, and Pokémon forms) and save them as JSON files under the `data/` folder. The generated data is intended for use in flashcard-style apps or other Pokémon tooling.

# 🃏 PokéCards - The Creative Pokémon Flashcard Builder
**PokéCards** is a web-based application designed for content creators, competitive players, team builders, and Pokémon enthusiasts. Its main goal is to generate comprehensive and highly visual "Flashcards" for any Pokémon/Move/Nature/Item/Pokemon Team/Ability.

---

## ⚙️ Prerequisites & Setup

To generate or update the local database, you will need Python installed on your machine.
Install the required library for HTTP requests:

```bash
pip install requests
---

## 🚀 Getting Started

To generate the data, run the main import script:

```bash
python Scripts/import_all_files.py
```

This will execute all data import scripts in a recommended order and output JSON files into `data/`.

---

## 📁 Output Data

The generated JSON files are stored in the `data/` directory and include:

- `types.json` — Pokémon types + sprite URLs
- `natures.json` — Pokémon natures and stat effects
- `items.json` — Battle-relevant items (held items, stones, etc.)
- `abilities.json` — Pokémon abilities + flavor descriptions
- `moves.json` — Pokémon moves + stats/description
- `pokemon.json` — Pokémon forms and sprites
- `pokemon_mapping.json` — Mapping of each Pokémon to its abilities and moves

---

## 🧠 Scripts

All scripts are located in `Scripts/`. Each one is self-contained and can be run individually if you only need to update part of the dataset. For example:

```bash
python Scripts/import_all_moves.py
```

---

## Notes

- The scripts create `data/` automatically if it does not exist.
- API requests include small delays to avoid rate limiting.
- Some scripts use custom `User-Agent` headers to prevent being blocked by the API.
