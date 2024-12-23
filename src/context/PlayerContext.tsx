import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Player = {
  name: string;
  level: number;
  totalScore: number;
  achievements: string[];
};

type PlayerContextType = {
  player: Player;
  levelUp: () => void;
  setPlayerName: (name: string) => Promise<void>;
  saveScore: (score: number) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [player, setProgress] = useState<Player>({
    name: '',
    level: 1,
    totalScore: 0,
    achievements: [],
  });

  async function loadPlayerName() {
    const storedName = await AsyncStorage.getItem('playerName');
    const storedLevel = (await AsyncStorage.getItem('playerLevel')) || '1';
    const storedScore = (await AsyncStorage.getItem('playerScore')) || '0';
    if (storedName) {
      setProgress(prev => ({
        ...prev,
        name: storedName,
        level: Number(storedLevel),
        totalScore: Number(storedScore),
      }));
    }
  }

  async function levelUp() {
    await AsyncStorage.setItem('playerLevel', (player.level + 1).toString());
    setProgress(prev => ({...prev, level: prev.level + 1}));
  }

  async function setPlayerName(name: string) {
    await AsyncStorage.setItem('playerName', name);
    setProgress(prev => ({...prev, name}));
  }

  async function saveScore(score: number) {
    await AsyncStorage.setItem(
      'playerScore',
      (player.totalScore + score).toString(),
    );
    setProgress(prev => ({...prev, totalScore: prev.totalScore + score}));
  }

  useEffect(() => {
    loadPlayerName();
  }, []);

  return (
    <PlayerContext.Provider value={{player, levelUp, setPlayerName, saveScore}}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
