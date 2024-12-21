import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {cards} from '../../data/cards';
import {Card, CardPlaceholder} from '../../types';
import {useTranslation} from 'react-i18next';
import CardItem from '../../components/Card';
import {useAppSettingsContext} from '../../context/AppSettingsContext';
import {usePlayer} from '../../context/PlayerContext';

function getStyles(theme: 'light' | 'dark') {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDark ? '#121212' : '#f8f8f8', // Tło zależne od motywu
      justifyContent: 'flex-start',
    },
    header: {
      fontSize: 20,
      fontWeight: '700',
      textAlign: 'center',
      color: isDark ? '#ffffff' : '#333', // Kolor nagłówka
      marginBottom: 10,
    },
    score: {
      fontSize: 18,
      fontWeight: '700',
      textAlign: 'center',
      color: isDark ? '#81c784' : '#4caf50', // Kolor punktacji
      marginBottom: 10,
    },
    subHeader: {
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      color: isDark ? '#bbbbbb' : '#555', // Kolor podnagłówka
      marginVertical: 10,
    },
    timeline: {
      flexDirection: 'column',
      justifyContent: 'center',
      marginBottom: 20,
      padding: 10,
      borderWidth: 2,
      borderColor: isDark ? '#26a69a' : '#00796b', // Obramowanie zależne od motywu
      borderRadius: 10,
      backgroundColor: isDark ? '#004d40' : '#e0f2f1', // Tło osi czasu
    },
    placeholder: {
      height: 30,
      marginVertical: 6,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: isDark ? '#616161' : '#ccc', // Obramowanie zależne od motywu
      backgroundColor: isDark ? '#424242' : '#eaeaea', // Tło placeholdera
      elevation: 3,
    },
    emptyPlaceholder: {
      backgroundColor: isDark ? '#37474f' : '#b0bec5', // Puste miejsce
      borderColor: isDark ? '#546e7a' : '#90a4ae',
    },
    occupiedPlaceholder: {
      backgroundColor: isDark ? '#33691e' : '#dcedc8', // Zajęte miejsce
      borderColor: isDark ? '#689f38' : '#8bc34a',
    },
    cardsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: 10,
    },
    resetButton: {
      backgroundColor: isDark ? '#d32f2f' : '#f44336', // Kolor przycisku reset
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 15,
      alignSelf: 'center',
    },
    resetButtonText: {
      color: isDark ? '#ffffff' : '#fff', // Kolor tekstu przycisku reset
      fontSize: 18,
      fontWeight: '600',
    },
    backButton: {
      marginTop: 30,
      backgroundColor: isDark ? '#1e88e5' : '#3498db', // Kolor przycisku powrotu
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
    },
    backButtonText: {
      color: isDark ? '#ffffff' : '#fff', // Kolor tekstu przycisku powrotu
      fontSize: 16,
      fontWeight: 'bold',
    },
    cardText: {
      fontSize: 12,
      textAlign: 'center',
      color: isDark ? '#e0e0e0' : '#333', // Kolor tekstu na kartach
    },
  });
}

const GameScreen = ({navigation}: any) => {
  const {settings} = useAppSettingsContext();
  const {player, addExperience} = usePlayer();
  const styles = getStyles(settings.theme);
  const {t} = useTranslation();
  const sortedCards = useMemo(() => {
    return [...cards].sort((a, b) => a.value - b.value);
  }, [cards]);
  const sixCards = useMemo(() => sortedCards.slice(0, 6), [sortedCards]);

  const [shuffledCards, setShuffledCards] = useState<Card[]>([]);
  const [timeline, setTimeline] = useState<(Card | CardPlaceholder)[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setShuffledCards([...sixCards].sort(() => Math.random() - 0.5));
    const placeholders = sixCards.map(c => ({value: c.value}));
    setTimeline(placeholders);
    setSelectedCard(null);
    setScore(0);
  };

  const handleCardSelect = (card: Card) => {
    setSelectedCard(prev => (prev?.id === card.id ? null : card));
  };

  const handlePlaceholderClick = (index: number) => {
    if (!selectedCard) return;

    const newTimeline = [...timeline];
    const placeholder = newTimeline[index];

    if (selectedCard.value !== placeholder.value) {
      const newScore = score - 5;
      setScore(newScore); // Odejmujemy punkty za zły ruch
      if (newScore < 0) {
        Alert.alert('Koniec gry!', 'Twoje punkty spadły poniżej zera!', [
          {text: 'Nowa gra', onPress: resetGame},
          {text: 'Menu główne', onPress: backToMenu},
        ]);
      }
      return;
    }

    if (newTimeline[index] && 'title' in newTimeline[index]) return;

    newTimeline[index] = selectedCard;
    setShuffledCards(prev => prev.filter(c => c.id !== selectedCard.id));
    setTimeline(newTimeline);

    const newScore = score + 10;
    setScore(newScore); // Dodajemy punkty za dobry ruch
    setSelectedCard(null);

    checkForWin(newTimeline, newScore); // Przekazujemy nowy wynik
  };

  const checkForWin = (
    currentTimeline: (Card | CardPlaceholder)[],
    currentScore: number,
  ) => {
    const isCorrect = currentTimeline.every(
      (item, index) =>
        item &&
        'value' in item &&
        'title' in item &&
        item.title === sixCards[index].title,
    );

    if (isCorrect) {
      Alert.alert(
        'Gratulacje!',
        `Wygrałeś grę! Twój wynik to: ${currentScore} punktów.`,
        [
          {text: 'Nowa gra', onPress: resetGame},
          {text: 'Menu główne', onPress: backToMenu},
        ],
      );
    }
  };

  function backToMenu() {
    resetGame();
    navigation.navigate('Home');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('arrangeCards')}</Text>
      <Text style={styles.score}>
        {t('score')}: {score}
      </Text>
      <View style={styles.timeline}>
        {timeline.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.placeholder,
              'title' in card
                ? styles.occupiedPlaceholder
                : styles.emptyPlaceholder,
            ]}
            onPress={() => handlePlaceholderClick(index)}>
            <Text style={styles.cardText}>
              {'title' in card ? t(card.title) : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.subHeader}> {t('chooseCard')}:</Text>
      <View style={styles.cardsContainer}>
        {shuffledCards.map(card => (
          <CardItem
            key={card.id}
            card={card}
            isSelected={selectedCard?.id === card.id}
            onSelect={handleCardSelect}
            theme={settings.theme}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>{t('resetGame')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={backToMenu}>
        <Text style={styles.backButtonText}>{t('backToMenu')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GameScreen;
