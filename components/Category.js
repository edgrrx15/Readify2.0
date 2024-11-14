import React, { useEffect, useState } from 'react';
import { Text, View, TouchableWithoutFeedback, Image, ActivityIndicator, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = [
  'Tendencia',
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
  const [selectedCategory, setSelectedCategory] = useState('Tendencia');
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const fetchData = async () => {
    setLoading(true);
    setError(null); // Resetea el error al intentar cargar los datos
    try {
      const query = selectedCategory === 'Tendencia' ? 'bestsellers' : selectedCategory;
      const response = await axios.get(`https://openlibrary.org/search.json?q=${query}&limit=12`);
      setCategoryData(response.data.docs || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('No se pudo cargar los libros. Intenta nuevamente más tarde.');
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

  const renderBookItem = ({ item }) => {
    const title = item.title || 'Título no disponible'; // Si no tiene título, mostrar un valor por defecto
    const coverUrl = item.cover_i 
      ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`
      : null;

    // Verifica si la URL de la imagen es válida
    const imageSource = coverUrl ? { uri: coverUrl } : require('../assets/no-cover.jpg');

    return (
      <TouchableWithoutFeedback onPress={() => handleClick(item)}>
        <View className="w-[172px] mb-4 pr-3 mt-5" accessible={true} accessibilityLabel={`Ver detalles del libro ${title}`}>
          <View className="rounded-lg overflow-hidden border border-neutral-100">
            <Image
              source={imageSource}
              style={{ width: '100%', height: 250, resizeMode: 'cover' }}
              className="rounded-lg"
              accessibilityHint="Toca para ver más detalles del libro."
              onError={(e) => console.error('Error loading image:', e.nativeEvent.error)} // Manejo de errores
            />
          </View>
          <Text className="text-base text-neutral-600 mt-2 font-semibold" style={{ fontSize: Platform.OS === 'ios' ? 14 : 16 }}>
            {title.length > 20 ? title.slice(0, 20) + '...' : title}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View className="flex-1 px-5 pt-4 pb-2">
      <View>
        <Text className='text-2xl font-extrabold pb-8'>Categorías</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle="px-4 py-2"
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            className="mr-4 py-2 px-4 rounded-lg"
            style={{
              backgroundColor: selectedCategory === category ? '#54ff8d' : 'transparent',
            }}
           accessibilityLabel={`Ver libros de la categoría ${category}`}
            accessibilityHint="Toca para ver los libros de esta categoría."
          >
            <Text
              style={{
                fontSize: 18,
                color: '#000',
                fontWeight: selectedCategory === category ? 'bold' : 'thin',
              }}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="green" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-red-600">{error}</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
        >
          {categoryData.map((book) => (
            renderBookItem({ item: book })
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default Category;
