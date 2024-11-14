import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Navbar() {
  const navigation = useNavigation();

  return (
    <View className="flex-row justify-around items-center space-x-8 mx-4 bg-black">
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <View className="flex items-center p-3 px-5">
          <Feather name="home" size={24} color="#f2f5f3" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Search')}>
        <View className="flex items-center p-3 px-5">
          <Feather name="search" size={24} color="#f2f5f3" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
        <View className="flex items-center p-3 px-5">
          <FontAwesome5 name="user" size={24} color="#f2f5f3" />
        </View>
      </TouchableOpacity>
    </View>
  );
}
