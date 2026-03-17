# Agents instructions for PokeCards repository

This file is intended to help AI agents (like GitHub Copilot) understand the structure and intent of this repository, so they can provide better suggestions and make appropriate changes.

## 📌 Repository overview

- **Project name:** PokeCards
- **Purpose:** A complete interactive web application for creating personalized, exportable Pokémon flashcards (PNG/GIF format) based on Pokémon API data stored locally.
- **Tech Stack:** React + Vite (frontend), data stored as JSON files
- **Deployment:** GitHub Pages (static hosting)

## 🗂️ Key folders and files

### Root level
- `data/` - Generated JSON files from PokéAPI (pokemon.json, abilities.json, moves.json, items.json, natures.json, types.json, pokemon_mapping.json)
- `Assets/` - Static files (fonts, sprite definitions, images)
  - `fonts/` - Custom fonts (Pokemon Solid, Pokemon Hollow)
- `Scripts/` - Python scripts that fetch and generate data files (do NOT modify unless necessary)
- `frontend/` - **React + Vite web application** (the main deliverable)

### Frontend structure (`frontend/src/`)
```
frontend/src/
├── App.jsx                 # Main app with Router, Sidebar navigation
├── App.css                 # Layout styling for sidebar and main content
├── index.css               # Global reset and base styles
├── main.jsx                # React entry point
├── context/
│   └── LanguageContext.jsx # Global language state (FR/EN) and translation loading
├── pages/
│   ├── Home/
│   │   ├── Home.jsx        # Landing page with feature descriptions
│   │   └── Home.css        # Home page styling
│   ├── Nature/
│   ├── Attack/
│   ├── Item/
│   ├── Ability/
│   ├── Pokemon/            # Most complex page (uses pokemon_mapping.json)
│   └── Team/               # Grid-based team layout editor
├── components/
│   ├── BaseFlashcard/      # Reusable flashcard component (customizable background, borders, fonts)
│   │   ├── BaseFlashcard.jsx
│   │   └── BaseFlashcard.css
│   ├── CardCustomizer/     # Shared controls for background, borders, fonts, export
│   ├── LanguageSwitcher/   # Button to toggle FR/EN
│   └── ... (other UI components)
├── utils/
│   ├── exporter.js         # Export to PNG using html-to-image
│   ├── dataLoader.js       # Load and parse JSON from root /data folder
│   └── gifGenerator.js     # (Future) GIF export logic
└── locales/
    ├── fr/
    │   ├── index.js        # Aggregates all French translations
    │   ├── common.json     # Navigation, global labels
    │   ├── home.json       # Home page text
    │   ├── nature.json     # Nature page text
    │   ├── attack.json     # Attack page text
    │   ├── item.json       # Item page text
    │   ├── ability.json    # Ability page text
    │   ├── pokemon.json    # Pokemon page text
    │   └── team.json       # Team page text
    └── en/                 # English versions (same structure)
```

## 🎯 Application features & objectives

### Pages & Functionality

1. **Home Page (`/`)**
   - Landing page with description and feature list
   - Links to all card creation pages
   - Multi-language support (FR/EN)

2. **Nature Page (`/nature`)**
   - Flashcard tool for Pokémon Natures
   - Displays: Nature name, description, stat effects
   - Data source: `data/natures.json`

3. **Attack Page (`/attack`)**
   - Flashcard tool for Pokémon Moves/Attacks
   - Displays: Move name, power, accuracy, PP, description, type
   - Data source: `data/moves.json`

4. **Item Page (`/item`)**
   - Flashcard tool for Pokémon Items
   - Displays: Item name, sprite, description
   - Data source: `data/items.json`

5. **Ability Page (`/ability`)**
   - Flashcard tool for Pokémon Abilities
   - Displays: Ability name, description
   - Data source: `data/abilities.json`

6. **Pokémon Page (`/pokemon`)** ⭐ COMPLEX
   - Most feature-rich page
   - Displays: Pokémon name, sprite/artwork, selected moves, ability, held item
   - **Key constraint**: Moves and abilities shown must be limited to what the selected Pokémon can actually have
   - Data source: `data/pokemon.json` + `data/pokemon_mapping.json` (restricts available moves/abilities per Pokémon)

7. **Team Page (`/team`)**
   - Assemble up to 6 Pokémon in customizable grid layouts
   - User can choose layout (6x1, 1x6, 3x2, 2x3, etc.)
   - Each Pokémon displays its full card (name, image, moves, ability, item)
   - Export entire team as a single PNG or animated GIF

### Customization Options (available on all cards)

- **Background**
  - Transparent background
  - Solid color (user selectable)
  - Gradient (two colors, user selectable)
  - Custom image upload

- **Borders**
  - Rounded corners (CSS border-radius)
  - Square corners

- **Font Selection**
  - Pokemon Solid (from `Assets/fonts/Pokemon Solid.ttf`)
  - Pokemon Hollow (from `Assets/fonts/Pokemon Hollow.ttf`)
  - (Additional standard fonts available)

- **Export Options**
  - Export as PNG (static image)
  - Export as GIF (if card contains animated sprites from Pokémon data)
  - Download with custom filename

### Multi-Language Support

- **Current languages**: French (FR) and English (EN)
- **Implementation**: Centralized context (`LanguageContext`) with organized translation files per page
- **Extensible**: Easy to add new languages by duplicating folder structure in `locales/`

## 📊 Data Flow

```
/data/*.json (PokéAPI-generated data)
    ↓
frontend/src/utils/dataLoader.js (loads and parses JSON)
    ↓
React components (fetch data via hooks)
    ↓
User creates customized flashcard
    ↓
Export module (html-to-image → PNG, or gif.js → GIF)
    ↓
Downloaded file
```

## 🧠 Agent guidance (for Copilot/AI)

When working in this repository, focus on:

### DO:
- Maintain the modularity of components (one feature per file)
- Keep CSS organized per page/component
- Add translations whenever adding UI text (both FR and EN in separate JSON files)
- Use the data from root `/data/` folder directly (immutable)
- Test all pages with multi-language switching
- Ensure Pokémon page properly uses `pokemon_mapping.json` to restrict moves/abilities
- Keep file sizes small (split long pages into sub-components)

### DON'T:
- Modify scripts in `Scripts/` unless explicitly asked (data generation is separate)
- Hardcode strings (always use translation context)
- Mix component logic with styling (keep CSS separate)
- Change the structure of `data/` JSON files (respect existing format)
- Modify the Pokémon API data without justification

### Common tasks:

- **Adding a new page**: Create folder in `src/pages/PageName/`, add PageName.jsx + PageName.css, add translations to `locales/fr/pagename.json` and `locales/en/pagename.json`
- **Adding customization option**: Extend `CardCustomizer` component and update `BaseFlashcard` logic
- **Debugging translations**: Check `LanguageContext.jsx` and ensure `loadPageTranslations('page_name')` is called in component's `useEffect`
- **Export issues**: Check `src/utils/exporter.js` and ensure the card reference is properly passed
- **Data not showing**: Verify `dataLoader.js` is parsing the correct JSON file and check browser console for errors

## 🔍 Important constraints

- **GitHub Pages deployment**: Application must run as static files. No backend calls (data is local JSON).
- **GIF export complexity**: Capturing animated Pokémon sprites from HTML and re-encoding as GIF is complex; PNG export has priority.
- **Pokemon abilities/moves filtering**: Absolutely critical that users cannot select moves or abilities their Pokémon doesn't have (use `pokemon_mapping.json` as truth source).
- **Font embedding**: Custom fonts must be imported and embedded correctly for GitHub Pages to render them.

## 🚀 Next steps for development

1. ✅ Create BaseFlashcard component with customization controls
2. ✅ Implement simple pages (Nature, Item, Ability, Attack)
3. ✅ Implement complex Pokémon page with move/ability filtering
4. ✅ Implement Team page with custom grid layouts
5. ⏳ Refine styles and UI polishing
6. ⏳ Implement PNG export feature
7. ⏳ Implement GIF export feature (stretch goal)
8. ⏳ Pre-deployment testing on GitHub Pages

