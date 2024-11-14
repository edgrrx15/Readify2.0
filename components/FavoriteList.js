import { View, Text, ScrollView, TouchableWithoutFeedback, Alert, Image, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoriteList = () => {
  const [favourites, setFavourites] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigation = useNavigation();

  // Cargar favoritos desde AsyncStorage
  useEffect(() => {
    const loadFavourites = async () => {
      const storedFavourites = await AsyncStorage.getItem('favourites');
      if (storedFavourites) {
        setFavourites(JSON.parse(storedFavourites));
      }
    };
    loadFavourites();
  }, []);

  const handleClick = async (item) => {
    navigation.navigate('Book', { book: item });

    // Guardar el libro en el historial 
    let history = await AsyncStorage.getItem('recentlyViewedBooks');
    history = history ? JSON.parse(history) : [];
    if (!history.find(book => book.id === item.id)) {
      history.push(item);
      await AsyncStorage.setItem('recentlyViewedBooks', JSON.stringify(history));
    }
  };

  // Función para borrar todos los favoritos
  const clearFavorites = async () => {
    try {
      await AsyncStorage.removeItem('favourites');
      setFavourites([]);
      navigation.navigate('Favorite');
      setShowConfirmation(false);
    } catch (error) {
      Alert.alert('Error al borrar tus favoritos:', error.message);
    }
  };

  return (
    <View className='px-4'>
      <Text className='text-white'>Mis favoritos</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
      >
        {favourites.map((book) => {
          const coverUrl = book.cover_i 
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            : null;
          const imageSource = coverUrl ? { uri: coverUrl } : require('../assets/no-cover.jpg');
          const title = book.title;

          return (
            <TouchableWithoutFeedback key={book.id} onPress={() => handleClick(book)}>
              <View
                className="w-[172px] mb-4 pr-3 mt-5"
                accessible={true}
                accessibilityLabel={`Ver detalles del libro ${title}`}
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
                  className="text-base text-neutral-600 mt-2 font-semibold"
                  style={{ fontSize: Platform.OS === 'ios' ? 14 : 16 }}
                >
                  {title.length > 20 ? title.slice(0, 20) + '...' : title}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>

      {showConfirmation && (
        <View>
          <Text>¿Estás seguro de que quieres borrar todos tus favoritos?</Text>
          <TouchableWithoutFeedback onPress={clearFavorites}>
            <Text>Borrar todos</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => setShowConfirmation(false)}>
            <Text>Cancelar</Text>
          </TouchableWithoutFeedback>
        </View>
      )}
    </View>
  );
};

export default FavoriteList;
