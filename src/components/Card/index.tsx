import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Card} from '../../types';
import {useTranslation} from 'react-i18next';

interface CardItemProps {
  card: Card;
  isSelected: boolean;
  onSelect: (card: Card) => void;
  theme: 'light' | 'dark';
}

function getStyles(theme: 'light' | 'dark') {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    card: {
      width: 90,
      height: 110,
      margin: 8,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#121212' : '#ffffff',
      borderWidth: 2,
      borderColor: isDark ? '#26a69a' : '#009688',
      elevation: 5,
    },
    selectedCard: {
      backgroundColor: isDark ? '#424242' : '#ffeb3b',
      borderColor: isDark ? '#616161' : '#ff9800',
    },
    cardText: {
      fontSize: 12,
      textAlign: 'center',
      color: isDark ? '#ffffff' : '#333',
    },
  });
}

const CardItem: React.FC<CardItemProps> = ({
  card,
  isSelected,
  onSelect,
  theme,
}) => {
  const {t} = useTranslation();
  const styles = getStyles(theme);
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]}
      onPress={() => onSelect(card)}>
      <Text style={styles.cardText}>{t(card.title)}</Text>
    </TouchableOpacity>
  );
};

export default CardItem;
