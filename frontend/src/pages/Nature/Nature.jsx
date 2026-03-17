import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import BaseFlashcard from '../../components/BaseFlashcard/BaseFlashcard';
import CardCustomizer from '../../components/CardCustomizer/CardCustomizer';
import SearchableSelector from '../../components/SearchableSelector/SearchableSelector';
import './Nature.css';

const Nature = () => {
  const { t, loadPageTranslations } = useLanguage();
  const [natures, setNatures] = useState([]);
  const [selectedNature, setSelectedNature] = useState(null);
  const [background, setBackground] = useState('transparent');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [borderRadius, setBorderRadius] = useState(true);
  const [selectedFont, setSelectedFont] = useState('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPageTranslations('nature');
    fetchNatures();
  }, [loadPageTranslations]);

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
    return {
      'Nom': selectedNature.names?.fr || selectedNature.names?.en || 'Nature',
      'Stat améliorée': formatStat(selectedNature.increased_stat),
      'Stat réduite': formatStat(selectedNature.decreased_stat)
    };
  };

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
              borderRadius={borderRadius}
              selectedFont={selectedFont}
            />
          )}
        </div>

        <div className="customizer-panel">
          <SearchableSelector
            items={natures}
            onSelect={setSelectedNature}
            selectedId={selectedNature?.id}
            getDisplayName={(nature) => nature.names?.fr || nature.names?.en || 'Unknown'}
            placeholder="🔍 Search Nature..."
          />

          <CardCustomizer
            background={background}
            onBackgroundChange={setBackground}
            onBackgroundColorChange={setBgColor}
            onBorderRadiusChange={setBorderRadius}
            onFontChange={setSelectedFont}
          />
        </div>
      </div>
    </div>
  );
};

export default Nature;
