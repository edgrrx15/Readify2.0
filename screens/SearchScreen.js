import React, { useState, useEffect, useRef } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback, Image, ScrollView, ActivityIndicator, Keyboard, Platform } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const searchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://openlibrary.org/search.json?q=${query}&limit=20`);
      setResults(response.data.docs || []);
      setSearchCompleted(true);
    } catch (error) {
      console.error('Error al buscar libros:', error);
    } finally {
      setLoading(false);
    }
    Keyboard.dismiss();
  };

  const handleClick = async (item) => {
    navigation.navigate('Book', { book: item });
    let history = await AsyncStorage.getItem('recentlyViewedBooks');
    history = history ? JSON.parse(history) : [];
    if (!history.find(book => book.key === item.key)) {
      history.push(item);
      await AsyncStorage.setItem('recentlyViewedBooks', JSON.stringify(history));
    }
  };

  const inputRef = useRef(null);

  return (

    
    <ScrollView className="bg-neutral-50 flex-1 text-black pt-16">
      <View className="mx-4 mb-3 flex-row justify-between items-center border border-neutral-200 rounded-full bg-white">
        <TextInput
          ref={inputRef}
          placeholder="Buscar libro..."
          className="flex-1 text-gray-700 placeholder-gray-400 focus:outline-none pl-4"
          value={query}
          onChangeText={(text) => setQuery(text)}
          onSubmitEditing={searchBooks}
        />
        <TouchableOpacity onPress={searchBooks} className="rounded-full p-3 m-1">
          <AntDesign name="search1" size={24} color="#0B1215" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('IaScreen')} className="mx-4 mb-3">
      <View className="pl-4 p-6 border flex-row justify-between rounded-full bg-black">
        <MaskedView
          maskElement={
            <View className="flex">
              <Text className="text-xl font-extrabold">
                Descubre libros con IA.
              </Text>
            </View>
          }
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={['#A2C2E1', '#A7D3B4', '#B7C9D6']}
            >
            <Text className="text-2xl font-extrabold pl-3 opacity-0 tex">
              Descubre libros con IA.
            </Text>
          </LinearGradient>
        </MaskedView>
        <AntDesign name="search1" size={24} color="#fff" />
      </View>
    </TouchableOpacity>

      



      
      {loading ? (

        
        <View>
          <Text className="text-black ml-5">Buscando <Text className="font-bold">"{query}"</Text>...</Text>
          <ActivityIndicator size="large" color="#e8c34d" className="object-center w-96 h-96 text-9xl" />
        </View>
      ) : searchCompleted && results.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 15 }} className="space-y-3">
          <Text className="text-black font-extrabold ml-1">Resultados ({results.length})</Text>
          <View className="flex flex-row flex-wrap justify-between mb-6">
            {results.map((item, index) => (
              <TouchableWithoutFeedback key={index} onPress={() => handleClick(item)}>
                <View className="w-1/2 mb-4 px-2">
                  <View className="rounded-lg overflow-hidden border border-neutral-300">
                    <Image
                      source={item.cover_i ? { uri: `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg` } : require('../assets/no-cover.jpg')}
                      style={{ width: '100%', height: 230, resizeMode: 'cover' }}
                      className="rounded-lg"
                    />
                  </View>
                  <Text className="text-neutral-500 ml-1 mt-2 font-bold" style={{ fontSize: Platform.OS === 'ios' ? 14 : 16 }}>
                    {item.title && item.title.length > 24 ? item.title.slice(0, 24) + '...' : item.title}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View>
          <Text className="text-center text-gray-500 mt-4">No se encontraron resultados.</Text>
        </View>
      )}
    </ScrollView>
  );
}
