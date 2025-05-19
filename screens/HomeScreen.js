import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Category from '../components/Category';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Search from '../components/SearchBotton'
import { Feather } from '@expo/vector-icons';
import Navbar from '../components/navbar'
import FavoriteList from '../components/FavoriteList';
import TrendingBooks from '../components/TrendingBooks';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const navigation = useNavigation();

    useEffect(() => {
        setCategories([
          'Filosofía',
          'Ciencia ficción',
          'Historia',
          'Biografías',
          'Fantasía',
          'Misterio',
          'Romance',
          'Aventura',
          'Literatura juvenil',
          'Infantil',
          'Matematicas',
        ]);
        setLoading(false); 
      }, []);

    return (
        <LinearGradient
        start={{ x: 0.6, y: 0.6 }}
        end={{ x: 1, y: -0.34 }}
        colors={['#000', '#26004a']}
        style={{ flex: 1 }}
      >
        <SafeAreaView className='flex-1 pt-12'>
            

            <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
                <Search/> 
                <TrendingBooks/>              
                <Category/>
                <FavoriteList/>
            </ScrollView>

        </SafeAreaView>
        </LinearGradient>
    );
}
