import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Player {
  name: string;
  experience: number;
  level: number;
  unlockedAddons: string[];
}

interface PlayerContextType {
  player: Player;
  addExperience: (xp: number) => void;
  setPlayerName: (name: string) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [player, setProgress] = useState<Player>({
    name: '',
    experience: 0,
    level: 1,
    unlockedAddons: [],
  });

  // Odczytaj nazwę gracza z AsyncStorage podczas uruchamiania aplikacji
  useEffect(() => {
    const loadPlayerName = async () => {
      const storedName = await AsyncStorage.getItem('playerName');
      if (storedName) {
        setProgress(prev => ({...prev, name: storedName}));
      }
    };
    loadPlayerName();
  }, []);

  const addExperience = (xp: number) => {
    setProgress(prev => {
      const newExperience = prev.experience + xp;
      const xpForNextLevel = calculateXPForNextLevel(prev.level);

      if (newExperience >= xpForNextLevel) {
        return {
          ...prev,
          experience: newExperience - xpForNextLevel,
          level: prev.level + 1,
          unlockedAddons: unlockAddon(prev.level + 1, prev.unlockedAddons),
        };
      }

      return {...prev, experience: newExperience};
    });
  };

  const setPlayerName = async (name: string) => {
    await AsyncStorage.setItem('playerName', name);
    setProgress(prev => ({...prev, name}));
  };

  const unlockAddon = (level: number, unlockedAddons: string[]) => {
    const addonsToUnlock: Record<number, string> = {
      2: 'New Avatar',
      5: 'Special Card Skin',
      10: 'Bonus Feature',
    };

    const newAddon = addonsToUnlock[level];
    return newAddon ? [...unlockedAddons, newAddon] : unlockedAddons;
  };

  const calculateXPForNextLevel = (level: number): number => {
    return 100 + level * 50;
  };

  return (
    <PlayerContext.Provider value={{player, addExperience, setPlayerName}}>
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
