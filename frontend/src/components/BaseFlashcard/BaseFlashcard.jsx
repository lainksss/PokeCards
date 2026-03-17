import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { useLanguage } from '../../context/LanguageContext';
import './BaseFlashcard.css';

const BaseFlashcard = ({ 
  data, 
  onExport,
  onDataChange,
  background = 'transparent',
  backgroundColor = '#ffffff',
  borderRadius = true,
  selectedFont = 'default'
}) => {
  const { t } = useLanguage();
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleExportPNG = async () => {
    if (!cardRef.current) return;
    
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: background === 'transparent' ? 'rgba(0,0,0,0)' : undefined,
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `flashcard-${Date.now()}.png`;
      link.click();
      
      if (onExport) onExport('PNG');
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFieldClick = (key, value) => {
    setEditingField(key);
    setEditValue(value);
  };

  const handleFieldSave = (key) => {
    if (onDataChange) {
      onDataChange({ ...data, [key]: editValue });
    }
    setEditingField(null);
  };

  const getBackgroundStyle = () => {
    if (background === 'transparent') return { backgroundColor: 'transparent' };
    if (background === 'solid') return { backgroundColor };
    if (background === 'gradient') return {
      background: `linear-gradient(135deg, ${backgroundColor} 0%, #3b4cca 100%)`
    };
    return {};
  };

  return (
    <div className="flashcard-container">
      <div 
        ref={cardRef}
        className={`flashcard ${borderRadius ? 'rounded' : 'square'} font-${selectedFont}`}
        style={getBackgroundStyle()}
      >
        {data && Object.entries(data).map(([key, value]) => (
          <div key={key} className="flashcard-field">
            {editingField === key ? (
              <div className="field-edit">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                  className="field-edit-input"
                />
                <div className="field-edit-buttons">
                  <button onClick={() => handleFieldSave(key)}>✓</button>
                  <button onClick={() => setEditingField(null)}>✕</button>
                </div>
              </div>
            ) : (
              <div 
                className="field-content"
                onClick={() => handleFieldClick(key, value)}
                title="Click to edit"
              >
                <span className="field-label">{key}:</span>
                <span className="field-value">{value}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <button 
        onClick={handleExportPNG} 
        disabled={isExporting}
        className="export-btn"
      >
        {isExporting ? 'Exporting...' : t('export_png')}
      </button>
    </div>
  );
};

export default BaseFlashcard;
