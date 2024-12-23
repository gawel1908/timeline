import React, {useState} from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useAppSettingsContext} from '../../context/AppSettingsContext';
import {useTranslation} from 'react-i18next';

const SettingsScreen = ({navigation}: any) => {
  const {settings, setSettings, changeLanguage, saveSettingsToStorage} =
    useAppSettingsContext();
  const {t} = useTranslation();
  const [isSoundEnabled, setSoundEnabled] = useState(true);

  const styles = getStyles(settings.theme);

  function handleChangeLanguage() {
    const nextLanguage = settings.language === 'en' ? 'pl' : 'en';
    changeLanguage(nextLanguage); // Zmiana języka w kontekście
  }

  function handleChangeTheme() {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  }

  async function handleSaveSettings() {
    try {
      await saveSettingsToStorage();
      Alert.alert(t('settingsSaved')); // Powiadomienie użytkownika o zapisaniu ustawień
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  function getThemeButtonStyles() {
    if (settings.theme === 'light') {
      return {
        backgroundColor: '#ffffff',
        color: '#333',
      };
    } else {
      return {
        backgroundColor: '#333',
        color: '#fff',
      };
    }
  }

  const themeButtonStyles = getThemeButtonStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('settings')}</Text>

      {/* Język */}
      <View style={styles.setting}>
        <Text style={styles.settingText}>{t('language')}</Text>
        <TouchableOpacity
          style={[styles.button, styles.languageButton]}
          onPress={handleChangeLanguage}>
          <Text style={[styles.buttonText, styles.languageButtonText]}>
            {settings.language === 'en' ? 'EN' : 'PL'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Motyw */}
      <View style={styles.setting}>
        <Text style={styles.settingText}>{t('gameTheme')}</Text>
        <TouchableOpacity
          style={[
            styles.button,
            styles.themeButton,
            {backgroundColor: themeButtonStyles.backgroundColor},
          ]}
          onPress={handleChangeTheme}>
          <Text style={[styles.buttonText, {color: themeButtonStyles.color}]}>
            {t(settings.theme)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Włącz/wyłącz dźwięki */}
      <View style={styles.setting}>
        <Text style={styles.settingText}>{t('enableSound')}</Text>
        <Switch
          value={isSoundEnabled}
          onValueChange={() => setSoundEnabled(!isSoundEnabled)}
        />
      </View>

      {/* Przycisk zapisu ustawień */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
        <Text style={styles.saveButtonText}>{t('saveSettings')}</Text>
      </TouchableOpacity>

      {/* Przycisk powrotu do menu głównego */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backButtonText}>{t('backToMenu')}</Text>
      </TouchableOpacity>
    </View>
  );
};

function getStyles(theme: 'light' | 'dark') {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDark ? '#333' : '#f8f8f8', // Tło zależne od motywu
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: isDark ? '#fff' : '#000', // Kolor nagłówka
    },
    setting: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 15,
    },
    settingText: {
      fontSize: 18,
      color: isDark ? '#ccc' : '#333', // Kolor tekstu opcji
    },
    button: {
      padding: 10,
      borderRadius: 5,
      width: 120,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#555' : '#ddd', // Kolor przycisków
    },
    buttonText: {
      fontSize: 16,
      textTransform: 'uppercase',
      textAlign: 'center',
      color: isDark ? '#fff' : '#000', // Kolor tekstu przycisku
    },
    languageButton: {
      backgroundColor: isDark ? '#4a90e2' : '#3498db', // Kolor przycisku języka
    },
    languageButtonText: {
      color: isDark ? '#fff' : '#fff',
    },
    saveButton: {
      marginTop: 30,
      backgroundColor: isDark ? '#555' : '#3498db', // Kolor przycisku zapisu
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
    },
    saveButtonText: {
      color: isDark ? '#fff' : '#fff', // Kolor tekstu na przycisku zapisu
      fontSize: 16,
      fontWeight: 'bold',
    },
    backButton: {
      marginTop: 10,
      backgroundColor: isDark ? '#444' : '#2c3e50', // Kolor przycisku powrotu
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
    },
    backButtonText: {
      color: isDark ? '#fff' : '#fff', // Kolor tekstu na przycisku powrotu
      fontSize: 16,
      fontWeight: 'bold',
    },
    switchTrack: {
      backgroundColor: isDark ? '#777' : '#ccc', // Tło przełącznika
    },
    switchThumb: {
      backgroundColor: isDark ? '#4CAF50' : '#f8f8f8', // Kolor kółka przełącznika
    },
    themeButton: {
      borderWidth: 1,
      borderColor: isDark ? '#777' : '#ccc',
    },
  });
}

export default SettingsScreen;
