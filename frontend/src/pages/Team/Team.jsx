import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import BaseFlashcard from '../../components/BaseFlashcard/BaseFlashcard';
import CardCustomizer from '../../components/CardCustomizer/CardCustomizer';
import SearchableSelector from '../../components/SearchableSelector/SearchableSelector';
import { getTypeColor } from '../../utils/typeColors';
import html2canvas from 'html2canvas';
import './Team.css';

const Team = () => {
  const { t, loadPageTranslations, language } = useLanguage();
  const [teamPokemon, setTeamPokemon] = useState([null, null, null, null, null, null]);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [layout, setLayout] = useState('3x2');
  const [pokemons, setPokemons] = useState([]);
  const [allMoves, setAllMoves] = useState([]);
  const [allAbilities, setAllAbilities] = useState([]);
  const [allNatures, setAllNatures] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [types, setTypes] = useState([]);
  const [pokemonMapping, setPokemonMapping] = useState({});
  
  const [teamData, setTeamData] = useState(Array(6).fill(null).map(() => ({
    ability: null,
    nature: null,
    item: null,
    moves: [null, null, null, null]
  })));

  const [background, setBackground] = useState('transparent');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [gradColor2, setGradColor2] = useState('#3b4cca');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [borderRadius, setBorderRadius] = useState(true);
  const [selectedFont, setSelectedFont] = useState('default');
  const [customFontFile, setCustomFontFile] = useState(null);
  const [customFontName, setCustomFontName] = useState('');
  const [fontColor, setFontColor] = useState('#000000');
  const [borderColor, setBorderColor] = useState('#1a237e');
  const [borderOpacity, setBorderOpacity] = useState(1);
  const [backgroundOpacity, setBackgroundOpacity] = useState(1);
  const [cardLanguage, setCardLanguage] = useState('fr');
  const [selectedSpriteType, setSelectedSpriteType] = useState('official_artwork');
  const [selectedSpriteVariant, setSelectedSpriteVariant] = useState('normal');
  const [selectedTypeGeneration, setSelectedTypeGeneration] = useState('gen9_scarlet_violet');
  const [showNature, setShowNature] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  
  const [outerBackground, setOuterBackground] = useState('transparent');
  const [outerBgColor, setOuterBgColor] = useState('#ffffff');
  const [outerGradColor2, setOuterGradColor2] = useState('#3b4cca');
  const [outerBackgroundImage, setOuterBackgroundImage] = useState(null);
  const [outerBackgroundOpacity, setOuterBackgroundOpacity] = useState(1);
  const [outerBorderRadius, setOuterBorderRadius] = useState(true);
  const [outerBorderColor, setOuterBorderColor] = useState('#1a237e');
  const [outerBorderOpacity, setOuterBorderOpacity] = useState(1);
  const [outerBorderSize, setOuterBorderSize] = useState(4);

  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [loading, setLoading] = useState(true);
  const [rightPanelMode, setRightPanelMode] = useState('controls');

  const slugify = (text) => {
    if (!text) return '';
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[''`]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
  };

  const getAbilitySlug = (ability) => slugify(ability?.names?.en);
  const getMoveSlug = (move) => slugify(move?.names?.en);

  useEffect(() => {
    loadPageTranslations('team');
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

      setPokemons(await pokemonRes.json());
      setAllMoves(await movesRes.json());
      setAllAbilities(await abilitiesRes.json());
      setAllNatures(await naturesRes.json());
      setAllItems(await itemsRes.json());
      setTypes(await typesRes.json());
      setPokemonMapping(await mappingRes.json());
      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);
    }
  };

  const addPokemonToTeam = (pokemon) => {
    const newTeamPokemon = [...teamPokemon];
    newTeamPokemon[selectedSlot] = pokemon;
    setTeamPokemon(newTeamPokemon);

    const pokemonId = String(pokemon.id);
    const pokemonData = pokemonMapping[pokemonId];
    const newTeamData = [...teamData];
    newTeamData[selectedSlot] = { ability: null, nature: null, item: null, moves: [null, null, null, null] };

    if (pokemonData?.abilities?.length > 0) {
      const abilitySlug = pokemonData.abilities[0];
      const abilityData = allAbilities.find((a) => getAbilitySlug(a) === abilitySlug);
      newTeamData[selectedSlot].ability = abilityData;
    }

    setTeamData(newTeamData);
  };

  const removePokemonFromTeam = (slotIndex) => {
    const newTeamPokemon = [...teamPokemon];
    newTeamPokemon[slotIndex] = null;
    setTeamPokemon(newTeamPokemon);

    const newTeamData = [...teamData];
    newTeamData[slotIndex] = { ability: null, nature: null, item: null, moves: [null, null, null, null] };
    setTeamData(newTeamData);
  };

  const movePokemon = (fromSlot, toSlot) => {
    const newTeamPokemon = [...teamPokemon];
    const newTeamData = [...teamData];
    [newTeamPokemon[fromSlot], newTeamPokemon[toSlot]] = [newTeamPokemon[toSlot], newTeamPokemon[fromSlot]];
    [newTeamData[fromSlot], newTeamData[toSlot]] = [newTeamData[toSlot], newTeamData[fromSlot]];
    setTeamPokemon(newTeamPokemon);
    setTeamData(newTeamData);
  };

  const getAvailableAbilities = (pokemonData) => {
    if (!pokemonData || !pokemonMapping[String(pokemonData.id)]) return [];
    const pokemonMapData = pokemonMapping[String(pokemonData.id)];
    if (!pokemonMapData.abilities) return [];
    const abilitySlugs = new Set(pokemonMapData.abilities);
    return allAbilities.filter((ability) => abilitySlugs.has(getAbilitySlug(ability)));
  };

  const getAvailableMoves = (pokemonData) => {
    if (!pokemonData || !pokemonMapping[String(pokemonData.id)]) return [];
    const pokemonMapData = pokemonMapping[String(pokemonData.id)];
    if (!pokemonMapData.moves) return [];
    const moveSlugs = new Set(pokemonMapData.moves);
    return allMoves.filter((move) => moveSlugs.has(getMoveSlug(move)));
  };

  const updateTeamData = (slotIndex, field, value) => {
    const newTeamData = [...teamData];
    newTeamData[slotIndex] = { ...newTeamData[slotIndex], [field]: value };
    setTeamData(newTeamData);
  };

  const updateMoveInTeam = (slotIndex, moveIndex, move) => {
    const newTeamData = [...teamData];
    const newMoves = [...newTeamData[slotIndex].moves];
    newMoves[moveIndex] = move;
    newTeamData[slotIndex] = { ...newTeamData[slotIndex], moves: newMoves };
    setTeamData(newTeamData);
  };

  const getTypeNameInLanguage = (typeName) => {
    const typeData = types.find(t => t.name_en === typeName);
    return typeData?.names?.[cardLanguage] || typeData?.names?.en || typeName;
  };

  const getMoveNameInLanguage = (move) => {
    if (!move) return '';
    return move.names?.[cardLanguage] || move.names?.en || '';
  };

  const getFlashcardData = (pokemonData, slotData) => {
    if (!pokemonData) return {};
    
    const pokemonTypes = pokemonData.types?.map(typeName => {
      const typeData = types.find(t => t.name_en?.toLowerCase() === typeName?.toLowerCase());
      return {
        name: typeData?.names?.[cardLanguage] || typeData?.names?.en || typeName,
        nameEn: typeName,
        sprite: typeData?.sprites?.[selectedTypeGeneration],
        color: getTypeColor(typeName)
      };
    }) || [];

    const itemSprite = slotData?.item?.sprite || null;
    const isNeutralNature = slotData?.nature && !slotData.nature.increased_stat && !slotData.nature.decreased_stat;
    const natureText = slotData?.nature && !isNeutralNature
      ? (slotData.nature.names?.[cardLanguage] || slotData.nature.names?.en)
      : null;

    return {
      'name': pokemonData.names?.[cardLanguage] || pokemonData.names?.en || 'Pokemon',
      'pokemonTypes': pokemonTypes,
      'itemSprite': itemSprite,
      'ability': slotData?.ability ? (slotData.ability.names?.[cardLanguage] || slotData.ability.names?.en) : 'N/A',
      'nature': showNature ? natureText : null,
      'item': slotData?.item ? (slotData.item.names?.[cardLanguage] || slotData.item.names?.en) : 'N/A',
      'moves': (slotData?.moves || [])
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

  const parseTeamText = (text) => {
    setImportError('');
    const lines = text.trim().split('\n').filter(line => line.trim());
    const teamEntries = [];
    let currentEntry = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('EVs:') || trimmedLine.startsWith('Tera Type:') ||
          trimmedLine.startsWith('IVs:') || trimmedLine.startsWith('Shiny:') ||
          trimmedLine.startsWith('Level:') || trimmedLine.startsWith('Happiness:')) continue;
      
      if (trimmedLine.startsWith('-')) {
        if (currentEntry) currentEntry.moves.push(trimmedLine.replace('-', '').trim());
      } else if (trimmedLine.startsWith('Ability:')) {
        if (currentEntry) currentEntry.abilityName = trimmedLine.replace('Ability:', '').trim();
      } else if (trimmedLine.includes('Nature')) {
        if (currentEntry) currentEntry.natureName = trimmedLine.split('Nature')[0].trim() || null;
      } else {
        if (currentEntry) teamEntries.push(currentEntry);
        const [pokemonName, itemName] = trimmedLine.split('@').map(s => s.trim());
        currentEntry = { pokemonName: pokemonName || '', itemName: itemName || null, abilityName: null, natureName: null, moves: [] };
      }
    }

    if (currentEntry) teamEntries.push(currentEntry);

    const newTeamPokemon = [...teamPokemon];
    const newTeamData = [...teamData];

    for (let i = 0; i < teamEntries.length && i < 6; i++) {
      const entry = teamEntries[i];
      let pokemonSearchName = entry.pokemonName.replace(/\s*\([MF]\)\s*$/i, '').trim();

      const pokemon = pokemons.find(p => {
        const searchLower = pokemonSearchName.toLowerCase();
        return (p.names?.en || '').toLowerCase() === searchLower || 
               (p.names?.fr || '').toLowerCase() === searchLower ||
               (p.name_en || '').toLowerCase() === searchLower;
      });

      if (!pokemon) {
        setImportError(`${t('import_error_pokemon') || 'Pokémon'} "${entry.pokemonName}" ${t('import_error_not_found') || 'not found'}`);
        return;
      }

      newTeamPokemon[i] = pokemon;

      const ability = entry.abilityName
        ? allAbilities.find(a => (a.names?.en || '').toLowerCase() === entry.abilityName.toLowerCase())
        : null;

      const item = entry.itemName
        ? allItems.find(it => (it.names?.en || '').toLowerCase() === entry.itemName.toLowerCase())
        : null;

      const nature = entry.natureName
        ? allNatures.find(n => (n.names?.en || '').toLowerCase() === entry.natureName.toLowerCase())
        : null;

      const moves = [null, null, null, null];
      for (let j = 0; j < entry.moves.length && j < 4; j++) {
        const move = allMoves.find(m => (m.names?.en || '').toLowerCase() === entry.moves[j].toLowerCase());
        if (move) moves[j] = move;
      }

      newTeamData[i] = { ability: ability || null, nature: nature || null, item: item || null, moves };
    }

    setTeamPokemon(newTeamPokemon);
    setTeamData(newTeamData);
    setImportText('');
  };

  const exportTeamImage = async () => {
    setIsExporting(true);

    // Determine grid columns based on layout
    const colsMap = {
      '2x1': 2, '1x2': 1, '1x3': 1, '3x1': 3,
      '2x2': 2, '1x4': 1, '4x1': 4, '1x5': 1,
      '5x1': 5, '6x1': 6, '1x6': 1, '2x3': 2, '3x2': 3
    };
    const cols = colsMap[layout] || 3;

    // Card dimensions (full size, matching BaseFlashcard.css .flashcard-pokemon)
    const CARD_W = 300;
    const CARD_GAP = 16;
    const PADDING = 20;
    const BORDER = outerBorderSize || 4;

    // Build a temporary off-screen container
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: -99999px;
      left: -99999px;
      display: grid;
      grid-template-columns: repeat(${cols}, ${CARD_W}px);
      gap: ${CARD_GAP}px;
      padding: ${PADDING}px;
      background: ${getOuterBackgroundStyle().background || 'white'};
      border: ${BORDER}px solid ${outerBorderColor};
      border-radius: ${outerBorderRadius ? '12px' : '0px'};
      width: fit-content;
      z-index: -1;
    `;
    document.body.appendChild(container);

    // Clone visible cards into the container at full size
    const visibleCards = document.querySelectorAll('.team-grid .team-slot-card');
    visibleCards.forEach(card => {
      const clone = card.cloneNode(true);
      // Reset any scale transforms from the preview
      clone.style.transform = 'none';
      clone.style.transformOrigin = 'unset';
      // Make sure the flashcard inside is full size
      const flashcard = clone.querySelector('.flashcard-pokemon');
      if (flashcard) {
        flashcard.style.width = CARD_W + 'px';
      }
      container.appendChild(clone);
    });

    // Wait for images to load
    const imgs = container.querySelectorAll('img');
    await Promise.all(Array.from(imgs).map(img =>
      img.complete ? Promise.resolve() : new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      })
    ));

    // Small delay for rendering
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const canvas = await html2canvas(container, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: null,
      });

      const link = document.createElement('a');
      link.download = `team_${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      document.body.removeChild(container);
      setIsExporting(false);
    }
  };

  const getAvailableLayouts = () => {
    const count = getActivePokemonCount();
    const layoutsByCount = {
      2: ['2x1', '1x2'], 3: ['1x3', '3x1'], 4: ['2x2', '1x4', '4x1'],
      5: ['1x5', '5x1'], 6: ['1x6', '6x1', '3x2', '2x3']
    };
    return layoutsByCount[count] || [];
  };

  const getLayoutGridClass = () => {
    const layoutMap = {
      '2x1': 'layout-2x1', '1x2': 'layout-1x2', '1x3': 'layout-1x3',
      '3x1': 'layout-3x1', '2x2': 'layout-2x2', '1x4': 'layout-1x4',
      '4x1': 'layout-4x1', '1x5': 'layout-1x5', '5x1': 'layout-5x1',
      '6x1': 'layout-6x1', '1x6': 'layout-1x6', '2x3': 'layout-2x3', '3x2': 'layout-3x2'
    };
    return layoutMap[layout] || '';
  };

  const getOuterBackgroundStyle = () => {
    const opacity = outerBackgroundOpacity;
    if (outerBackground === 'transparent') return { background: 'transparent' };
    if (outerBackground === 'solid') {
      const color = outerBgColor;
      if (color.startsWith('#')) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return { background: `rgba(${r}, ${g}, ${b}, ${opacity})` };
      }
      return { background: color };
    }
    if (outerBackground === 'gradient') {
      const c1 = outerBgColor, c2 = outerGradColor2;
      let r1=255,g1=255,b1=255,r2=59,g2=76,b2=202;
      if (c1.startsWith('#')) { r1=parseInt(c1.slice(1,3),16); g1=parseInt(c1.slice(3,5),16); b1=parseInt(c1.slice(5,7),16); }
      if (c2.startsWith('#')) { r2=parseInt(c2.slice(1,3),16); g2=parseInt(c2.slice(3,5),16); b2=parseInt(c2.slice(5,7),16); }
      return { background: `linear-gradient(135deg, rgba(${r1},${g1},${b1},${opacity}), rgba(${r2},${g2},${b2},${opacity}))` };
    }
    if (outerBackground === 'image' && outerBackgroundImage) {
      return { backgroundImage: `url(${outerBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity };
    }
    return { background: 'transparent' };
  };

  const getOuterBorderStyle = () => {
    const color = outerBorderColor;
    let borderColorWithOpacity = color;
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      borderColorWithOpacity = `rgba(${r}, ${g}, ${b}, ${outerBorderOpacity})`;
    }
    return { border: `${outerBorderSize}px solid ${borderColorWithOpacity}`, borderRadius: outerBorderRadius ? '12px' : '0px' };
  };

  const getActivePokemonCount = () => teamPokemon.filter(p => p !== null).length;

  useEffect(() => {
    const availableLayouts = getAvailableLayouts();
    if (availableLayouts.length > 0 && !availableLayouts.includes(layout)) {
      setLayout(availableLayouts[0]);
    }
  }, [getActivePokemonCount()]);

  const availableLanguages = [
    { code: 'fr', label: 'lang_french' }, { code: 'en', label: 'lang_english' },
    { code: 'de', label: 'lang_german' }, { code: 'es', label: 'lang_spanish' },
    { code: 'it', label: 'lang_italian' }, { code: 'ja', label: 'lang_japanese' },
    { code: 'ko', label: 'lang_korean' }, { code: 'zh-hans', label: 'lang_chinese_simp' },
    { code: 'zh-hant', label: 'lang_chinese_trad' }, { code: 'ja-hrkt', label: 'lang_japanese' }
  ];

  if (loading) return <div className="team-container"><p>{t('loading')}</p></div>;

  return (
    <div className="team-container">
      <div className="top-bar">
        <h1 className="page-title">{t('team_title') || 'Team'}</h1>
        <div className="language-group">
          <label>{t('card_language') || 'Langue de la carte'}</label>
          <select value={cardLanguage} onChange={(e) => setCardLanguage(e.target.value)} className="language-select">
            {availableLanguages.map(lang => (
              <option key={lang.code} value={lang.code}>{t(lang.label) || lang.code}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="team-layout">
        <div className="team-preview-box">
          <div className={`team-grid-container ${getLayoutGridClass()}`}>
            <div className="team-grid" style={{ ...getOuterBackgroundStyle(), ...getOuterBorderStyle() }}>
              {teamPokemon.map((pokemon, index) => {
                if (!pokemon) return null;
                return (
                  <div key={index} className="team-slot-card">
                    <BaseFlashcard
                      data={getFlashcardData(pokemon, teamData[index])}
                      background={background}
                      backgroundColor={bgColor}
                      backgroundOpacity={backgroundOpacity}
                      gradientColor2={gradColor2}
                      backgroundImage={backgroundImage}
                      borderRadius={borderRadius}
                      selectedFont={selectedFont}
                      customFontFile={customFontFile}
                      customFontName={customFontName}
                      fontColor={fontColor}
                      borderColor={borderColor}
                      borderOpacity={borderOpacity}
                      cardLanguage={cardLanguage}
                      isPokemon={true}
                      selectedPokemon={pokemon}
                      selectedMoves={teamData[index]?.moves || []}
                      getTypeColor={getTypeColor}
                      getTypeNameInLanguage={getTypeNameInLanguage}
                      getMoveNameInLanguage={getMoveNameInLanguage}
                      selectedSpriteType={selectedSpriteType}
                      selectedSpriteVariant={selectedSpriteVariant}
                      selectedTypeGeneration={selectedTypeGeneration}
                      hideExportButton={true}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="team-control-box">
          <div className="mode-switch">
            <button className={`mode-btn ${rightPanelMode === 'controls' ? 'active' : ''}`} onClick={() => setRightPanelMode('controls')}>
              Configuration
            </button>
            <button className={`mode-btn ${rightPanelMode === 'customizer' ? 'active' : ''}`} onClick={() => setRightPanelMode('customizer')}>
              Style & Export
            </button>
          </div>

          {rightPanelMode === 'controls' && (
            <div className="team-control-panel">
              <div className="layout-selector-group">
                <label>{t('team_layout') || 'Layout'}</label>
                <div className="layout-buttons">
                  {getAvailableLayouts().length > 0 ? (
                    getAvailableLayouts().map(l => (
                      <button key={l} className={`layout-btn ${layout === l ? 'active' : ''}`} onClick={() => setLayout(l)}>{l}</button>
                    ))
                  ) : (
                    <p style={{ color: '#999', fontSize: '0.9rem', margin: 0 }}>{t('team_empty_slot') || 'Add Pokémon to enable layouts'}</p>
                  )}
                </div>
              </div>

              <div className="slots-selector-group">
                <label>{t('team_slots') || 'Slots'} ({getActivePokemonCount()}/6)</label>
                <div className="slots-grid">
                  {teamPokemon.map((pokemon, index) => (
                    <button
                      key={index}
                      className={`slot-btn ${selectedSlot === index ? 'active' : ''} ${pokemon ? 'filled' : 'empty'}`}
                      onClick={() => setSelectedSlot(index)}
                      title={pokemon ? pokemon.names?.en || pokemon.name_en : `Slot ${index + 1}`}
                    >
                      <span className="slot-num">{index + 1}</span>
                      {pokemon && <span className="slot-name">{pokemon.names?.en || pokemon.name_en}</span>}
                    </button>
                  ))}
                </div>
              </div>

              {teamPokemon[selectedSlot] === null ? (
                <div className="pokemon-selection">
                  <label>{t('team_search_pokemon') || 'Search Pokémon'}</label>
                  <SearchableSelector
                    items={pokemons}
                    onSelect={addPokemonToTeam}
                    selectedId={null}
                    getDisplayName={(pokemon) => {
                      const name = pokemon.names?.en || pokemon.name_en || '';
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
                      if (pokemon.name_en) searchStrings.push(pokemon.name_en);
                      return searchStrings;
                    }}
                    placeholder={t('search_placeholder') || 'Search...'}
                  />
                </div>
              ) : (
                <div className="pokemon-customization">
                  <div className="pokemon-header">
                    <h3>{teamPokemon[selectedSlot]?.names?.en || teamPokemon[selectedSlot]?.name_en}</h3>
                    <button className="remove-btn" onClick={() => removePokemonFromTeam(selectedSlot)}>✕</button>
                  </div>

                  <div className="selector-group">
                    <label>{t('pokemon_talent') || 'Ability'}</label>
                    <SearchableSelector
                      items={getAvailableAbilities(teamPokemon[selectedSlot])}
                      onSelect={(ability) => updateTeamData(selectedSlot, 'ability', ability)}
                      selectedId={teamData[selectedSlot]?.ability?.id}
                      getDisplayName={(ability) => ability.names?.[cardLanguage] || ability.names?.en || ''}
                      getSearchStrings={(ability) => Object.values(ability.names || {}).filter(Boolean)}
                      placeholder={t('search_placeholder') || 'Select...'}
                    />
                  </div>

                  <div className="selector-group">
                    <label>{t('pokemon_nature') || 'Nature'}</label>
                    <SearchableSelector
                      items={allNatures}
                      onSelect={(nature) => updateTeamData(selectedSlot, 'nature', nature)}
                      selectedId={teamData[selectedSlot]?.nature?.id}
                      getDisplayName={(nature) => nature.names?.[cardLanguage] || nature.names?.en || ''}
                      getSearchStrings={(nature) => Object.values(nature.names || {}).filter(Boolean)}
                      placeholder={t('search_placeholder') || 'Select...'}
                    />
                  </div>

                  <div className="selector-group">
                    <label>{t('pokemon_item') || 'Item'}</label>
                    <SearchableSelector
                      items={allItems}
                      onSelect={(item) => updateTeamData(selectedSlot, 'item', item)}
                      selectedId={teamData[selectedSlot]?.item?.id}
                      getDisplayName={(item) => item.names?.[cardLanguage] || item.names?.en || ''}
                      getSearchStrings={(item) => Object.values(item.names || {}).filter(Boolean)}
                      placeholder={t('search_placeholder') || 'Select...'}
                    />
                  </div>

                  <div className="moves-group">
                    <label>{t('pokemon_attacks') || 'Moves'}</label>
                    {(teamData[selectedSlot]?.moves || [null, null, null, null]).map((move, moveIndex) => (
                      <div key={moveIndex} className="move-selector">
                        <SearchableSelector
                          items={getAvailableMoves(teamPokemon[selectedSlot])}
                          onSelect={(m) => updateMoveInTeam(selectedSlot, moveIndex, m)}
                          selectedId={move?.id}
                          getDisplayName={(m) => m.names?.[cardLanguage] || m.names?.en || ''}
                          getSearchStrings={(m) => Object.values(m.names || {}).filter(Boolean)}
                          placeholder={`${t('move') || 'Move'} ${moveIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="import-section">
                <label>{t('team_import') || 'Import Team'}</label>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder={t('team_import_placeholder') || 'Paste team here...'}
                  className="import-textarea"
                />
                {importError && <div className="import-error">{importError}</div>}
                <button className="import-btn" onClick={() => parseTeamText(importText)} disabled={!importText.trim()}>
                  {t('team_import_btn') || 'Import'}
                </button>
              </div>
            </div>
          )}

          {rightPanelMode === 'customizer' && (
            <div className="team-customizer-panel">
              <div className="customizer-content">
                <div className="customizer-section-title">
                  <h4>{t('team_cards_style') || 'Cards Style'}</h4>
                </div>
                <div className="team-toggle-option">
                  <label htmlFor="team-show-nature-toggle">{t('team_show_nature') || 'Afficher la nature'}</label>
                  <input id="team-show-nature-toggle" type="checkbox" checked={showNature} onChange={(e) => setShowNature(e.target.checked)} />
                </div>
                <CardCustomizer
                  onBackgroundChange={setBackground}
                  onBorderRadiusChange={setBorderRadius}
                  onFontChange={setSelectedFont}
                  onCustomFontChange={(file, name) => { setCustomFontFile(file); setCustomFontName(name); }}
                  backgroundColor={bgColor}
                  onBackgroundColorChange={setBgColor}
                  backgroundOpacity={backgroundOpacity}
                  onBackgroundOpacityChange={setBackgroundOpacity}
                  gradientColor2={gradColor2}
                  onGradientColor2Change={setGradColor2}
                  onBackgroundImageChange={setBackgroundImage}
                  fontColor={fontColor}
                  onFontColorChange={setFontColor}
                  borderColor={borderColor}
                  onBorderColorChange={setBorderColor}
                  borderOpacity={borderOpacity}
                  onBorderOpacityChange={setBorderOpacity}
                  selectedGeneration={'gen9_scarlet_violet'}
                  onGenerationChange={() => {}}
                  selectedTypeGeneration={selectedTypeGeneration}
                  onTypeGenerationChange={setSelectedTypeGeneration}
                />
                <div className="customizer-divider"></div>
                <div className="customizer-section-title">
                  <h4>{t('team_outer_box_style') || 'Outer Box Style'}</h4>
                </div>
                <CardCustomizer
                  onBackgroundChange={setOuterBackground}
                  onBorderRadiusChange={setOuterBorderRadius}
                  onFontChange={() => {}}
                  onCustomFontChange={() => {}}
                  backgroundColor={outerBgColor}
                  onBackgroundColorChange={setOuterBgColor}
                  backgroundOpacity={outerBackgroundOpacity}
                  onBackgroundOpacityChange={setOuterBackgroundOpacity}
                  gradientColor2={outerGradColor2}
                  onGradientColor2Change={setOuterGradColor2}
                  onBackgroundImageChange={setOuterBackgroundImage}
                  fontColor={''}
                  onFontColorChange={() => {}}
                  borderColor={outerBorderColor}
                  onBorderColorChange={setOuterBorderColor}
                  borderOpacity={outerBorderOpacity}
                  onBorderOpacityChange={setOuterBorderOpacity}
                  hideFontSettings={true}
                  hideLanguageSettings={true}
                  hideSpriteSettings={true}
                  isTeamBorderLayout={true}
                />
              </div>
              <button className="export-btn" onClick={exportTeamImage} disabled={isExporting}>
                {isExporting ? 'Export en cours...' : (t('team_export') || 'Export as PNG')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Team;