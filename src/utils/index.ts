import {cards, additionalCards} from '../data/cards';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getCards(level: number) {
  const shuffled = shuffleArray(cards);
  const allCards = shuffleArray([...shuffled, ...additionalCards]);

  if (level < 30) {
    return shuffled.slice(0, 6);
  }

  if (level > 100) {
    return allCards.slice(0, 12);
  }

  if (level > 50) {
    return allCards.slice(0, 9);
  }

  if (level < 30) {
    return allCards.slice(0, 9);
  }

  return shuffled;
}
