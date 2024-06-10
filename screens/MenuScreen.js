import { ScrollView, Text, View, TouchableOpacity} from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';


export default function MenuScreen() {
  

  const navigation = useNavigation();
  return (
    <ScrollView className='pt-10  flex-1 bg-gray-900 mb-30 '>
      <TouchableOpacity onPress={() => navigation.goBack()} className="rounded-xl p-1 mb-5 m-4 ">
          <Feather name="arrow-left" size={24} color="#E6FFFD" />
      </TouchableOpacity>

      <View className='bg-gray-800  p-4 rounded-xl m-4 border border-gray-600'>
        <TouchableOpacity  onPress={() => navigation.navigate('Favorite')} className='flex items-center'>
          <AntDesign name= "hearto"  size={24} color= "#E6FFFD"/>
          <Text className='text-lg text-color-blanco font-semibold ml-2'>Mis libros favoritos</Text>
        </TouchableOpacity>
      </View>

      <View className='bg-gray-800  p-4 rounded-xl m-4 border border-gray-600'>
        <TouchableOpacity  onPress={() => navigation.navigate('History')} className='flex items-center'>
            <MaterialIcons name="history" size={30} color="#E6FFFD" />
            <Text className='text-lg text-color-blanco font-semibold ml-2'>Visto recientemente</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  )
}
