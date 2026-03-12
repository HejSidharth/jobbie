import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilityContextType {
  fontSize: number;
  contrast: 'normal' | 'high';
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  toggleContrast: () => void;
  resetAccessibility: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEYS = {
  FONT_SIZE: 'portfolio-font-size',
  CONTRAST: 'portfolio-contrast',
};

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FONT_SIZE);
    if (saved) {
      const parsed = parseInt(saved, 10);
      return isNaN(parsed) ? 100 : parsed;
    }
    return 100;
  });
  const [contrast, setContrast] = useState<'normal' | 'high'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTRAST);
    return (saved === 'high' || saved === 'normal') ? saved : 'normal';
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    if (contrast === 'high') {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem(STORAGE_KEYS.CONTRAST, contrast);
  }, [contrast]);

  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 10, 150));
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 10, 80));
  const toggleContrast = () => setContrast((prev) => (prev === 'normal' ? 'high' : 'normal'));
  const resetAccessibility = () => {
    setFontSize(100);
    setContrast('normal');
  };

  return (
    <AccessibilityContext.Provider 
      value={{ 
        fontSize, 
        contrast, 
        increaseFontSize, 
        decreaseFontSize, 
        toggleContrast, 
        resetAccessibility 
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
