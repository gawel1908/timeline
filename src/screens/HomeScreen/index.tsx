import React from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useAppSettingsContext} from '../../context/AppSettingsContext';
import {usePlayer} from '../../context/PlayerContext';

const HomeScreen = ({navigation}: {navigation: any}) => {
  const {settings} = useAppSettingsContext();
  const {player} = usePlayer();
  const {t} = useTranslation();
  const styles = getStyles(settings.theme);
  return (
    <View style={styles.container}>
      {/* Tytuł gry */}
      <Text style={styles.title}>
        {t('startGameWelcome')} {player.name}!
      </Text>
      {/* <Image
        source={require('../../assets/cards.png')} // Wstaw obrazek np. talii kart
        style={styles.image}
      /> */}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('GameScreen')}>
        <Text style={styles.buttonText}>{t('startGame')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AchievementsScreen')}>
        <Text style={styles.buttonText}>{t('achievements')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('HowToPlayScreen')}>
        <Text style={styles.buttonText}>{t('howToPlay')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SettingsScreen')}>
        <Text style={styles.buttonText}>{t('settings')}</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Created by Gawel</Text>
        <Text style={styles.footerText}>v1.0.0</Text>
      </View>
    </View>
  );
};

function getStyles(theme: 'light' | 'dark') {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#333' : '#f8f8f8',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 26,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 20,
      color: isDark ? '#ffffff' : '#2c3e50',
    },
    image: {
      width: 200,
      height: 150,
      resizeMode: 'contain',
      marginBottom: 30,
    },
    button: {
      backgroundColor: isDark ? '#555' : '#3498db',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
      marginVertical: 10,
      width: '80%',
      alignItems: 'center',
      shadowColor: isDark ? '#000' : '#333',
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#ffffff', // Biały tekst na przycisku
    },
    footer: {
      marginTop: 30,
      alignItems: 'center',
      position: 'absolute',
      bottom: 10,
    },
    footerText: {
      fontSize: 8,
      color: isDark ? '#ccc' : '#333',
      marginTop: 2,
    },
  });
}

export default HomeScreen;
