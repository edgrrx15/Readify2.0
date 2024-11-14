import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view'

const ejemplos = [
    "Mejores libros para estudiar", 
    "Libros recomendados para 2024",
    "Libros clásicos imperdibles",
    "Libros sobre desarrollo personal", 
    "Mejores libros de ciencia ficción",
    "Libros sobre historia mundial", 
    "Mejores libros de terror", 
    "Libros sobre emprendimiento",
    "Libros para mejorar la productividad",
    "Libros de fantasía épica",
    "Libros para aprender programación",
    "Libros sobre emprendimiento",
    "Libros para mejorar la productividad",
    "Libros de fantasía épica",
    "Libros sobre emprendimiento",
];


const PromptChat = () => {
  return (
    <ScrollView className='flex-1'>

<LinearGradient
                  start={{ x: 0.6, y: 0.6 }}
                  end={{ x: 1, y: -1.2 }}
        colors={['#000', '#413194']}
        style={{ flex: 1, padding: 20 }}
      >
<View className='px-4 pt-16'>
<MaskedView
          maskElement={
            <View className="flex">
                 <Text className=' text-6xl font-bold'>Encuentra tu siguiente aventura literaria con la ayuda de la IA.</Text>
            </View>}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={['#42ffd9', '#9b5bc9', '#b4ed9d']}
            >
            <Text className='opacity-0 text-6xl font-bold'>Encuentra tu siguiente aventura literaria con la ayuda de la IA.</Text>
          </LinearGradient>
        </MaskedView>
        <TextInput
            placeholder='Busca tu libro...'
            className='bg-transparent w-full p-2.5 rounded-2xl mt-12 border-blue-200 border-2 text-white'
            placeholderTextColor={'#fff'}
        />

        <View className='w-[300px] mt-12 mb-16'>
            {ejemplos.map((ejemplo, index) =>(
                <TouchableOpacity key={index} className="mb-4"> 
                    <Text className="text-white text-lg text-center  p-3 rounded-full border-neutral-50 border-2">{ejemplo}</Text>
                 </TouchableOpacity>
            ))}
        </View>
</View>

        </LinearGradient>
    </ScrollView>
  )
}

export default PromptChat