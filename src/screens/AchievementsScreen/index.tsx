import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {usePlayer} from '../../context/PlayerContext';
import {useAppSettingsContext} from '../../context/AppSettingsContext';
import {useTranslation} from 'react-i18next';

const AchievementsScreen: React.FC = ({navigation}: any) => {
  const {t} = useTranslation();
  const {settings} = useAppSettingsContext();
  const {player, setPlayerName} = usePlayer(); // Pobieramy dane o graczu i funkcję zmiany imienia
  const [newName, setNewName] = useState<string>(player.name); // Pole do edycji imienia
  const [isSaving, setIsSaving] = useState(false);

  const styles = getStyles(settings.theme);

  const handleNameChange = async () => {
    if (newName.trim().length === 0) {
      Alert.alert('Invalid Name', 'Name cannot be empty.');
      return;
    }
    setIsSaving(true);
    try {
      await setPlayerName(newName);
      Alert.alert('Success', 'Your name has been updated!');
    } catch (error) {
      Alert.alert('Error', 'There was an error updating your name.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackToMenu = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('playerProfile')}</Text>

      {/* Informacje o graczu */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>{t('name')}: </Text>
        <Text style={styles.value}>{player.name}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>{t('level')}: </Text>
        <Text style={styles.value}>{player.level}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>{t('score')}: </Text>
        <Text style={styles.value}>{player.totalScore}</Text>
      </View>

      {/* Pole do edycji imienia */}
      <Text style={styles.subHeader}>{t('changeName')}</Text>
      <TextInput
        style={styles.input}
        value={newName}
        onChangeText={setNewName}
        placeholder={t('yourName')}
        placeholderTextColor={settings.theme === 'dark' ? '#fff' : '#000'}
      />
      <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={handleNameChange}
        disabled={isSaving}>
        <Text style={styles.saveButtonText}>{t('save')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={handleBackToMenu}>
        <Text style={styles.backButtonText}>{t('backToMenu')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme: 'light' | 'dark') => {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDark ? '#121212' : '#f8f8f8',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: isDark ? '#fff' : '#000',
    },
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    label: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#ddd' : '#333',
    },
    value: {
      fontSize: 18,
      color: isDark ? '#ccc' : '#555',
    },
    subHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
      color: isDark ? '#4caf50' : '#007BFF',
    },
    input: {
      borderWidth: 1,
      borderColor: isDark ? '#555' : '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
      fontSize: 16,
      backgroundColor: isDark ? '#1e1e1e' : '#fff',
      color: isDark ? '#fff' : '#000',
    },
    saveButton: {
      backgroundColor: isDark ? '#4caf50' : '#007BFF',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    saveButtonDisabled: {
      backgroundColor: isDark ? '#777' : '#ccc',
    },
    backButton: {
      marginTop: 20,
      backgroundColor: isDark ? '#555' : '#3498db',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      width: '100%',
    },
    backButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
};

export default AchievementsScreen;
