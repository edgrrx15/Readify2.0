import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function navbar(){

    const navigation = useNavigation();

    return (

           <View className="flex-row justify-around items-center py-4 bg-nav">
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <View className="flex items-center">
                        <Ionicons name="home-outline" size={20} color="#FFA500" />
                        <Text className="text-orange-400 text-lg">Inicio</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                    <View className="flex items-center">
                    <Feather name="search" size={20} color="#707070" />
                        <Text className="text-color-negro text-lg">Buscar</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Favorite')}>
                    <View className="flex items-center">
                        <AntDesign name="hearto" size={21} color="#707070" />
                        <Text className="text-color-negro text-lg">Favoritos</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('History')}>
                    <View className="flex items-center">
                        <MaterialIcons name="history" size={24} color="#707070" />
                        <Text className="text-color-negro text-lg">Historial</Text>
                    </View>
                </TouchableOpacity>
            </View>
    )
}


