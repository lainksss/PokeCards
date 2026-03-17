import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './Home.css';

const Home = () => {
  const { t, loadPageTranslations } = useLanguage();

  useEffect(() => {
    loadPageTranslations('home');
  }, [loadPageTranslations]);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="title">{t('home_title')}</h1>
        <h2 className="subtitle">{t('home_subtitle')}</h2>
        <p className="description">{t('home_description')}</p>
      </header>
      
      <section className="home-features">
        <h3>{t('home_features_title')}</h3>
        <ul className="features-list">
          <li>{t('feature_nature')}</li>
          <li>{t('feature_attack')}</li>
          <li>{t('feature_item')}</li>
          <li>{t('feature_ability')}</li>
          <li>{t('feature_pokemon')}</li>
          <li>{t('feature_team')}</li>
        </ul>
      </section>
    </div>
  );
};

export default Home;