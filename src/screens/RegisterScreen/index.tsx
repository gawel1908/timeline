import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {usePlayer} from '../../context/PlayerContext';
import {useAppSettingsContext} from '../../context/AppSettingsContext';
import {useTranslation} from 'react-i18next';

const RegisterScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {t} = useTranslation();

  const {settings} = useAppSettingsContext();
  const styles = getStyles(settings.theme);
  const {setPlayerName} = usePlayer();
  const [name, setName] = useState('');

  const handleSaveName = async () => {
    if (name.trim()) {
      await setPlayerName(name);
      navigation.replace('Home');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('welcome')}</Text>
      <Text style={styles.subHeader}>{t('registerHeader')}:</Text>
      <TextInput
        style={styles.input}
        placeholder={t('yourName')}
        value={name}
        onChangeText={setName}
        placeholderTextColor={settings.theme === 'dark' ? '#fff' : '#000'}
      />
      <TouchableOpacity style={styles.button} onPress={handleSaveName}>
        <Text style={styles.buttonText}>{t('continue')}</Text>
      </TouchableOpacity>
    </View>
  );
};

function getStyles(theme: 'light' | 'dark') {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: isDark ? '#333' : '#f8f8f8',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: isDark ? '#fff' : '#000',
    },
    subHeader: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
      color: isDark ? '#fff' : '#000',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      width: '80%',
      marginBottom: 15,
      color: isDark ? '#fff' : '#000',
    },
    button: {
      backgroundColor: isDark ? '#555' : '#3498db',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
}
export default RegisterScreen;
