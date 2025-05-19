import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const TrendingBooks = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Solicitar explícitamente todos los campos necesarios para BookScreen
      const response = await axios.get(
        `https://openlibrary.org/search.json?q=bestsellers&limit=10&fields=key,title,author_name,cover_i,first_publish_year,ratings_average,number_of_pages_median,language,subject,first_sentence,description,id_amazon,id_goodreads,id_librarything,id_google`
      );
      
      // Procesar los datos para asegurar que tienen el formato correcto
      const processedData = response.data.docs.map(book => {
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
      console.error('Error fetching trending books:', error);
      setError('No se pudieron cargar los libros en tendencia');
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (item) => {
    try {
      // Guardar en historial de libros vistos recientemente
      let history = await AsyncStorage.getItem('recentlyViewedBooks');
      history = history ? JSON.parse(history) : [];
      
      // Evitar duplicados y limitar tamaño del historial
      if (!history.some(book => book.key === item.key)) {
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
      navigation.navigate('Book', { book: item });
    }
  };

  const renderBookItem = (item, index) => {
    const title = item.title || 'Título no disponible';
    
    // Usar una imagen local como respaldo en lugar de una URL externa
    const coverUrl = item.cover_i
      ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`
      : null;
    
    const imageSource = coverUrl ? { uri: coverUrl } : require('../assets/no-cover.jpg');

    return (
      <View key={`trending-${item.key}-${index}`} style={{ width: width * 0.7, marginRight: 24 }}>
        <TouchableWithoutFeedback onPress={() => handleClick(item)}>
          <View style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
            <Text
              style={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                fontSize: 42,
                fontWeight: 'bold',
                color: '#fff',
                textShadowColor: 'rgba(0, 0, 0, 0.75)',
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4,
                zIndex: 10,
              }}
            >
              {index + 1}
            </Text>

            <Image
              source={imageSource}
              style={{
                width: width * 0.68,
                height: height * 0.5,
                resizeMode: 'stretch',
                borderRadius: 16,
              }}
              // Manejo de errores de carga de imagen
              onError={(e) => console.error('Error loading image:', e.nativeEvent.error)}
            />
          </View>
        </TouchableWithoutFeedback>

        {/* Título del libro */}
        <Text className="text-center mt-2 text-xl font-semibold text-neutral-200 px-2">
          {title.length > 40 ? title.slice(0, 40) + '...' : title}
        </Text>
        
        {/* Autor del libro */}
        {item.author_name && item.author_name.length > 0 && (
          <Text className="text-center text-sm text-neutral-400">
            {item.author_name[0].length > 35 
              ? item.author_name[0].slice(0, 35) + '...' 
              : item.author_name[0]}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View>
      <Text className="px-4 mt-4 mb-2 text-[32px] font-bold text-neutral-100">
        Explora las tendencias
      </Text>
      
      {loading ? (
        <View style={{ height: height * 0.5, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="mt-2 text-neutral-300">Cargando tendencias...</Text>
        </View>
      ) : error ? (
        <View style={{ height: height * 0.5, justifyContent: 'center', alignItems: 'center' }}>
          <Text className="text-red-500 mb-4">{error}</Text>
          <TouchableOpacity 
            onPress={fetchData}
            className="bg-blue-500 py-2 px-4 rounded-lg"
          >
            <Text className="text-white">Intentar de nuevo</Text>
          </TouchableOpacity>
        </View>
      ) : categoryData.length === 0 ? (
        <View style={{ height: height * 0.5, justifyContent: 'center', alignItems: 'center' }}>
          <Text className="text-neutral-300">No se encontraron libros en tendencia</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8, marginLeft: 16 }}
        >
          {categoryData.map((book, index) => renderBookItem(book, index))}
        </ScrollView>
      )}
    </View>
  );
};

export default TrendingBooks;