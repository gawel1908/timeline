import i18n from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type SettingsProviderProps = {
  children: ReactNode;
};

interface AppSettings {
  theme: 'light' | 'dark';
  language: string;
  difficultyLevel: 'easy' | 'medium' | 'hard';
}

// Typ kontekstu
interface AppSettingsContextType {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  changeLanguage: (newLanguage: 'en' | 'pl') => void;
  saveSettingsToStorage: () => Promise<void>;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(
  undefined,
);

export const AppSettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    language: 'en',
    difficultyLevel: 'easy',
  });

  // Funkcja do zapisywania ustawień w AsyncStorage
  const saveSettingsToStorage = async () => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to storage:', error);
    }
  };

  // Funkcja do wczytywania ustawień z AsyncStorage
  const loadSettingsFromStorage = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem('appSettings');
      if (storedSettings) {
        const parsedSettings: AppSettings = JSON.parse(storedSettings);
        setSettings(parsedSettings);
        i18n.changeLanguage(parsedSettings.language); // Zastosowanie języka
      }
    } catch (error) {
      console.error('Error loading settings from storage:', error);
    }
  };

  // Funkcja zmieniająca język i zapisująca ustawienia
  const changeLanguage = (newLanguage: 'en' | 'pl') => {
    i18n.changeLanguage(newLanguage); // Zmiana języka w i18n
    setSettings(prev => ({...prev, language: newLanguage}));
  };

  // Ładowanie ustawień przy pierwszym uruchomieniu
  useEffect(() => {
    loadSettingsFromStorage();
  }, []);

  // Zapis ustawień przy każdej ich zmianie
  useEffect(() => {
    saveSettingsToStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  return (
    <AppSettingsContext.Provider
      value={{settings, setSettings, changeLanguage, saveSettingsToStorage}}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettingsContext = (): AppSettingsContextType => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error(
      'useAppSettingsContext must be used within an AppSettingsProvider',
    );
  }
  return context;
};
