import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, TouchableWithoutFeedback, Image, ActivityIndicator, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';

const FavoriteList = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const loadFavourites = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedFavourites = await AsyncStorage.getItem('favourites');
      if (storedFavourites) {
        setFavourites(JSON.parse(storedFavourites));
      } else {
        setFavourites([]);
      }
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      setError('No se pudieron cargar tus favoritos. Intenta nuevamente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar favoritos cada vez que la pantalla obtiene foco
  useFocusEffect(
    useCallback(() => {
      loadFavourites();
    }, [])
  );

  const handleClick = async (item) => {
    try {
      // Guardar el libro en el historial antes de navegar
      let history = await AsyncStorage.getItem('recentlyViewedBooks');
      history = history ? JSON.parse(history) : [];
      
      // Evitar duplicados en el historial
      if (!history.some(book => book.key === item.key)) {
        // Limitar el historial a 20 libros
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

  // Si no hay favoritos, mostrar un mensaje informativo
  if (!loading && favourites.length === 0 && !error) {
    return (
      <View className="py-4 px-5">
        <Text className='text-[24px] font-bold pb-2 text-neutral-200'>Mis favoritos</Text>
        <View className="flex justify-center items-center py-8">
          <Text className="text-neutral-300 text-lg text-center">
            No tienes libros favoritos aún.
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Search')}
            className="mt-4 bg-blue-500 py-2 px-6 rounded-lg"
          >
            <Text className="text-white font-semibold">Explorar libros</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="py-4">
      <View className='flex-row justify-between px-5'>
        <Text className='text-[24px] font-bold text-neutral-200'>Mis favoritos</Text>
        {favourites.length > 0 && (
          <TouchableOpacity onPress={() => navigation.navigate('Favorite')}>
            <Text className='text-neutral-400 text-lg'>Ver todos</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View className="flex justify-center items-center py-8">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-neutral-300 mt-2">Cargando favoritos...</Text>
        </View>
      ) : error ? (
        <View className="flex justify-center items-center py-8">
          <Text className="text-lg text-red-500">{error}</Text>
          <TouchableOpacity 
            onPress={loadFavourites} 
            className="mt-4 bg-blue-500 py-2 px-4 rounded-lg"
          >
            <Text className="text-white">Intentar nuevamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
        >
          {favourites.map((book, index) => renderBookItem({ item: book, index }))}
        </ScrollView>
      )}
    </View>
  );
};

export default FavoriteList;