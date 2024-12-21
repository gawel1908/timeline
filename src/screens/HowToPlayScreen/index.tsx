// screens/HowToPlayScreen.tsx
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useAppSettingsContext} from '../../context/AppSettingsContext';

const HowToPlayScreen = ({navigation}: any) => {
  const {settings} = useAppSettingsContext();
  const styles = getStyles(settings.theme);
  const {t} = useTranslation();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('howToPlay')}</Text>

      <Text style={styles.instructions}>{t('howToPlayInstructionsTitle')}</Text>

      <Text style={styles.listItem}>{t('howToPlayInstructions1')}</Text>
      <Text style={styles.listItem}>{t('howToPlayInstructions2')}</Text>
      <Text style={styles.listItem}>{t('howToPlayInstructions3')}</Text>
      <Text style={styles.listItem}>{t('howToPlayInstructions4')}</Text>
      <Text style={styles.listItem}>{t('howToPlayInstructions5')}</Text>

      <View style={styles.imageContainer}>
        {/* <Image
          source={require('../assets/how-to-play-image.png')} // Przykładowy obrazek
          style={styles.image}
        /> */}
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backButtonText}>{t('backToMenu')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

function getStyles(theme: 'light' | 'dark') {
  const isDark = theme === 'dark';

  return StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: isDark ? '#333' : '#f8f8f8',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 20,
      color: isDark ? '#fff' : '#2c3e50',
    },
    instructions: {
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 20,
      color: isDark ? '#ccc' : '#333',
    },
    listItem: {
      fontSize: 16,
      marginVertical: 10,
      textAlign: 'left',
      width: '100%',
      paddingLeft: 10,
      color: isDark ? '#ccc' : '#333',
    },
    imageContainer: {
      marginVertical: 30,
      alignItems: 'center',
    },
    image: {
      width: 300,
      height: 200,
      resizeMode: 'contain',
    },
    backButton: {
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
}

export default HowToPlayScreen;
