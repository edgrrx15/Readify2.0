import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Favorite from '../components/favouriteBooks'
import React from 'react'

export default function FavoriteScreen() {
  const navigation = useNavigation();
  return (
    <View className='flex-1 pt-10  bg-color-blanco'>
      <TouchableOpacity onPress={() => navigation.goBack()} className="rounded-xl p-1 mb-5 m-4 ">
          <Feather name="arrow-left" size={24} color="#0B1215" />
      </TouchableOpacity>
      <Favorite title='Mis libros favoritos'/>
    </View>

    


  )
}