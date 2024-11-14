import { ScrollView, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Navbar from '../components/navbar';

export default function MenuScreen() {
  const navigation = useNavigation();
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className='bg-neutral-100 pt-12'>
      <TouchableOpacity onPress={() => navigation.goBack()} className="rounded-xl p-1 mb-5 m-4">
        <Feather name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <View className='bg-white p-4 rounded-xl m-4 border border-gray-600'>
        <TouchableOpacity onPress={() => navigation.navigate('Favorite')} className='flex items-center'>
          <AntDesign name="hearto" size={24} color="#000"/>
          <Text className='text-lg text-black font-semibold ml-2'>Mis libros favoritos</Text>
        </TouchableOpacity>
      </View>

      <View className='bg-white p-4 rounded-xl m-4 border border-gray-600'>
        <TouchableOpacity onPress={() => navigation.navigate('History')} className='flex items-center'>
          <MaterialIcons name="history" size={30} color="#000" />
          <Text className='text-lg text-black font-semibold ml-2'>Visto recientemente</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}
