import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Home from './pages/Home/Home';
import './App.css';

const Pokemon = () => <div><h2>🐾 Flashcard Pokémon</h2></div>;
const Nature = () => <div><h2>🌿 Flashcard Nature</h2></div>;
const Attack = () => <div><h2>⚔️ Flashcard Attaque</h2></div>;
const Item = () => <div><h2>🎒 Flashcard Objet</h2></div>;
const Ability = () => <div><h2>🌟 Flashcard Talent</h2></div>;
const Team = () => <div><h2>🛡️ Flashcard Équipe</h2></div>;

const Sidebar = () => {
  const { t, language, toggleLanguage } = useLanguage();
  return (
    <nav className="sidebar">
      <h1>PokeCards</h1>
      <ul>
        <li><Link to="/">{t('nav_home')}</Link></li>
        <li><Link to="/nature">{t('nav_nature')}</Link></li>
        <li><Link to="/attack">{t('nav_attack')}</Link></li>
        <li><Link to="/item">{t('nav_item')}</Link></li>
        <li><Link to="/ability">{t('nav_ability')}</Link></li>
        <li><Link to="/pokemon">{t('nav_pokemon')}</Link></li>
        <li><Link to="/team">{t('nav_team')}</Link></li>
      </ul>
      <button className="lang-toggle" onClick={toggleLanguage}>
        {t('switch_lang')}
      </button>
    </nav>
  );
};

function AppContent() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nature" element={<Nature />} />
            <Route path="/attack" element={<Attack />} />
            <Route path="/item" element={<Item />} />
            <Route path="/ability" element={<Ability />} />
            <Route path="/pokemon" element={<Pokemon />} />
            <Route path="/team" element={<Team />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
