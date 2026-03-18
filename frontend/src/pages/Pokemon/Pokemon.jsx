import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import BaseFlashcard from '../../components/BaseFlashcard/BaseFlashcard';
import CardCustomizer from '../../components/CardCustomizer/CardCustomizer';
import SearchableSelector from '../../components/SearchableSelector/SearchableSelector';
import { getTypeColor } from '../../utils/typeColors';
import './Pokemon.css';

const Pokemon = () => {
  const { t, loadPageTranslations, language } = useLanguage();
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [allMoves, setAllMoves] = useState([]);
  const [allAbilities, setAllAbilities] = useState([]);
  const [allNatures, setAllNatures] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [types, setTypes] = useState([]);
  const [pokemonMapping, setPokemonMapping] = useState({});

  const slugify = (text) => {
    if (!text) return '';
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/['’`]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
  };

  const getAbilitySlug = (ability) => {
    const name = ability?.names?.en;
    return slugify(name);
  };

  const getMoveSlug = (move) => {
    const name = move?.names?.en;
    return slugify(name);
  };
  
  // Customization states
  const [background, setBackground] = useState('transparent');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [gradColor2, setGradColor2] = useState('#3b4cca');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [borderRadius, setBorderRadius] = useState(true);
  const [selectedFont, setSelectedFont] = useState('default');
  const [fontColor, setFontColor] = useState('#000000');
  const [borderColor, setBorderColor] = useState('#1a237e');
  const [cardLanguage, setCardLanguage] = useState('fr');
  const [selectedGeneration, setSelectedGeneration] = useState('gen9_scarlet_violet');
  const [showDbNames, setShowDbNames] = useState(false);
  
  // Pokemon-specific states
  const [selectedAbility, setSelectedAbility] = useState(null);
  const [selectedNature, setSelectedNature] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedMoves, setSelectedMoves] = useState([null, null, null, null]);
  const [selectedSpriteType, setSelectedSpriteType] = useState('official_artwork');
  const [selectedSpriteVariant, setSelectedSpriteVariant] = useState('normal');
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPageTranslations('pokemon');
    fetchAllData();
  }, []);

  useEffect(() => {
    setCardLanguage(language);
  }, [language]);

  const fetchAllData = async () => {
    try {
      const [pokemonRes, movesRes, abilitiesRes, naturesRes, itemsRes, typesRes, mappingRes] = 
        await Promise.all([
          fetch('/PokeCards/data/pokemon.json'),
          fetch('/PokeCards/data/moves.json'),
          fetch('/PokeCards/data/abilities.json'),
          fetch('/PokeCards/data/natures.json'),
          fetch('/PokeCards/data/items.json'),
          fetch('/PokeCards/data/types.json'),
          fetch('/PokeCards/data/pokemon_mapping.json')
        ]);

      const pokemonData = await pokemonRes.json();
      const movesData = await movesRes.json();
      const abilitiesData = await abilitiesRes.json();
      const naturesData = await naturesRes.json();
      const itemsData = await itemsRes.json();
      const typesData = await typesRes.json();
      const mappingData = await mappingRes.json();

      setPokemons(pokemonData);
      setAllMoves(movesData);
      setAllAbilities(abilitiesData);
      setAllNatures(naturesData);
      setAllItems(itemsData);
      setTypes(typesData);
      setPokemonMapping(mappingData);

      if (pokemonData.length > 0) {
        setSelectedPokemon(pokemonData[0]);
        initializePokemonDefaults(pokemonData[0], mappingData, abilitiesData, naturesData, itemsData, movesData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);
    }
  };

  const initializePokemonDefaults = (pokemon, mapping, abilities, natures, items, moves) => {
    const pokemonId = String(pokemon.id);
    const pokemonData = mapping[pokemonId];

    if (pokemonData) {
      // Set first available ability
      if (pokemonData.abilities && pokemonData.abilities.length > 0) {
        const abilitySlug = pokemonData.abilities[0];
        const abilityData = abilities.find((a) => getAbilitySlug(a) === abilitySlug);
        setSelectedAbility(abilityData);
      }

      if (pokemonData.moves && pokemonData.moves.length > 0) {
        // Get first 4 moves
        const firstFourMoves = pokemonData.moves.slice(0, 4);
        const moveObjects = firstFourMoves.map((moveSlug) =>
          moves.find((m) => getMoveSlug(m) === moveSlug)
        );
        setSelectedMoves(moveObjects);
      }
    }

    // Set first nature and item
    if (natures.length > 0) {
      setSelectedNature(natures[0]);
    }
    if (items.length > 0) {
      setSelectedItem(items[0]);
    }
  };

  const handlePokemonChange = (pokemon) => {
    setSelectedPokemon(pokemon);
    setSelectedMoves([null, null, null, null]);
    initializePokemonDefaults(pokemon, pokemonMapping, allAbilities, allNatures, allItems, allMoves);
  };

  const getAvailableAbilities = () => {
    if (!selectedPokemon) return [];
    const pokemonId = String(selectedPokemon.id);
    const pokemonData = pokemonMapping[pokemonId];

    if (!pokemonData || !pokemonData.abilities) return [];

    const abilitySlugs = new Set(pokemonData.abilities);
    return allAbilities.filter((ability) => abilitySlugs.has(getAbilitySlug(ability)));
  };

  const getAvailableMoves = () => {
    if (!selectedPokemon) return [];
    const pokemonId = String(selectedPokemon.id);
    const pokemonData = pokemonMapping[pokemonId];

    if (!pokemonData || !pokemonData.moves) return [];

    const moveSlugs = new Set(pokemonData.moves);
    return allMoves.filter((move) => moveSlugs.has(getMoveSlug(move)));
  };

  const handleMoveChange = (index, move) => {
    const newMoves = [...selectedMoves];
    newMoves[index] = move;
    setSelectedMoves(newMoves);
  };

  const getTypeNameInLanguage = (typeName) => {
    const typeData = types.find(t => t.name_en === typeName);
    return typeData?.names?.[cardLanguage] || typeData?.names?.en || typeName;
  };

  const getAbilityNameInLanguage = (abilityName) => {
    if (!selectedAbility) return abilityName;
    return selectedAbility.names?.[cardLanguage] || selectedAbility.names?.en || abilityName;
  };

  const getNatureNameInLanguage = (natureName) => {
    if (!selectedNature) return natureName;
    return selectedNature.names?.[cardLanguage] || selectedNature.names?.en || natureName;
  };

  const getItemNameInLanguage = (itemName) => {
    if (!selectedItem) return itemName;
    return selectedItem.names?.[cardLanguage] || selectedItem.names?.en || itemName;
  };

  const getMoveNameInLanguage = (move) => {
    if (!move) return '';
    return move.names?.[cardLanguage] || move.names?.en || '';
  };

  const getFlashcardData = () => {
    if (!selectedPokemon) return {};
    
    return {
      'name': selectedPokemon.names?.[cardLanguage] || selectedPokemon.names?.en || 'Pokemon',
      'ability': selectedAbility ? (selectedAbility.names?.[cardLanguage] || selectedAbility.names?.en) : 'N/A',
      'nature': selectedNature ? (selectedNature.names?.[cardLanguage] || selectedNature.names?.en) : 'N/A',
      'item': selectedItem ? (selectedItem.names?.[cardLanguage] || selectedItem.names?.en) : 'N/A',
      'moves': selectedMoves
        .filter(move => move && move.type)
        .map(move => {
          const typeName = move.type || '';
          return {
            name: getMoveNameInLanguage(move),
            type: getTypeNameInLanguage(typeName),
            typeColor: getTypeColor(typeName),
            power: move.power != null ? move.power : '—',
            accuracy: move.accuracy != null ? `${move.accuracy}%` : '—'
          };
        })
    };
  };

  const availableLanguages = [
    { code: 'fr', label: 'lang_french' },
    { code: 'en', label: 'lang_english' },
    { code: 'de', label: 'lang_german' },
    { code: 'es', label: 'lang_spanish' },
    { code: 'it', label: 'lang_italian' },
    { code: 'ja', label: 'lang_japanese' },
    { code: 'ko', label: 'lang_korean' },
    { code: 'zh-hans', label: 'lang_chinese_simp' },
    { code: 'zh-hant', label: 'lang_chinese_trad' },
    { code: 'ja-hrkt', label: 'lang_japanese' }
  ];

  if (loading) {
    return <div className="pokemon-container"><p>{t('loading')}</p></div>;
  }

  const availableSpriteTypes = selectedPokemon?.sprites ? Object.keys(selectedPokemon.sprites) : [];

  return (
    <div className="pokemon-container">
      <div className="top-bar">
        <h1 className="page-title">{t('pokemon_name')}</h1>
        <div className="language-group">
          <label>{t('card_language') || 'Langue de la carte'}</label>
          <select 
            value={cardLanguage}
            onChange={(e) => setCardLanguage(e.target.value)}
            className="language-select"
          >
            {availableLanguages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {t(lang.label) || lang.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pokemon-layout">
        <div className="flashcard-panel">
          <div className="pokemon-flashcard">
            <BaseFlashcard
              data={getFlashcardData()}
              background={background}
              backgroundColor={bgColor}
              gradientColor2={gradColor2}
              backgroundImage={backgroundImage}
              borderRadius={borderRadius}
              selectedFont={selectedFont}
              fontColor={fontColor}
              borderColor={borderColor}
              cardLanguage={cardLanguage}
              isPokemon={true}
              selectedPokemon={selectedPokemon}
              selectedMoves={selectedMoves}
              getTypeColor={getTypeColor}
              getTypeNameInLanguage={getTypeNameInLanguage}
              getMoveNameInLanguage={getMoveNameInLanguage}
              selectedSpriteType={selectedSpriteType}
              selectedSpriteVariant={selectedSpriteVariant}
            />
          </div>
        </div>

        <div className="controls-panel">
          <div className="controls-left">
            <div className="selector-group">
              <div className="selector-header">
                <label>{t('pokemon_search') || 'Rechercher un Pokémon'}</label>
                <button
                  type="button"
                  className={`toggle-db-name ${showDbNames ? 'active' : ''}`}
                  onClick={() => setShowDbNames((prev) => !prev)}
                >
                  {t('show_db_names') || 'DB names'}
                </button>
              </div>
              <SearchableSelector
                items={pokemons}
                onSelect={handlePokemonChange}
                selectedId={selectedPokemon?.id}
                getDisplayName={(pokemon) => {
                  const name = showDbNames
                    ? pokemon.name_en
                    : (pokemon.names?.[cardLanguage] || pokemon.names?.en || pokemon.name_en);

                  const pokemonTypes = pokemon.types || [];
                  if (pokemonTypes.length === 0) return name;

                  const typeNames = pokemonTypes.map((typeName) => {
                    const typeData = types.find((t) => t.name_en === typeName);
                    return typeData?.names?.[cardLanguage] || typeData?.names?.en || typeName;
                  });

                  return `${name} [${typeNames.join(', ')}]`;
                }}
                getSearchStrings={(pokemon) => {
                  const searchStrings = [...Object.values(pokemon.names || {}).filter(Boolean)];
                  if (pokemon.name_en) {
                    searchStrings.push(pokemon.name_en);
                  }
                  return searchStrings;
                }}
                placeholder={t('search_placeholder') || 'Rechercher...'}
              />
            </div>

            <div className="selector-group">
              <label>{t('pokemon_talent') || 'Talent'}</label>
              <SearchableSelector
                items={getAvailableAbilities()}
                onSelect={setSelectedAbility}
                selectedId={selectedAbility?.id}
                getDisplayName={(ability) => ability.names?.[cardLanguage] || ability.names?.en || ''}
                getSearchStrings={(ability) => Object.values(ability.names || {}).filter(Boolean)}
                placeholder={t('search_placeholder') || 'Sélectionner un talent...'}
              />
            </div>

            <div className="selector-group">
              <label>{t('pokemon_nature') || 'Nature'}</label>
              <SearchableSelector
                items={allNatures}
                onSelect={setSelectedNature}
                selectedId={selectedNature?.id}
                getDisplayName={(nature) => nature.names?.[cardLanguage] || nature.names?.en || ''}
                getSearchStrings={(nature) => Object.values(nature.names || {}).filter(Boolean)}
                placeholder={t('search_placeholder') || 'Sélectionner une nature...'}
              />
            </div>

            <div className="selector-group">
              <label>{t('pokemon_item') || 'Objet'}</label>
              <SearchableSelector
                items={allItems}
                onSelect={setSelectedItem}
                selectedId={selectedItem?.id}
                getDisplayName={(item) => item.names?.[cardLanguage] || item.names?.en || ''}
                getSearchStrings={(item) => Object.values(item.names || {}).filter(Boolean)}
                placeholder={t('search_placeholder') || 'Sélectionner un objet...'}
              />
            </div>

            <div className="moves-group">
              <label>{t('pokemon_attacks') || 'Attaques'}</label>
              {selectedMoves.map((move, index) => (
                <div key={index} className="move-selector">
                  <SearchableSelector
                    items={getAvailableMoves()}
                    onSelect={(m) => handleMoveChange(index, m)}
                    selectedId={move?.id}
                    getDisplayName={(m) => m.names?.[cardLanguage] || m.names?.en || ''}
                    getSearchStrings={(m) => Object.values(m.names || {}).filter(Boolean)}
                    placeholder={`Attaque ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="controls-right">
            <CardCustomizer
              onBackgroundChange={setBackground}
              onBorderRadiusChange={setBorderRadius}
              onFontChange={setSelectedFont}
              backgroundColor={bgColor}
              onBackgroundColorChange={setBgColor}
              gradientColor2={gradColor2}
              onGradientColor2Change={setGradColor2}
              onBackgroundImageChange={setBackgroundImage}
              fontColor={fontColor}
              onFontColorChange={setFontColor}
              borderColor={borderColor}
              onBorderColorChange={setBorderColor}
              selectedGeneration={selectedGeneration}
              onGenerationChange={setSelectedGeneration}
              showSpriteSelector={true}
              spriteType={selectedSpriteType}
              onSpriteTypeChange={setSelectedSpriteType}
              spriteVariant={selectedSpriteVariant}
              onSpriteVariantChange={setSelectedSpriteVariant}
              availableSpriteTypes={availableSpriteTypes}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pokemon;
