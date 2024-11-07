import React, { useEffect, useState } from 'react';
import { Text, View, TouchableWithoutFeedback, Image, ActivityIndicator, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = [
  'Todos',
  'Filosofia',
  'Ciencia ficcion',
  'Historia',
  'Biography',
  'Fantasy',
  'Mystery',
  'Romance',
  'Adventure',
  'Young Adult',
  'Self-Help',
  'Children',
  'Mathematics',
];

const Category = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const navigation = useNavigation();

  const fetchData = async () => {
    setLoading(true);
    try {
      const query = selectedCategory === 'Todos' ? 'bestsellers' : selectedCategory;
      const response = await axios.get(`https://openlibrary.org/search.json?subject=${query}&limit=40`);
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
    if (!history.find(book => book.key === item.key)) {
      history.push(item);
      await AsyncStorage.setItem('recentlyViewedBooks', JSON.stringify(history));
    }
  };

  return (
    <View className="flex-1 px-6 pt-4 pb-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            className={`mr-2 py-2 px-4 rounded-md ${selectedCategory === category ? 'bg-blue-600' : 'bg-neutral-100'}`}
          >
            <Text style={{ fontSize: 18, color: selectedCategory === category ? '#FFF' : '#666', fontWeight: selectedCategory === category ? 'bold' : 'normal' }}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffe75e" />
        </View>
      ) : (
        <View className="flex-row justify-between flex-wrap mt-6">
          {categoryData.map((book) => (
            <TouchableWithoutFeedback key={book.key} onPress={() => handleClick(book)}>
              <View className="w-1/2 mb-4 pr-3">
                <View className="rounded-lg overflow-hidden border border-neutral-300">
                  <Image
                    source={{ uri: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : 'https://store.bookbaby.com/bookshop/OnePageBookCoverImage.jpg?BookID=BK90089173&abOnly=False' }}
                    style={{ width: '100%', height: 230, resizeMode: 'cover' }}
                  />
                </View>
                <Text className="text-base text-neutral-600 mt-2 font-semibold" style={{ fontSize: Platform.OS === 'ios' ? 14 : 16 }}>
                  {book.title.length > 20 ? book.title.slice(0, 20) + '...' : book.title}
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
