import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './CardCustomizer.css';

const CardCustomizer = ({ 
  onBackgroundChange, 
  onBorderRadiusChange,
  onFontChange,
  onCustomFontChange,
  backgroundColor,
  onBackgroundColorChange,
  backgroundOpacity,
  onBackgroundOpacityChange,
  gradientColor2,
  onGradientColor2Change,
  onBackgroundImageChange,
  fontColor,
  onFontColorChange,
  borderColor,
  onBorderColorChange,
  borderOpacity,
  onBorderOpacityChange,
  selectedGeneration,
  onGenerationChange,
  selectedTypeGeneration,
  onTypeGenerationChange,
  isAttack = false,
  showTitleStyle = true,
  titleStyle,
  onTitleStyleChange,
  showSpriteSelector = false,
  spriteType = 'official_artwork',
  onSpriteTypeChange,
  spriteVariant = 'normal',
  onSpriteVariantChange,
  availableSpriteTypes = [],
  hideFontSettings = false,
  hideLanguageSettings = false,
  hideSpriteSettings = false,
  isTeamBorderLayout = false
}) => {
  const { t } = useLanguage();
  const [background, setBackground] = useState('transparent');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [gradColor2, setGradColor2] = useState('#3b4cca');
  const [borderRadius, setBorderRadius] = useState(true);
  const [font, setFont] = useState('default');
  const [fontColorState, setFontColorState] = useState(fontColor || '#000000');
  const [borderColorState, setBorderColorState] = useState(borderColor || '#1a237e');
  const [backgroundOpacityState, setBackgroundOpacityState] = useState(backgroundOpacity ?? 1);
  const [borderOpacityState, setBorderOpacityState] = useState(borderOpacity ?? 1);
  const [generationState, setGenerationState] = useState(selectedGeneration || 'gen9_scarlet_violet');
  const [typeGenerationState, setTypeGenerationState] = useState(selectedTypeGeneration || 'gen9_scarlet_violet');
  const [spriteTypeState, setSpriteTypeState] = useState(spriteType);
  const [spriteVariantState, setSpriteVariantState] = useState(spriteVariant);
  const [customFontFile, setCustomFontFile] = useState(null);
  const [customFontName, setCustomFontName] = useState('');

  const handleBackgroundChange = (type) => {
    setBackground(type);
    onBackgroundChange(type);
  };

  const handleColorChange = (e) => {
    setBgColor(e.target.value);
    onBackgroundColorChange?.(e.target.value);
    
    // Seulement forcer le solid si on n'est pas déjà en gradient
    if (background !== 'gradient') {
      onBackgroundChange('solid');
      setBackground('solid');
    }
  };

  const handleGradientColor2Change = (e) => {
    setGradColor2(e.target.value);
    onGradientColor2Change?.(e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onBackgroundImageChange?.(event.target?.result);
        onBackgroundChange?.('image');
        setBackground('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBorderRadiusChange = (value) => {
    setBorderRadius(value);
    onBorderRadiusChange(value);
  };

  const handleFontChange = (selectedFont) => {
    setFont(selectedFont);
    onFontChange(selectedFont);
  };

  const handleFontColorChange = (e) => {
    setFontColorState(e.target.value);
    onFontColorChange?.(e.target.value);
  };

  const handleBorderColorChange = (e) => {
    setBorderColorState(e.target.value);
    onBorderColorChange?.(e.target.value);
  };

  const handleBackgroundOpacityChange = (e) => {
    const value = Number(e.target.value) / 100;
    setBackgroundOpacityState(value);
    onBackgroundOpacityChange?.(value);
  };

  const handleBorderOpacityChange = (e) => {
    const value = Number(e.target.value) / 100;
    setBorderOpacityState(value);
    onBorderOpacityChange?.(value);
  };

  const handleGenerationChange = (e) => {
    setGenerationState(e.target.value);
    onGenerationChange?.(e.target.value);
  };

  const handleTypeGenerationChange = (e) => {
    setTypeGenerationState(e.target.value);
    onTypeGenerationChange?.(e.target.value);
  };

  const handleTitleStyleChange = (style) => {
    onTitleStyleChange?.(style);
  };

  const handleSpriteTypeChange = (e) => {
    setSpriteTypeState(e.target.value);
    onSpriteTypeChange?.(e.target.value);
  };

  const handleSpriteVariantChange = (variant) => {
    setSpriteVariantState(variant);
    onSpriteVariantChange?.(variant);
  };

  const handleCustomFontUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fontData = event.target?.result;
        const fontNameFromFile = file.name.split('.').slice(0, -1).join('.');
        setCustomFontFile(fontData);
        setCustomFontName(fontNameFromFile);
        setFont('custom');
        onFontChange?.('custom');
        onCustomFontChange?.({ fontFile: fontData, fontName: fontNameFromFile });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="card-customizer">
      {!hideFontSettings && <h3>{t('customize_card')}</h3>}
      
      <div className="customizer-top-section">
        <div className="customizer-section">
          <label>{t('customizer_background')}</label>
        <div className="option-group">
          <button 
            className={background === 'transparent' ? 'active' : ''}
            onClick={() => handleBackgroundChange('transparent')}
          >
            {t('background_transparent')}
          </button>
          <button 
            className={background === 'solid' ? 'active' : ''}
            onClick={() => handleBackgroundChange('solid')}
          >
            {t('background_solid')}
          </button>
          <button 
            className={background === 'gradient' ? 'active' : ''}
            onClick={() => handleBackgroundChange('gradient')}
          >
            {t('background_gradient')}
          </button>
          <button 
            className={background === 'image' ? 'active' : ''}
            onClick={() => handleBackgroundChange('image')}
          >
            {t('background_image') || 'Image'}
          </button>
        </div>
        {background === 'solid' && (
          <input 
            type="color" 
            value={bgColor} 
            onChange={handleColorChange}
            className="color-picker"
          />
        )}
        {background === 'gradient' && (
          <div className="gradient-controls">
            <div className="color-control">
              <label>{t('gradient_color_1') || 'Couleur 1'}</label>
              <input 
                type="color" 
                value={bgColor} 
                onChange={handleColorChange}
                className="color-picker"
              />
            </div>
            <div className="color-control">
              <label>{t('gradient_color_2') || 'Couleur 2'}</label>
              <input 
                type="color" 
                value={gradColor2} 
                onChange={handleGradientColor2Change}
                className="color-picker"
              />
            </div>
          </div>
        )}
        {background === 'image' && (
          <div className="image-upload-section">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              className="image-upload"
            />
          </div>
        )}

        <div className="range-control">
          <label>{t('customizer_background_opacity') || 'Opacité fond'}</label>
          <input
            type="range"
            min={0}
            max={100}
            value={backgroundOpacityState * 100}
            onChange={handleBackgroundOpacityChange}
            className="range-slider"
          />
          <span className="range-value">{Math.round(backgroundOpacityState * 100)}%</span>
        </div>
        </div>

        <div className="customizer-section">
          <label>{t('customizer_borders')}</label>
          <div className="option-group">
            <button 
              className={borderRadius ? 'active' : ''}
              onClick={() => handleBorderRadiusChange(true)}
            >
              {t('borders_rounded')}
            </button>
            <button 
              className={!borderRadius ? 'active' : ''}
              onClick={() => handleBorderRadiusChange(false)}
            >
              {t('borders_square')}
            </button>
          </div>

          <div className="range-control">
            <label>{t('customizer_border_opacity') || 'Opacité bordures'}</label>
            <input
              type="range"
              min={0}
              max={100}
              value={borderOpacityState * 100}
              onChange={handleBorderOpacityChange}
              className="range-slider"
            />
            <span className="range-value">{Math.round(borderOpacityState * 100)}%</span>
          </div>
        </div>

        {!isTeamBorderLayout && showTitleStyle && (
          <div className="customizer-section">
            <label>{t('customizer_title_style')}</label>
            <div className="option-group">
              <button 
                className={titleStyle === 'standard' ? 'active' : ''}
                onClick={() => handleTitleStyleChange('standard')}
              >
                {t('title_style_standard')}
              </button>
              <button 
                className={titleStyle === 'rounded' ? 'active' : ''}
                onClick={() => handleTitleStyleChange('rounded')}
              >
                {t('title_style_rounded')}
              </button>
              <button 
                className={titleStyle === 'bordered' ? 'active' : ''}
                onClick={() => handleTitleStyleChange('bordered')}
              >
                {t('title_style_bordered')}
              </button>
              <button 
                className={titleStyle === 'none' ? 'active' : ''}
                onClick={() => handleTitleStyleChange('none')}
              >
                {t('title_style_none')}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="customizer-bottom-section">

      {!hideFontSettings && (
        <>
          <div className="customizer-section">
            <label>{t('customizer_font')}</label>
            <div className="option-group">
              <button 
                className={font === 'default' ? 'active' : ''}
                onClick={() => handleFontChange('default')}
              >
                {t('font_standard')}
              </button>
              <button 
                className={font === 'solid' ? 'active' : ''}
                onClick={() => handleFontChange('solid')}
              >
                {t('font_pokemon_solid')}
              </button>
              <button 
                className={font === 'hollow' ? 'active' : ''}
                onClick={() => handleFontChange('hollow')}
              >
                {t('font_pokemon_hollow')}
              </button>
              <button 
                className={font === 'dp-pro' ? 'active' : ''}
                onClick={() => handleFontChange('dp-pro')}
              >
                {t('font_pokemon_dp_pro')}
              </button>
              <button 
                className={font === 'custom' ? 'active' : ''}
                onClick={() => document.getElementById('custom-font-input')?.click()}
              >
                {customFontName ? `✎ ${customFontName}` : t('font_custom')}
              </button>
              <input 
                id="custom-font-input"
                type="file" 
                accept=".ttf,.otf,.woff,.woff2"
                onChange={handleCustomFontUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className="customizer-section">
            <label>{t('customizer_font_color') || 'Police'}</label>
            <div className="color-control">
              <input 
                type="color" 
                value={fontColorState} 
                onChange={handleFontColorChange}
                className="color-picker"
              />
            </div>
          </div>
        </>
      )}

      <div className="customizer-section">
        <label>{t('customizer_border_color') || 'Bordures'}</label>
        {isTeamBorderLayout ? (
          <div className="border-horizontal-layout">
            <div className="border-color-picker">
              <input 
                type="color" 
                value={borderColorState} 
                onChange={handleBorderColorChange}
                className="color-picker"
              />
            </div>
            <div className="border-options-right">
              <div className="border-buttons">
                <button 
                  className={borderRadius ? 'active' : ''}
                  onClick={() => handleBorderRadiusChange(true)}
                  title={t('borders_rounded')}
                >
                  {t('borders_rounded')}
                </button>
                <button 
                  className={!borderRadius ? 'active' : ''}
                  onClick={() => handleBorderRadiusChange(false)}
                  title={t('borders_square')}
                >
                  {t('borders_square')}
                </button>
              </div>
              <div className="border-opacity">
                <label>{t('customizer_border_opacity') || 'Opacité'}</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={borderOpacityState * 100}
                  onChange={handleBorderOpacityChange}
                  className="range-slider"
                />
                <span className="range-value">{Math.round(borderOpacityState * 100)}%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="color-control">
            <input 
              type="color" 
              value={borderColorState} 
              onChange={handleBorderColorChange}
              className="color-picker"
            />
          </div>
        )}
      </div>

      {(isAttack && !hideSpriteSettings) && (
        <div className="customizer-section">
          <label>{t('customizer_sprite_generation') || 'Sprite Generation'}</label>
          <select 
            value={generationState} 
            onChange={handleGenerationChange}
            className="generation-select"
          >
            <option value="gen3_emerald">{t('gen3_emerald')}</option>
            <option value="gen4_platinum">{t('gen4_platinum')}</option>
            <option value="gen5_black_white">{t('gen5_black_white')}</option>
            <option value="gen6_xy">{t('gen6_xy')}</option>
            <option value="gen7_sun_moon">{t('gen7_sun_moon')}</option>
            <option value="gen8_sword_shield">{t('gen8_sword_shield')}</option>
            <option value="gen9_scarlet_violet">{t('gen9_scarlet_violet')}</option>
          </select>
        </div>
      )}

      {(selectedTypeGeneration !== undefined && !hideLanguageSettings) && (
        <div className="customizer-section">
          <label>{t('customizer_type_sprite_generation') || 'Type Sprite Generation'}</label>
          <select 
            value={typeGenerationState} 
            onChange={handleTypeGenerationChange}
            className="generation-select"
          >
            <option value="gen3_emerald">{t('gen3_emerald')}</option>
            <option value="gen4_platinum">{t('gen4_platinum')}</option>
            <option value="gen5_black_white">{t('gen5_black_white')}</option>
            <option value="gen6_xy">{t('gen6_xy')}</option>
            <option value="gen7_sun_moon">{t('gen7_sun_moon')}</option>
            <option value="gen8_sword_shield">{t('gen8_sword_shield')}</option>
            <option value="gen9_scarlet_violet">{t('gen9_scarlet_violet')}</option>
          </select>
        </div>
      )}

      {(showSpriteSelector && !hideSpriteSettings) && (
        <>
          <div className="customizer-section">
            <label>{t('sprite_type') || 'Sprite Type'}</label>
            <select 
              value={spriteTypeState} 
              onChange={handleSpriteTypeChange}
              className="sprite-select"
            >
              {availableSpriteTypes.map(spriteType => (
                <option key={spriteType} value={spriteType}>
                  {spriteType.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="customizer-section">
            <label>{t('sprite_variant') || 'Sprite Variant'}</label>
            <div className="option-group">
              <button 
                className={spriteVariantState === 'normal' ? 'active' : ''}
                onClick={() => handleSpriteVariantChange('normal')}
              >
                Normal
              </button>
              <button 
                className={spriteVariantState === 'shiny' ? 'active' : ''}
                onClick={() => handleSpriteVariantChange('shiny')}
              >
                Shiny
              </button>
            </div>
          </div>
        </>
      )}
      </div>

    </div>
  );
};

export default CardCustomizer;
