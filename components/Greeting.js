import React from 'react';
import { Text } from 'react-native';

const Greeting = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    let greeting;

    if (hour >= 5 && hour < 12) {
      greeting = '¡Buen día!';
    } else if (hour >= 12 && hour < 19) {
      greeting = '¡Buenas tardes!';
    } else {
      greeting = '¡Buenas noches!';
    }

    return greeting;
  };

  return (
    <Text className='font-bold text-3xl text-orange-400  items-center text-center'>
    {getGreeting()}
  </Text>
  );
};

export default Greeting;
