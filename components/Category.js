import React, { useEffect, useState } from 'react';
import { Text, View, TouchableWithoutFeedback, Image, ActivityIndicator, TouchableOpacity, ScrollView, Platform} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import noCoverImage from '../assets/no-cover.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = [
  'Todos',
  'Filosofía',
  'Ciencia ficción',
  'Historia',
  'Biografías',
  'Fantasía',
  'Misterio',
  'Romance',
  'Aventura',
  'Literatura juvenil',
  'Auto-ayuda',
  'Infantil',
  'Matematicas',
];

const Category = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const navigation = useNavigation();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        selectedCategory === 'Todos' ? 'https://www.googleapis.com/books/v1/volumes?q=$%todos%7D&maxResults=40' : `https://www.googleapis.com/books/v1/volumes?q=${selectedCategory}&maxResults=40`
      );
      setCategoryData(response.data.items || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const handleClick = async (item) => {
    navigation.navigate('Book', { book: item });
    
    let history = await AsyncStorage.getItem('recentlyViewedBooks');
    history = history ? JSON.parse(history) : [];
    if (!history.find(book => book.id === item.id)) {
      history.push(item);
      await AsyncStorage.setItem('recentlyViewedBooks', JSON.stringify(history));
    }
  };


  return (
    <View className="flex-1 px-4 pt-4 pb-2 ">
       <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle="px-4 py-2"
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => setSelectedCategory(category)}
          className={`mr-4 py-2 px-4 rounded-full ${selectedCategory === category ? 'bg-yellow-500' : 'bg-input'}`}
        >
          <Text
            style={{
              fontSize: 18,
              color: selectedCategory === category ? '#FFF' : '#666',
              fontWeight: selectedCategory === category ? 'bold' : 'normal',
            }}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
      {loading ? (
        <View className="flex-1 justify-center items-center ">
          <ActivityIndicator size="large" color="#ffe75e" />
        </View>
      ) : (
        <View className="flex-row justify-between flex-wrap mt-4 ">
          {categoryData.map((book) => (
            <TouchableWithoutFeedback key={book.id} onPress={() => handleClick(book)}>
              <View className="w-1/2 mb-4 px-2">
                <View className="rounded-lg overflow-hidden border border-neutral-300">
                  <Image
                    source={book.volumeInfo.imageLinks?.thumbnail ? { uri: book.volumeInfo.imageLinks.thumbnail } :  {uri: 'https://store.bookbaby.com/bookshop/OnePageBookCoverImage.jpg?BookID=BK90089173&abOnly=False'}}
                    style={{ width: '100%', height: 230, resizeMode: 'cover' }}
                    className="rounded-lg"
                  />
                </View>
                  <Text className="text-base text-neutral-600 mt-2 font-semibold" style={{ fontSize: Platform.OS === 'ios' ? 14 : 16 }}>
                    {book.volumeInfo.title.length > 20 ? book.volumeInfo.title.slice(0, 20) + '...' : book.volumeInfo.title}
                  </Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      )}
    </View>
  );
};

export default Category;
