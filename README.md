# [PokeCards](https://lainksss.github.io/PokeCards/#/)

A small project that generates Pokémon flashcards, taking data from the PokéAPI.

This repository contains two main parts:

1. **Data generation scripts** (`Scripts/`) that download and normalize Pokémon data from PokéAPI into JSON files under `data/`.
2. **Web application** (`frontend/`) that uses the generated JSON to build customizable Pokémon flashcards, exportable as PNG (and GIF in some cases).

---

## 🧠 Data Generation (Python scripts)

### Prerequisites
- Python 3.8+ (or newer)
- `requests` library

Install dependencies:

```bash
pip install requests
```

### Generate / update the local database

```bash
python Scripts/import_all_files.py
```

This runs all the individual import scripts in a recommended order and writes JSON files into `data/`.

### Output files (in `data/`)

- `types.json` — Pokémon types + sprite URLs
- `natures.json` — Pokémon natures and stat effects
- `items.json` — Battle-relevant items (held items, stones, etc.)
- `abilities.json` — Pokémon abilities + flavor descriptions
- `moves.json` — Pokémon moves + stats / descriptions
- `pokemon.json` — Pokémon forms and sprites
- `pokemon_mapping.json` — Mapping of each Pokémon to its abilities and moves

---

## 🧩 Web Application (React + Vite)

The frontend is located in `frontend/` and reads data from `frontend/public/data/` (which is populated from the root `data/`).

### Run locally

```bash
cd frontend
npm install
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

### Build for production

```bash
cd frontend
npm run build
npm run preview
```

---

## 🚀 Features

- Create flashcards for Pokémon, Moves, Items, Abilities, Natures, and Teams
- Customize backgrounds (transparent / solid / gradient / image)
- Configure borders (rounded / square, color, opacity)
- Choose fonts (including Pokémon-themed fonts)
- Export cards as PNG (and animated GIFs in some cases)
- Multi-language support (English, French, and more)

---

## Notes

- The frontend is designed for static hosting (e.g., GitHub Pages).
- The JSON data is read directly from `frontend/public/data/` and does not require a backend.
- When changing data generation scripts, re-run `python Scripts/import_all_files.py` to update `data/`.
