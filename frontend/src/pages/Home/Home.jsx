import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        <div className="features-list">
          <Link to="/nature" className="feature-card">
            <div className="feature-name">Nature</div>
            <p>Flashcards détaillant les effets des natures.</p>
          </Link>
          <Link to="/attack" className="feature-card">
            <div className="feature-name">Attaque</div>
            <p>Puissance, précision, PP et description.</p>
          </Link>
          <Link to="/item" className="feature-card">
            <div className="feature-name">Objet</div>
            <p>Sprites, noms et descriptions des objets.</p>
          </Link>
          <Link to="/ability" className="feature-card">
            <div className="feature-name">Talent</div>
            <p>Nom et explication des talents Pokémon.</p>
          </Link>
          <Link to="/pokemon" className="feature-card">
            <div className="feature-name">Pokémon</div>
            <p>Création complète avec l'image du Pokémon, ses attaques, son talent, et ses objets.</p>
          </Link>
          <Link to="/team" className="feature-card">
            <div className="feature-name">Équipe</div>
            <p>Assemblez et alignez jusqu'à 6 Pokémon dans une disposition personnalisable.</p>
          </Link>
        </div>
      </section>

      <section className="home-translations-note">
        <h3>{t('translation_note_title')}</h3>
        <p>{t('translation_note_content')}</p>
      </section>

      <footer className="home-footer">
        <p>Made with ♥ by Lainkss · @lainkss on Discord</p>
      </footer>
    </div>
  );
};

export default Home;