import React, { useState, useEffect, useRef } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback, Image, ScrollView, ActivityIndicator, Keyboard, Platform} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';

export default function SearchScreen() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation();

  const searchBooks = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`
      );
      setResults(response.data.items || [])
      setSearchCompleted(true)
    } catch (error) {
      console.error('Error al buscar libros:', error)
    } finally {
      setLoading(false); 
    }
    Keyboard.dismiss();
  }

    const handleClick = async (item) => {
    navigation.navigate('Book', { book: item });
    let history = await AsyncStorage.getItem('recentlyViewedBooks');
    history = history ? JSON.parse(history) : [];
    if (!history.find(book => book.id === item.id)) {
      history.push(item);
      await AsyncStorage.setItem('recentlyViewedBooks', JSON.stringify(history));
    }
  }

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  return (
    <SafeAreaView className="bg-color-blanco flex-1 text-color-negro pt-14" >
      <View
        className="mx-4 mb-3 flex-row justify-between items-center border border-neutral-200 rounded-full bg-input"
      >
         <TouchableOpacity onPress={() => navigation.goBack()} className="rounded-xl ml-5">
          <Feather name="arrow-left" size={24} color="#0B1215" />
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          placeholder="Buscar libro"
          className="flex-1 text-gray-700 placeholder-gray-400 focus:outline-none pl-4"
          value={query}
          onChangeText={(text) => setQuery(text)}
          onSubmitEditing={searchBooks}
        />
        <TouchableOpacity
          onPress={searchBooks}
          className="rounded-full p-3 m-1"
        >
          <AntDesign name="search1" size={32} color="#0B1215" />
        </TouchableOpacity>
      </View>

      
      

      {loading ? (
  <View classNam='ml-4'>
    <Text className='text-color-negro ml-5'>Buscando <Text className='font-bold'>"{query}"</Text>...</Text>
    <ActivityIndicator size="large" color="#e8c34d" className='object-center  w-96 h-96 text-9xl'/> 
  </View>
) : searchCompleted && results.length > 0 ? (
  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: 15 }}
    className="space-y-3"
  >
    <Text className="text-color-negro font-extrabold ml-1">
      Resultados ({results.length})
    </Text>
    <View className="flex flex-row flex-wrap justify-between mb-6">
      {results.map((item, index) => (
        <TouchableWithoutFeedback key={index} onPress={() => handleClick(item)}>
          <View className="w-1/2 mb-4 px-2">
            <View className="rounded-lg overflow-hidden border border-neutral-300">
              <Image
                source={item.volumeInfo.imageLinks?.thumbnail ? { uri: item.volumeInfo.imageLinks.thumbnail } : {uri: 'https://store.bookbaby.com/bookshop/OnePageBookCoverImage.jpg?BookID=BK90089173&abOnly=False'}}
                style={{ width: '100%', height: 230, resizeMode: 'cover' }}
                className="rounded-lg"
              />
            </View>
            <Text className="text-neutral-500 ml-1 mt-2 font-bold" style={{ fontSize: Platform.OS === 'ios' ? 14 : 16 }}>
              {item.volumeInfo.title && item.volumeInfo.title.length > 24 ? item.volumeInfo.title.slice(0, 24) + '...' : item.volumeInfo.title}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      ))}
    </View>
  </ScrollView>
) : (
    <View className="flex flex-1 justify-center items-center">
      <Image
        source={{ uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/search-book-6102192-5023370.png?f=webp' }}
        className="h-80 w-80 mb-42"
        resizeMode="cover"
      />
      <View className="flex flex-1 justify-center items-center p-4 text-center">
        <Text className="text-color-negro text-2xl font-bold">¡Explora el mundo de la lectura!</Text>
        <Text className="text-neutral-500 text-lg font-semibold text-center pt-2">¿No encuentras lo que buscas? Prueba con otro término de búsqueda.</Text>
      </View>
    </View>
)}
      
    </SafeAreaView>
  );
}