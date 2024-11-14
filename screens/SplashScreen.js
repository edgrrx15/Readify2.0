import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Home');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className='flex-1 justify-center items-center bg-neutral-50'>
      <Text className='absolute text-3xl text-color-negro text-center items-center font-bold tracking-widest'>Booksite</Text>
    </View>
  );
};

export default SplashScreen;
