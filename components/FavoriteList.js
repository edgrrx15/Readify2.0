import { View, Text, ScrollView, TouchableWithoutFeedback, Alert, Image, Platform } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';  // Corregido: useCallback
import { useFocusEffect, useNavigation } from '@react-navigation/native';  // Corregido: useFocusEffect importado de @react-navigation/native
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

const FavoriteList = () => {
  const [favourites, setFavourites] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const loadFavourites = async () => {
        const storedFavourites = await AsyncStorage.getItem('favourites');
        if (storedFavourites) {
          setFavourites(JSON.parse(storedFavourites));
        } else {
          setFavourites([]);
        }
      };
      loadFavourites();
    }, [])
  );

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

  return (
    <View>
      {favourites.length > 0 && (
        <View className='flex-row justify-between'>
          <Text className='text-white px-4 text-xl font-bold'>Mis favoritos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Favorite')}>
            <Text className='text-green-300 px-4 text-lg'>Ver todos</Text>
          </TouchableOpacity>
        </View>
      )}
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
                  className="text-base text-neutral-300 mt-2 font-semibold"
                  style={{ fontSize: Platform.OS === 'ios' ? 14 : 16 }}
                >
                  {title.length > 20 ? title.slice(0, 20) + '...' : title}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default FavoriteList;
