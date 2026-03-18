import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import BaseFlashcard from '../../components/BaseFlashcard/BaseFlashcard';
import CardCustomizer from '../../components/CardCustomizer/CardCustomizer';
import SearchableSelector from '../../components/SearchableSelector/SearchableSelector';
import './Ability.css';

const Ability = () => {
  const { t, loadPageTranslations, language } = useLanguage();
  const [abilities, setAbilities] = useState([]);
  const [selectedAbility, setSelectedAbility] = useState(null);
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
  const [titleStyle, setTitleStyle] = useState('standard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPageTranslations('ability');
    fetchAbilities();
  }, []);

  useEffect(() => {
    setCardLanguage(language);
  }, [language]);

  const fetchAbilities = async () => {
    try {
      const abilitiesResponse = await fetch('/PokeCards/data/abilities.json');
      const abilitiesData = await abilitiesResponse.json();
      setAbilities(abilitiesData);
      if (abilitiesData.length > 0) {
        setSelectedAbility(abilitiesData[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);
    }
  };

  const getFlashcardData = () => {
    if (!selectedAbility) return {};
    
    return {
      'Nom': selectedAbility.names?.[cardLanguage] || selectedAbility.names?.en || 'Talent',
      'Description': selectedAbility.descriptions?.[cardLanguage] || selectedAbility.descriptions?.en || 'No description'
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
    return <div className="ability-container"><p>{t('loading')}</p></div>;
  }

  return (
    <div className="ability-container">
      <div className="top-bar">
        <h1 className="page-title">{t('ability_name')}</h1>
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
      
      <div className="ability-layout">
        <div className="flashcard-panel">
          {selectedAbility && (
            <>
              <BaseFlashcard
                data={getFlashcardData()}
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
                isAbility={true}
                titleStyle={titleStyle}
              />
            </>
          )}
        </div>

        <div className="customizer-panel">
          <div className="top-controls-row">
            <div className="item-selector">
              <SearchableSelector
                items={abilities}
                onSelect={setSelectedAbility}
                selectedId={selectedAbility?.id}
                getDisplayName={(ability) => ability.names?.[language] || ability.names?.en || 'Unknown'}
                getSearchStrings={(ability) => Object.values(ability.names || {}).filter(name => name)}
                placeholder={t('search_ability')}
                inlineSelected={true}
              />
            </div>
          </div>

          <CardCustomizer
            background={background}
            onBackgroundChange={setBackground}
            backgroundColor={bgColor}
            onBackgroundColorChange={setBgColor}
            backgroundOpacity={backgroundOpacity}
            onBackgroundOpacityChange={setBackgroundOpacity}
            gradientColor2={gradColor2}
            onGradientColor2Change={setGradColor2}
            onBackgroundImageChange={setBackgroundImage}
            borderRadius={borderRadius}
            onBorderRadiusChange={setBorderRadius}
            selectedFont={selectedFont}
            onFontChange={setSelectedFont}
            onCustomFontChange={(data) => {
              setCustomFontFile(data.fontFile);
              setCustomFontName(data.fontName);
            }}
            fontColor={fontColor}
            onFontColorChange={setFontColor}
            borderColor={borderColor}
            onBorderColorChange={setBorderColor}
            borderOpacity={borderOpacity}
            onBorderOpacityChange={setBorderOpacity}
            titleStyle={titleStyle}
            onTitleStyleChange={setTitleStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default Ability;
