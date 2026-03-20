import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Home from './pages/Home/Home';
import Nature from './pages/Nature/Nature';
import Attack from './pages/Attack/Attack';
import Item from './pages/Item/Item';
import Ability from './pages/Ability/Ability';
import Pokemon from './pages/Pokemon/Pokemon';
import Team from './pages/Team/Team';
import './App.css';

const Sidebar = () => {
  const { t, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
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
      <div className="sidebar-controls">
        <button className="lang-toggle" onClick={toggleLanguage}>
          {t('switch_lang')}
        </button>
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle dark mode">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
};

function AppContent() {
  return (
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
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <AppContent />
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
