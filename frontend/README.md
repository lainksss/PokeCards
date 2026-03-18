# PokeCards Frontend

This folder contains the React + Vite web application for **PokeCards**. The app loads locally-generated JSON data and allows users to build and export Pokémon flashcards.

## 🚀 Run locally

```bash
cd frontend
npm install
npm run dev
```

Then open the URL shown in the terminal (default: `http://localhost:5173`).

## 🧱 Build for production

```bash
cd frontend
npm run build
npm run preview
```

## 🔥 Features

- Create cards for Pokémon, Moves, Items, Abilities, Natures, and Teams
- Configure card styling (backgrounds, borders, fonts, opacity, etc.)
- Export as PNG (and animated GIF when available)
- Multi-language UI (English / French, with more languages available)

## 📁 Data

The frontend reads JSON data from `public/data/`. The data is generated from the root-level `data/` folder via the scripts in the `Scripts/` directory.

## 🛠️ Notes

- The project is designed to work as a purely static site (no backend required).
- Translations are located under `src/locales/{en,fr}/`.
- Styles are in `src/components/` and `src/pages/`.
