import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import History from '../components/RecentlyViewedBooks'
import React, { useState } from 'react';


export default function HistoryScreen() {
  const navigation = useNavigation();

  return (
    
    <View className='flex-1 pt-10  bg-neutral-100'>
      <TouchableOpacity onPress={() => navigation.goBack()} className="rounded-xl p-1 mb-5 m-4 ">
          <Feather name="arrow-left" size={24} color="#0B1215" />
      </TouchableOpacity>
      <History title='Mi historial'/>
    </View>
  )
}