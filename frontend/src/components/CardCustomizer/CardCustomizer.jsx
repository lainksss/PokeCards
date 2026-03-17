import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './CardCustomizer.css';

const CardCustomizer = ({ 
  onBackgroundChange, 
  onBorderRadiusChange,
  onFontChange,
  backgroundColor,
  onBackgroundColorChange
}) => {
  const { t } = useLanguage();
  const [background, setBackground] = useState('transparent');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [borderRadius, setBorderRadius] = useState(true);
  const [font, setFont] = useState('default');

  const handleBackgroundChange = (type) => {
    setBackground(type);
    onBackgroundChange(type);
  };

  const handleColorChange = (e) => {
    setBgColor(e.target.value);
    onBackgroundColorChange?.(e.target.value);
    onBackgroundChange('solid');
    setBackground('solid');
  };

  const handleBorderRadiusChange = (value) => {
    setBorderRadius(value);
    onBorderRadiusChange(value);
  };

  const handleFontChange = (selectedFont) => {
    setFont(selectedFont);
    onFontChange(selectedFont);
  };

  return (
    <div className="card-customizer">
      <h3>{t('customize_card')}</h3>
      
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
        </div>
        {background === 'solid' && (
          <input 
            type="color" 
            value={bgColor} 
            onChange={handleColorChange}
            className="color-picker"
          />
        )}
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
      </div>

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
        </div>
      </div>
    </div>
  );
};

export default CardCustomizer;

