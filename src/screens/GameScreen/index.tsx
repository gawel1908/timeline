import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Card, CardPlaceholder} from '../../types';
import {useTranslation} from 'react-i18next';
import CardItem from '../../components/Card';
import {useAppSettingsContext} from '../../context/AppSettingsContext';
import {usePlayer} from '../../context/PlayerContext';
import {getCards} from '../../utils';

const GameScreen = ({navigation}: any) => {
  const {settings} = useAppSettingsContext();
  const {player, levelUp, saveScore} = usePlayer();
  const {level} = player;
  const styles = getStyles(settings.theme);
  const {t} = useTranslation();
  const [isMoreThanTenLevels, setIsMoreThanTenLevels] = useState(false);

  const [cards, setCards] = useState<Card[]>([]);
  const [timeline, setTimeline] = useState<(Card | CardPlaceholder)[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetGame() {
    if (level > 10) {
      setIsMoreThanTenLevels(true);
    }
    const chosenCards = getCards(level);
    const newSortedCards = [...chosenCards].sort((a, b) => a.value - b.value);
    setCards(chosenCards);
    const placeholders = newSortedCards.map(c => ({value: c.value}));
    setTimeline(placeholders);
    setSelectedCard(null);
    setScore(0);
  }
  function handleCardSelect(card: Card) {
    setSelectedCard(prev => (prev?.id === card.id ? null : card));
  }

  function handlePlaceholderClick(index: number) {
    if (!selectedCard) {
      return;
    }

    const newTimeline = [...timeline];
    const placeholder = newTimeline[index];

    if (selectedCard.value !== placeholder.value) {
      const newScore = score - 5;
      setScore(newScore);
      if (newScore < 0) {
        Alert.alert('Koniec gry!', 'Twoje punkty spadły poniżej zera!', [
          {text: 'Nowa gra', onPress: resetGame},
          {text: 'Menu główne', onPress: backToMenu},
        ]);
      }
      return;
    }

    if (newTimeline[index] && 'title' in newTimeline[index]) {
      return;
    }

    newTimeline[index] = selectedCard;
    setCards(prev => prev.filter(c => c.id !== selectedCard.id));
    setTimeline(newTimeline);

    const newScore = score + 10;
    setScore(newScore); // Dodajemy punkty za dobry ruch
    setSelectedCard(null);

    checkForWin(newScore); // Przekazujemy nowy wynik
  }

  function checkForWin(currentScore: number) {
    if (cards.length === 1) {
      levelUp();
      saveScore(currentScore);
      Alert.alert(
        'Gratulacje!',
        `Wygrałeś grę! Twój wynik to: ${currentScore} punktów.`,
        [
          {text: 'Graj dalej', onPress: resetGame},
          {text: 'Menu główne', onPress: backToMenu},
        ],
      );
    }
  }

  function backToMenu() {
    resetGame();
    navigation.navigate('Home');
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>
          {t('level')}: {level}
        </Text>
        <Text style={styles.score}>
          {t('score')}: {score}
        </Text>
      </View>

      <View style={styles.timeline}>
        {timeline.map((card, index) => {
          const year = isMoreThanTenLevels ? '' : card.value;
          return (
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
                {'title' in card ? t(card.title) : year}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.subHeader}> {t('chooseCard')}:</Text>
      <View style={styles.cardsContainer}>
        {cards.map(card => (
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
        <Text style={styles.resetButtonText}>{t('reset')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={backToMenu}>
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
      backgroundColor: isDark ? '#121212' : '#f8f8f8', // Tło zależne od motywu
      justifyContent: 'flex-start',
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: 10,
    },
    header: {
      fontSize: 20,
      fontWeight: '700',
      textAlign: 'center',
      color: isDark ? '#ffffff' : '#333', // Kolor nagłówka
    },
    score: {
      fontSize: 18,
      fontWeight: '700',
      textAlign: 'right',
      color: isDark ? '#81c784' : '#4caf50', // Kolor punktacji
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

export default GameScreen;
