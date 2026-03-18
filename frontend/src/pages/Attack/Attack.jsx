import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import BaseFlashcard from '../../components/BaseFlashcard/BaseFlashcard';
import CardCustomizer from '../../components/CardCustomizer/CardCustomizer';
import SearchableSelector from '../../components/SearchableSelector/SearchableSelector';
import { getTypeColor } from '../../utils/typeColors';
import './Attack.css';

const Attack = () => {
  const { t, loadPageTranslations, language } = useLanguage();
  const [moves, setMoves] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedMove, setSelectedMove] = useState(null);
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPageTranslations('attack');
    fetchMovesAndTypes();
  }, []);

  useEffect(() => {
    setCardLanguage(language);
  }, [language]);

  const fetchMovesAndTypes = async () => {
    try {
      const movesResponse = await fetch('/PokeCards/data/moves.json');
      const movesData = await movesResponse.json();
      setMoves(movesData);
      if (movesData.length > 0) {
        setSelectedMove(movesData[0]);
      }

      const typesResponse = await fetch('/PokeCards/data/types.json');
      const typesData = await typesResponse.json();
      setTypes(typesData);

      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);
    }
  };

  const getTypeIcon = (typeName) => {
    const typeData = types.find(t => t.name_en === typeName);
    return typeData?.sprites?.[selectedGeneration] || '';
  };

  const getDamageClassIcon = (damageClass) => {
    if (!damageClass) return '';
    return `/PokeCards/move_specification/move-${damageClass.toLowerCase()}.png`;
  };

  const getTypeNameInLanguage = (typeName) => {
    const typeData = types.find(t => t.name_en === typeName);
    return typeData?.names?.[cardLanguage] || typeData?.names?.en || typeName;
  };

  const getFlashcardData = () => {
    if (!selectedMove) return {};
    
    return {
      'Nom': selectedMove.names?.[cardLanguage] || selectedMove.names?.en || 'Move',
      'Type': getTypeNameInLanguage(selectedMove.type),
      'Puissance': selectedMove.power || '—',
      'Précision': selectedMove.accuracy ? `${selectedMove.accuracy}%` : '—',
      'PP': selectedMove.pp || '—',
      'Description': selectedMove.descriptions?.[cardLanguage] || selectedMove.descriptions?.en || 'No description'
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
    return <div className="attack-container"><p>{t('loading')}</p></div>;
  }

  return (
    <div className="attack-container">
      <h1 className="page-title">{t('attack_name')}</h1>
      
      <div className="attack-layout">
        <div className="flashcard-panel">
          {selectedMove && (
            <>
              <BaseFlashcard
                data={getFlashcardData()}
                background={background}
                backgroundColor={bgColor}
                gradientColor2={gradColor2}
                backgroundImage={backgroundImage}
                borderRadius={borderRadius}
                selectedFont={selectedFont}
                fontColor={fontColor}
                borderColor={getTypeColor(selectedMove.type)}
                cardLanguage={cardLanguage}
                isAttack={true}
                moveType={selectedMove.type}
                typeIcon={getTypeIcon(selectedMove.type)}
                damageClass={selectedMove.damage_class}
                damageClassIcon={getDamageClassIcon(selectedMove.damage_class)}
              />
            </>
          )}
        </div>

        <div className="customizer-panel">
          <div className="top-controls-row">
            <div className="language-selector">
              <label>{t('flashcard_language')}</label>
              <select 
                value={cardLanguage} 
                onChange={(e) => setCardLanguage(e.target.value)}
                className="language-select"
              >
                {availableLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {t(lang.label)}
                  </option>
                ))}
              </select>
            </div>

            <div className="item-selector">
              <SearchableSelector
                items={moves}
                onSelect={setSelectedMove}
                selectedId={selectedMove?.id}
                getDisplayName={(move) => move.names?.[language] || move.names?.en || 'Unknown'}
                getSearchStrings={(move) => Object.values(move.names || {}).filter(name => name)}
                placeholder={t('search_attack')}
              />
            </div>
          </div>

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
            selectedGeneration={selectedGeneration}
            onGenerationChange={setSelectedGeneration}
            isAttack={true}
            showTitleStyle={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Attack;
