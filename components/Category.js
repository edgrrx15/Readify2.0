import React, { useEffect, useState } from 'react';
import { Text, View, TouchableWithoutFeedback, Image, ActivityIndicator, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';

const categories = [
  'Fisica',
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
  const [selectedCategory, setSelectedCategory] = useState('Fisica');
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const fetchData = async () => {
    setLoading(true);
    setError(null); // Resetea el error al intentar cargar los datos
    try {
      // Mejorar la consulta añadiendo campos adicionales que necesitamos
      const query = selectedCategory === 'Tendencia' ? 'bestsellers' : selectedCategory;
      const response = await axios.get(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12&fields=key,title,author_name,cover_i,first_publish_year,ratings_average,number_of_pages_median,language,subject,first_sentence,description,id_amazon,id_goodreads,id_librarything,id_google`
      );
      
      // Procesar los datos para asegurar que tienen el formato correcto
      const processedData = response.data.docs.map(book => {
        // Asegurarse de que los datos están en el formato correcto para BookScreen
        return {
          ...book,
          // Asegurar que existan todos los campos que BookScreen espera
          ratings_average: book.ratings_average || null,
          number_of_pages_median: book.number_of_pages_median || null,
          language: Array.isArray(book.language) ? book.language : book.language ? [book.language] : [],
          subject: Array.isArray(book.subject) ? book.subject : book.subject ? [book.subject] : [],
          first_sentence: Array.isArray(book.first_sentence) ? book.first_sentence : book.first_sentence ? [book.first_sentence] : [],
          description: book.description || null,
          id_amazon: Array.isArray(book.id_amazon) ? book.id_amazon : book.id_amazon ? [book.id_amazon] : [],
          id_goodreads: Array.isArray(book.id_goodreads) ? book.id_goodreads : book.id_goodreads ? [book.id_goodreads] : [],
          id_librarything: Array.isArray(book.id_librarything) ? book.id_librarything : book.id_librarything ? [book.id_librarything] : [],
          id_google: Array.isArray(book.id_google) ? book.id_google : book.id_google ? [book.id_google] : []
        };
      });
      
      setCategoryData(processedData || []);
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
    // Guardar el libro en el historial antes de navegar
    try {
      let history = await AsyncStorage.getItem('recentlyViewedBooks');
      history = history ? JSON.parse(history) : [];
      
      // Evitar duplicados en el historial
      if (!history.some(book => book.key === item.key)) {
        // Limitar el historial a 20 libros (opcional)
        if (history.length >= 20) {
          history.shift(); // Eliminar el libro más antiguo
        }
        history.push(item);
        await AsyncStorage.setItem('recentlyViewedBooks', JSON.stringify(history));
      }
      
      // Navegar a la pantalla del libro
      navigation.navigate('Book', { book: item });
    } catch (error) {
      console.error('Error al guardar el historial:', error);
      // Si hay un error con AsyncStorage, al menos navegamos a la pantalla del libro
      navigation.navigate('Book', { book: item });
    }
  };

  const renderBookItem = ({ item, index }) => {
    const title = item.title || 'Título no disponible';
    const coverUrl = item.cover_i 
      ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`
      : null;

    // Utilizar una imagen de respaldo si no hay portada
    const imageSource = coverUrl ? { uri: coverUrl } : require('../assets/no-cover.jpg');

    return (
    <TouchableWithoutFeedback 
        key={`${item.key || index}`} 
        onPress={() => handleClick(item)}
      >
        <View 
          className="w-[172px] mb-4 pr-3 mt-5" 
          accessible={true} 
          accessibilityLabel={`Ver detalles del libro favorito ${title}`}
        >
          <View className="rounded-lg overflow-hidden border border-neutral-100">
            <Image
              source={imageSource}
              style={{ width: '100%', height: 250, resizeMode: 'cover' }}
              className="rounded-lg"
              accessibilityHint="Toca para ver más detalles del libro."
              onError={(e) => console.error('Error loading image:', e.nativeEvent.error)}
            />
          </View>
          <Text 
            className="text-base text-neutral-100 mt-2 font-semibold" 
            style={{ fontSize: Platform.OS === 'ios' ? 14 : 16 }}
          >
            {title.length > 20 ? title.slice(0, 20) + '...' : title}
          </Text>
          {item.author_name && item.author_name.length > 0 && (
            <Text className="text-sm text-neutral-400">
              {item.author_name[0].length > 22 
                ? item.author_name[0].slice(0, 22) + '...' 
                : item.author_name[0]}
            </Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View className="flex-1 px-5 pt-4 pb-2">
      <View>
        <Text className='text-[32px] font-extrabold pb-2 text-neutral-200'>Categorías</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            accessibilityLabel={`Ver libros de la categoría ${category}`}
            accessibilityHint="Toca para ver los libros de esta categoría."
            activeOpacity={0.8}
            style={{ marginRight: 12, borderRadius: 12, overflow: 'hidden' }}
          >
            <BlurView
              intensity={50}
              tint={selectedCategory === category ? 'light' : 'dark'}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 12,
                backgroundColor:
                  selectedCategory === category ? 'rgba(0, 0, 1, 0)' : 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: selectedCategory === category ? '#fff' : '#a5a5a5',
                  fontWeight: selectedCategory === category ? 'bold' : 'normal',
                }}
              >
                {category}
              </Text>
            </BlurView>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-neutral-300 mt-2">Cargando libros...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-red-500">{error}</Text>
          <TouchableOpacity 
            onPress={fetchData} 
            className="mt-4 bg-blue-500 py-2 px-4 rounded-lg"
          >
            <Text className="text-white">Intentar nuevamente</Text>
          </TouchableOpacity>
        </View>
      ) : categoryData.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-neutral-300">No se encontraron libros para esta categoría.</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
        >
          {categoryData.map((book, index) => renderBookItem({ item: book, index }))}
        </ScrollView>
      )}
    </View>
  );
};

export default Category;