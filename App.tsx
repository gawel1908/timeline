// App.tsx
import './src/i18n';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HowToPlayScreen from './src/screens/HowToPlayScreen';
import RegisterScreen from './src/screens/RegisterScreen'; // Dodaj ten ekran
import {AppSettingsProvider} from './src/context/AppSettingsContext';
import {PlayerProvider} from './src/context/PlayerContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AchievementsScreen from './src/screens/AchievementsScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  const [isNameSet, setIsNameSet] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPlayerName = async () => {
      const name = await AsyncStorage.getItem('playerName');
      setIsNameSet(!!name); // Ustaw true, jeśli imię istnieje
    };
    checkPlayerName();
  }, []);

  if (isNameSet === null) {
    // Wyświetl ekran ładowania (możesz tu dodać spinner lub placeholder)
    return null;
  }

  return (
    <AppSettingsProvider>
      <PlayerProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={isNameSet ? 'Home' : 'SetPlayerName'} // Jeśli imię nie ustawione, pokaż ekran ustawiania imienia
          >
            <Stack.Screen
              name="SetPlayerName"
              component={RegisterScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="GameScreen"
              component={GameScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AchievementsScreen"
              component={AchievementsScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SettingsScreen"
              component={SettingsScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="HowToPlayScreen"
              component={HowToPlayScreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PlayerProvider>
    </AppSettingsProvider>
  );
};

export default App;
