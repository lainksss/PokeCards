import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import BaseFlashcard from '../../components/BaseFlashcard/BaseFlashcard';
import CardCustomizer from '../../components/CardCustomizer/CardCustomizer';
import SearchableSelector from '../../components/SearchableSelector/SearchableSelector';
import './Item.css';

const Item = () => {
  const { t, loadPageTranslations, language } = useLanguage();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [background, setBackground] = useState('transparent');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [gradColor2, setGradColor2] = useState('#3b4cca');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [borderRadius, setBorderRadius] = useState(true);
  const [selectedFont, setSelectedFont] = useState('default');
  const [fontColor, setFontColor] = useState('#000000');
  const [borderColor, setBorderColor] = useState('#1a237e');
  const [cardLanguage, setCardLanguage] = useState('fr');
  const [titleStyle, setTitleStyle] = useState('standard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPageTranslations('item');
    fetchItems();
  }, []);

  useEffect(() => {
    setCardLanguage(language);
  }, [language]);

  const fetchItems = async () => {
    try {
      const itemsResponse = await fetch('/PokeCards/data/items.json');
      const itemsData = await itemsResponse.json();
      setItems(itemsData);
      if (itemsData.length > 0) {
        setSelectedItem(itemsData[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);
    }
  };

  const getFlashcardData = () => {
    if (!selectedItem) return {};
    
    return {
      'Nom': selectedItem.names?.[cardLanguage] || selectedItem.names?.en || 'Item',
      'Description': selectedItem.descriptions?.[cardLanguage] || selectedItem.descriptions?.en || 'No description'
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
    return <div className="item-container"><p>{t('loading')}</p></div>;
  }

  return (
    <div className="item-container">
      <h1 className="page-title">{t('item_name')}</h1>
      
      <div className="item-layout">
        <div className="flashcard-panel">
          {selectedItem && (
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
                borderColor={borderColor}
                cardLanguage={cardLanguage}
                isItem={true}
                itemSprite={selectedItem.sprite}
                titleStyle={titleStyle}
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
                items={items}
                onSelect={setSelectedItem}
                selectedId={selectedItem?.id}
                getDisplayName={(item) => item.names?.[language] || item.names?.en || 'Unknown'}
                getSearchStrings={(item) => Object.values(item.names || {}).filter(name => name)}
                placeholder={t('search_item')}
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
            showTitleStyle={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Item;
