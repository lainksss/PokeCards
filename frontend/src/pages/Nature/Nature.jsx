import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import BaseFlashcard from '../../components/BaseFlashcard/BaseFlashcard';
import CardCustomizer from '../../components/CardCustomizer/CardCustomizer';
import SearchableSelector from '../../components/SearchableSelector/SearchableSelector';
import './Nature.css';

const Nature = () => {
  const { t, loadPageTranslations, language } = useLanguage();
  const [natures, setNatures] = useState([]);
  const [selectedNature, setSelectedNature] = useState(null);
  const [background, setBackground] = useState('transparent');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [gradColor2, setGradColor2] = useState('#3b4cca');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [borderRadius, setBorderRadius] = useState(true);
  const [selectedFont, setSelectedFont] = useState('default');
  const [fontColor, setFontColor] = useState('#000000');
  const [borderColor, setBorderColor] = useState('#1a237e');
  const [cardLanguage, setCardLanguage] = useState('fr');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPageTranslations('nature');
    fetchNatures();
  }, []);

  // Sync flashcard language with global language
  useEffect(() => {
    setCardLanguage(language);
  }, [language]);

  const fetchNatures = async () => {
    try {
      const response = await fetch('/PokeCards/data/natures.json');
      const data = await response.json();
      setNatures(data);
      if (data.length > 0) {
        setSelectedNature(data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load natures:', error);
      setLoading(false);
    }
  };

  const formatStat = (stat) => {
    if (!stat) return '—';
    return stat.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  };

  const getFlashcardData = () => {
    if (!selectedNature) return {};
    
    // Toujours utiliser les MÊMES clés en français, peu importe la langue de la flashcard
    // La traduction des labels se fera dans BaseFlashcard
    return {
      'Nom': selectedNature.names?.[cardLanguage] || selectedNature.names?.en || 'Nature',
      'Stat améliorée': formatStat(selectedNature.increased_stat),
      'Stat réduite': formatStat(selectedNature.decreased_stat)
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
    return <div className="nature-container"><p>{t('loading')}</p></div>;
  }

  return (
    <div className="nature-container">
      <h1>{t('nature_name')}</h1>
      
      <div className="nature-layout">
        <div className="flashcard-panel">
          {selectedNature && (
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
            />
          )}
        </div>

        <div className="customizer-panel">
          <div className="language-selector">
            <label>{t('flashcard_language')}</label>
            <div className="lang-buttons-grid">
              {availableLanguages.map((lang) => (
                <button 
                  key={lang.code}
                  className={cardLanguage === lang.code ? 'active' : ''}
                  onClick={() => setCardLanguage(lang.code)}
                  title={t(lang.label)}
                >
                  {t(lang.label)}
                </button>
              ))}
            </div>
          </div>

          <SearchableSelector
            items={natures}
            onSelect={setSelectedNature}
            selectedId={selectedNature?.id}
            getDisplayName={(nature) => nature.names?.[language] || nature.names?.en || 'Unknown'}
            getSearchStrings={(nature) => Object.values(nature.names || {}).filter(name => name)}
            placeholder={t('search_nature')}
          />

          <CardCustomizer
            background={background}
            onBackgroundChange={setBackground}
            backgroundColor={bgColor}
            onBackgroundColorChange={setBgColor}
            gradientColor2={gradColor2}
            onGradientColor2Change={setGradColor2}
            onBackgroundImageChange={setBackgroundImage}
            borderRadius={borderRadius}
            onBorderRadiusChange={setBorderRadius}
            selectedFont={selectedFont}
            onFontChange={setSelectedFont}
            fontColor={fontColor}
            onFontColorChange={setFontColor}
            borderColor={borderColor}
            onBorderColorChange={setBorderColor}
          />
        </div>
      </div>
    </div>
  );
};

export default Nature;
