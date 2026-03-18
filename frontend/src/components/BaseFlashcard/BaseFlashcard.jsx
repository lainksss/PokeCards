import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { useLanguage } from '../../context/LanguageContext';
import './BaseFlashcard.css';

const BaseFlashcard = ({ 
  data, 
  onExport,
  onDataChange,
  background = 'transparent',
  backgroundColor = '#ffffff',
  gradientColor2 = '#3b4cca',
  backgroundImage = null,
  backgroundOpacity = 1,
  borderRadius = true,
  selectedFont = 'default',
  fontColor = '#000000',
  borderColor = '#1a237e',
  borderOpacity = 1,
  cardLanguage = 'fr',
  isAttack = false,
  moveType = null,
  typeIcon = null,
  damageClass = null,
  damageClassIcon = null,
  isItem = false,
  itemSprite = null,
  isAbility = false,
  titleStyle = 'rounded',
  isPokemon = false,
  selectedPokemon = null,
  selectedMoves = [],
  getTypeColor = null,
  getTypeNameInLanguage = null,
  getMoveNameInLanguage = null,
  selectedSpriteType = 'official_artwork',
  selectedSpriteVariant = 'normal',
  selectedTypeGeneration = 'gen9_scarlet_violet'
}) => {
  const applyOpacityToColor = (color, opacity) => {
    if (!color) return color;
    const normalizedOpacity = Math.max(0, Math.min(1, opacity));

    // If already rgba, replace alpha
    const rgbaMatch = color.match(/rgba\s*\(\s*(\d+),\s*(\d+),\s*(\d+),\s*([\d\.]+)\s*\)/i);
    if (rgbaMatch) {
      const [_, r, g, b] = rgbaMatch;
      return `rgba(${r}, ${g}, ${b}, ${normalizedOpacity})`;
    }

    // If rgb, convert to rgba
    const rgbMatch = color.match(/rgb\s*\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/i);
    if (rgbMatch) {
      const [_, r, g, b] = rgbMatch;
      return `rgba(${r}, ${g}, ${b}, ${normalizedOpacity})`;
    }

    // If hex, convert to rgba
    const hexMatch = color.replace('#', '');
    if (/^[0-9a-fA-F]{3}$/.test(hexMatch)) {
      const r = parseInt(hexMatch[0] + hexMatch[0], 16);
      const g = parseInt(hexMatch[1] + hexMatch[1], 16);
      const b = parseInt(hexMatch[2] + hexMatch[2], 16);
      return `rgba(${r}, ${g}, ${b}, ${normalizedOpacity})`;
    }
    if (/^[0-9a-fA-F]{6}$/.test(hexMatch)) {
      const r = parseInt(hexMatch.slice(0, 2), 16);
      const g = parseInt(hexMatch.slice(2, 4), 16);
      const b = parseInt(hexMatch.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${normalizedOpacity})`;
    }

    // Fallback: return original (opacity not supported)
    return color;
  };

  const borderColorWithOpacity = applyOpacityToColor(borderColor, borderOpacity);

  const { t } = useLanguage();
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleExportPNG = async () => {
    if (!cardRef.current) return;
    
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: background === 'transparent' ? 'rgba(0,0,0,0)' : undefined,
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `flashcard-${Date.now()}.png`;
      link.click();
      
      if (onExport) onExport('PNG');
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFieldSave = (key) => {
    if (onDataChange) {
      onDataChange({ ...data, [key]: editValue });
    }
    setEditingField(null);
  };

  const handleFieldClick = (key, value) => {
    setEditingField(key);
    setEditValue(value);
  };

  const getBackgroundStyle = () => {
    if (background === 'image' && backgroundImage) {
      return { 
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: applyOpacityToColor('#000000', 1 - backgroundOpacity),
        backgroundBlendMode: 'overlay'
      };
    }
    if (background === 'transparent') return { backgroundColor: 'transparent' };
    if (background === 'solid') return { backgroundColor: applyOpacityToColor(backgroundColor, backgroundOpacity) };
    if (background === 'gradient') return {
      background: `linear-gradient(135deg, ${applyOpacityToColor(backgroundColor, backgroundOpacity)} 0%, ${applyOpacityToColor(gradientColor2, backgroundOpacity)} 100%)`
    };
    return {};
  };

  const getFieldClass = (key) => {
    if (key.toLowerCase().includes('améliorée') || key.toLowerCase().includes('increased')) {
      return 'stat-buff';
    }
    if (key.toLowerCase().includes('réduite') || key.toLowerCase().includes('decreased')) {
      return 'stat-nerf';
    }
    if (key === 'Nom' || key === 'Name') {
      return 'field-title';
    }
    if (isAttack && (key === 'Type' || key.toLowerCase().includes('type'))) {
      return 'attack-type-badge';
    }
    if (isAttack && (key === 'Description' || key.toLowerCase().includes('description'))) {
      return 'attack-description';
    }
    if (isAttack && (key === 'Puissance' || key === 'Power' || key === 'Précision' || key === 'Accuracy' || key === 'PP')) {
      return 'attack-stat';
    }
    return 'field-regular';
  };

  const getTranslatedLabel = (key) => {
    // Seulement FR et EN - tout le reste en anglais
    if (cardLanguage === 'fr') {
      const frTranslations = {
        'Nom': 'Nom',
        'Stat améliorée': 'Stat améliorée',
        'Stat réduite': 'Stat réduite',
        'Type': 'Type',
        'Puissance': 'Puissance',
        'Précision': 'Précision',
        'PP': 'PP',
        'Description': 'Description'
      };
      return frTranslations[key] || key;
    }
    
    // Par défaut en anglais pour toutes les autres langues
    const enTranslations = {
      'Nom': 'Name',
      'Stat améliorée': 'Increased Stat',
      'Stat réduite': 'Decreased Stat',
      'Type': 'Type',
      'Puissance': 'Power',
      'Précision': 'Accuracy',
      'PP': 'PP',
      'Description': 'Description'
    };
    return enTranslations[key] || key;
  };

  const entries = data ? Object.entries(data) : [];
  const titleEntry = entries.find(([key]) => key === 'Nom' || key === 'Name');
  
  if (isAttack) {
    // Layout spécial pour les attaques
    const typeEntry = entries.find(([key]) => key === 'Type');
    const powerEntry = entries.find(([key]) => key === 'Puissance' || key === 'Power');
    const accuracyEntry = entries.find(([key]) => key === 'Précision' || key === 'Accuracy');
    const ppEntry = entries.find(([key]) => key === 'PP');
    const descriptionEntry = entries.find(([key]) => key === 'Description');
    
    return (
      <div className="flashcard-container">
        <div 
          ref={cardRef}
          className={`flashcard flashcard-attack ${borderRadius ? 'rounded' : 'square'} font-${selectedFont}`}
          style={{
            ...getBackgroundStyle(),
            color: fontColor,
            borderColor: borderColorWithOpacity
          }}
        >
          {/* Title avec Type badge et Damage Class */}
          <div className="attack-header" style={{ borderBottomColor: borderColor }}>
            {titleEntry && (
              <div className="attack-title-section">
                <span className="field-value title-value" style={{ color: fontColor }}>
                  {titleEntry[1]}
                </span>
              </div>
            )}
            {damageClassIcon && (
              <div className="attack-damage-class-icon">
                <img src={damageClassIcon} alt={damageClass} title={damageClass} />
              </div>
            )}
            {typeEntry && typeIcon && (
              <div className="type-badge">
                <img src={typeIcon} alt={typeEntry[1]} title={typeEntry[1]} />
              </div>
            )}
          </div>

          {/* Stats row: Power, Accuracy, PP */}
          <div className="attack-stats-row">
            {powerEntry && (
              <div className="attack-stat-box" style={{ borderColor: borderColor }}>
                <span className="stat-label" style={{ color: fontColor }}>
                  {getTranslatedLabel(powerEntry[0])}
                </span>
                <span className="stat-value" style={{ color: fontColor }}>
                  {powerEntry[1]}
                </span>
              </div>
            )}
            {accuracyEntry && (
              <div className="attack-stat-box" style={{ borderColor: borderColor }}>
                <span className="stat-label" style={{ color: fontColor }}>
                  {getTranslatedLabel(accuracyEntry[0])}
                </span>
                <span className="stat-value" style={{ color: fontColor }}>
                  {accuracyEntry[1]}
                </span>
              </div>
            )}
            {ppEntry && (
              <div className="attack-stat-box" style={{ borderColor: borderColor }}>
                <span className="stat-label" style={{ color: fontColor }}>
                  {getTranslatedLabel(ppEntry[0])}
                </span>
                <span className="stat-value" style={{ color: fontColor }}>
                  {ppEntry[1]}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {descriptionEntry && (
            <div className="attack-description-box" style={{ borderColor: borderColor }}>
              <span className="description-text" style={{ color: fontColor }}>
                {descriptionEntry[1]}
              </span>
            </div>
          )}
        </div>

        <button 
          onClick={handleExportPNG} 
          disabled={isExporting}
          className="export-btn"
        >
          {isExporting ? 'Exporting...' : t('export_png')}
        </button>
      </div>
    );
  }

  if (isItem) {
    // Layout spécial pour les objets
    const descriptionEntry = entries.find(([key]) => key === 'Description');
    
    return (
      <div className="flashcard-container">
        <div 
          ref={cardRef}
          className={`flashcard flashcard-item ${borderRadius ? 'rounded' : 'square'} font-${selectedFont}`}
          style={{
            ...getBackgroundStyle(),
            color: fontColor,
            borderColor: borderColorWithOpacity
          }}
        >
          {/* Header: Title + Sprite */}
          <div className="item-header" style={{ borderBottomColor: borderColor }}>
            {titleEntry && (
              <div className="item-title-section">
                <span className="field-value title-value" style={{ color: fontColor }}>
                  {titleEntry[1]}
                </span>
              </div>
            )}
            {itemSprite && (
              <div className="item-sprite">
                <img src={itemSprite} alt={titleEntry?.[1]} title={titleEntry?.[1]} />
              </div>
            )}
          </div>

          {/* Description */}
          {descriptionEntry && (
            <div className="item-description-box" style={{ borderColor: borderColor }}>
              <span className="description-text" style={{ color: fontColor }}>
                {descriptionEntry[1]}
              </span>
            </div>
          )}
        </div>

        <button 
          onClick={handleExportPNG} 
          disabled={isExporting}
          className="export-btn"
        >
          {isExporting ? 'Exporting...' : t('export_png')}
        </button>
      </div>
    );
  }

  if (isAbility) {
    // Layout spécial pour les talents
    const descriptionEntry = entries.find(([key]) => key === 'Description');
    
    return (
      <div className="flashcard-container">
        <div 
          ref={cardRef}
          className={`flashcard flashcard-ability ${borderRadius ? 'rounded' : 'square'} font-${selectedFont}`}
          style={{
            ...getBackgroundStyle(),
            color: fontColor,
            borderColor: borderColorWithOpacity
          }}
        >
          {/* Title field */}
          {titleEntry && (
            <div className={`flashcard-field field-title title-style-${titleStyle}`} style={{ borderColor: borderColor, borderTopColor: borderColor, borderBottomColor: borderColor, borderLeftColor: borderColor, borderRightColor: borderColor }}>
              <div className="title-content">
                <span className="field-value title-value" style={{ color: fontColor }}>
                  {titleEntry[1]}
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          {descriptionEntry && (
            <div className="ability-description-box" style={{ borderColor: borderColor }}>
              <span className="description-text" style={{ color: fontColor }}>
                {descriptionEntry[1]}
              </span>
            </div>
          )}
        </div>

        <button 
          onClick={handleExportPNG} 
          disabled={isExporting}
          className="export-btn"
        >
          {isExporting ? 'Exporting...' : t('export_png')}
        </button>
      </div>
    );
  }

  // Layout normal pour les Natures
  const otherEntries = entries.filter(([key]) => key !== 'Nom' && key !== 'Name');

  if (isPokemon && selectedPokemon) {
    // Layout spécial pour Pokémon
    const spriteUrl = selectedPokemon.sprites?.[selectedSpriteType]?.[selectedSpriteVariant];
    
    return (
      <div className="flashcard-container">
        <div 
          ref={cardRef}
          className={`flashcard flashcard-pokemon ${borderRadius ? 'rounded' : 'square'} font-${selectedFont}`}
          style={{
            ...getBackgroundStyle(),
            color: fontColor,
            borderColor: borderColorWithOpacity,
            '--border-color': borderColor
          }}
        >
          {/* Header: Name (left) + Sprite (right) */}
          <div className="pokemon-header">
            <div className="pokemon-name-section">
              <span className="pokemon-name" style={{ color: fontColor }}>
                {data.name}
              </span>
              {/* Type icons below name */}
              {data.pokemonTypes && data.pokemonTypes.length > 0 && (
                <div className="pokemon-types-row">
                  {data.pokemonTypes.map((type, idx) => (
                    <div key={idx} className="type-icon-wrapper">
                      {type.sprite && (
                        <img 
                          src={type.sprite} 
                          alt={type.name} 
                          title={type.name}
                          className="pokemon-type-icon"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {spriteUrl && (
              <div className="pokemon-sprite-section">
                <img src={spriteUrl} alt={data.name} className="pokemon-sprite" />
              </div>
            )}
          </div>

          {/* Middle: Ability, Nature, Item (left side) */}
          <div className="pokemon-info-section">
            <div className="pokemon-info-row">
              <div className="pokemon-info-item">
                <span className="info-label" style={{ color: fontColor }}>
                  {cardLanguage === 'fr' ? 'TALENT' : 'ABILITY'}
                </span>
                <span className="info-value" style={{ color: fontColor }}>
                  {data.ability}
                </span>
              </div>
            </div>
            <div className="pokemon-info-row">
              <div className="pokemon-info-item">
                <span className="info-label" style={{ color: fontColor }}>
                  {cardLanguage === 'fr' ? 'NATURE' : 'NATURE'}
                </span>
                <span className="info-value" style={{ color: fontColor }}>
                  {data.nature}
                </span>
              </div>
            </div>
            <div className="pokemon-info-row">
              <div className="pokemon-info-item">
                <span className="info-label" style={{ color: fontColor }}>
                  {cardLanguage === 'fr' ? 'OBJET' : 'ITEM'}
                </span>
                <div className="info-value-with-sprite">
                  <span className="info-value" style={{ color: fontColor }}>
                    {data.item}
                  </span>
                  {data.itemSprite && (
                    <img 
                      src={data.itemSprite} 
                      alt={data.item}
                      title={data.item}
                      className="item-icon"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Moves section: 2x2 grid */}
          <div className="pokemon-moves-section">
            <div className="moves-grid">
              {data.moves && data.moves.map((move, index) => (
                <div
                  key={index}
                  className="move-card"
                  style={{
                    border: `3px solid ${move.typeColor || fontColor}`,
                  }}
                >
                  <div className="move-name" style={{ color: fontColor }}>
                    {move.name}
                  </div>
                  <div className="move-meta-row">
                    <div className="move-stat-box" style={{ color: fontColor }}>
                      {move.power}
                    </div>
                    <div className="move-type" style={{ 
                      backgroundColor: move.typeColor || fontColor,
                      color: '#ffffff'
                    }}>
                      {move.type}
                    </div>
                    <div className="move-stat-box" style={{ color: fontColor }}>
                      {move.accuracy}
                    </div>
                  </div>
                </div>
              ))}
              {/* Placeholder for empty moves */}
              {data.moves && data.moves.length < 4 && 
                Array(4 - data.moves.length).fill(null).map((_, index) => (
                  <div key={`empty-${index}`} className="move-card empty" style={{ borderColor: fontColor }}>
                    <div className="move-name" style={{ color: fontColor }}>—</div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <button 
          onClick={handleExportPNG} 
          disabled={isExporting}
          className="export-btn"
        >
          {isExporting ? 'Exporting...' : t('export_png')}
        </button>
      </div>
    );
  }

  return (
    <div className="flashcard-container">
      <div 
        ref={cardRef}
        className={`flashcard ${borderRadius ? 'rounded' : 'square'} font-${selectedFont}`}
        style={{
          ...getBackgroundStyle(),
          color: fontColor,
          borderColor: borderColorWithOpacity
        }}
      >
        {/* Title field */}
        {titleEntry && (
          <div key={titleEntry[0]} className={`flashcard-field field-title title-style-${titleStyle}`} style={{ borderColor: borderColorWithOpacity }}>
            {editingField === titleEntry[0] ? (
              <div className="field-edit">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                  className="field-edit-input"
                />
                <div className="field-edit-buttons">
                  <button onClick={() => handleFieldSave(titleEntry[0])}>✓</button>
                  <button onClick={() => setEditingField(null)}>✕</button>
                </div>
              </div>
            ) : (
              <div 
                className="field-content title-content"
                onClick={() => handleFieldClick(titleEntry[0], titleEntry[1])}
                title="Click to edit"
              >
                <span className="field-value title-value" style={{ color: fontColor }}>{titleEntry[1]}</span>
              </div>
            )}
          </div>
        )}

        {/* Stats container (aligned horizontally) */}
        {otherEntries.length > 0 && (
          <div className="flashcard-stats-container">
            {otherEntries.map(([key, value]) => {
              const fieldClass = getFieldClass(key);
              const isBuff = fieldClass === 'stat-buff';
              return (
              <div 
                key={key} 
                className={`flashcard-field ${fieldClass}`}
                style={{ borderColor: borderColorWithOpacity }}
              >
                {editingField === key ? (
                  <div className="field-edit">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                      className="field-edit-input"
                    />
                    <div className="field-edit-buttons">
                      <button onClick={() => handleFieldSave(key)}>✓</button>
                      <button onClick={() => setEditingField(null)}>✕</button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="field-content"
                    onClick={() => handleFieldClick(key, value)}
                    title="Click to edit"
                  >
                    <span className="field-label" style={{ color: fontColor }}>{getTranslatedLabel(key)}</span>
                    <span className="field-value" style={{ color: fontColor }}>{value}</span>
                  </div>
                )}
              </div>
              );
            })}
          </div>
        )}
      </div>
      
      <button 
        onClick={handleExportPNG} 
        disabled={isExporting}
        className="export-btn"
      >
        {isExporting ? 'Exporting...' : t('export_png')}
      </button>
    </div>
  );
};

export default BaseFlashcard;
