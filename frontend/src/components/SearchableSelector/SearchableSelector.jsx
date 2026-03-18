import React, { useState, useRef, useEffect } from 'react';
import './SearchableSelector.css';

const SearchableSelector = ({ 
  items, 
  onSelect, 
  selectedId,
  getDisplayName,
  getSearchStrings,
  placeholder = 'Search...',
  inlineSelected = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const filteredItems = items.filter(item => {
    const searchStrings = getSearchStrings ? getSearchStrings(item) : [getDisplayName(item)];
    return searchStrings.some(str => 
      str.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const selectedItem = items.find(item => item.id === selectedId);

  // Fermer le dropdown en cliquant à côté
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const containerClass = inlineSelected ? 'searchable-selector inline-selected' : 'searchable-selector';
  const openClass = isOpen ? 'is-open' : '';

  return (
    <div className={`${containerClass} ${openClass}`} ref={containerRef}>
      <div className="selector-input-wrapper">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="selector-input"
        />

        {isOpen && (
          <div className="selector-dropdown">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <button
                  key={item.id}
                  className={`selector-item ${selectedId === item.id ? 'active' : ''}`}
                  onClick={() => {
                    onSelect(item);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  {getDisplayName(item)}
                </button>
              ))
            ) : (
              <div className="selector-empty">No results</div>
            )}
          </div>
        )}
      </div>

      {!isOpen && selectedItem && (
        <div className="selector-selected">
          <strong>Current:</strong> {getDisplayName(selectedItem)}
        </div>
      )}
    </div>
  );
};

export default SearchableSelector;
