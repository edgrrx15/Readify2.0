import { NavigationContainer } from '@react-navigation/native'
import HomeScreen from '../screens/HomeScreen'
import BookScreen from '../screens/BookScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SearchScreen from '../screens/SearchScreen';
import MenuScreen from '../screens/MenuScreen'
import FavoriteScreen from '../screens/FavoriteScreen'
import HistoryScreen from '../screens/HistoryScreen' 
import SplashScreen from '../screens/SplashScreen'
import { useEffect, useState } from 'react';

const Stack = createNativeStackNavigator(); 
export default function appNavigation() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Book" component={BookScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Menu" component={MenuScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Favorite" component={FavoriteScreen} options={{ headerShown: false }} />
          <Stack.Screen name="History" component={HistoryScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  )
}
