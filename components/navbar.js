import React from 'react';
import { TouchableOpacity, View, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Navbar() {
  const navigation = useNavigation();

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        borderRadius: 30,
        overflow: 'hidden',
        elevation: 5, // sombra en Android
        shadowColor: '#000', // sombra en iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      }}
    >
      <BlurView
        tint={Platform.OS === 'ios' ? 'light' : 'dark'}
        intensity={50}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingVertical: 14,
          paddingHorizontal: 24,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Feather name="home" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Feather name="search" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
          <FontAwesome5 name="user" size={22} color="#fff" />
        </TouchableOpacity>
      </BlurView>
    </SafeAreaView>
  );
}
