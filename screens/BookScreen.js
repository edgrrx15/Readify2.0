import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Image, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const BookScreen = ({ route, navigation }) => {
  const { book } = route.params;
  const [isFavourite, setIsFavourite] = useState(false);

  const toggleFavourite = async () => {
    const storedFavourites = await AsyncStorage.getItem('favourites');
    const favourites = storedFavourites ? JSON.parse(storedFavourites) : [];

    if (isFavourite) {
      const newFavourites = favourites.filter((fav) => fav.id !== book.id);
      await AsyncStorage.setItem('favourites', JSON.stringify(newFavourites));
    } else {
      favourites.push(book);
      await AsyncStorage.setItem('favourites', JSON.stringify(favourites));
    }
    setIsFavourite(!isFavourite);
  };


  return (
    <ScrollView 
      contentContainerStyle={{ paddingBottom: 50, paddingTop: 40 }}
      className="flex-1 px-3"
    >
      <LinearGradient
        colors={['#F5F5F5', '#FFFFFF']}
        style={{ flex: 1, padding: 20, borderRadius: 20 }}
      >
        <View>
          <View className="flex-row justify-between items-center mb-4 mt-8">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleFavourite}>
              <AntDesign name={isFavourite ? "heart" : "hearto"} size={24} color={isFavourite ? '#ff2626' : "#000"} />
            </TouchableOpacity>
          </View>
          <View className="items-center mb-4 shadow-2x">
            <Image
                    source={book.volumeInfo.imageLinks?.thumbnail ? { uri: book.volumeInfo.imageLinks.thumbnail } :  {uri: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fstore.bookbaby.com%2Fbook%2Fthe-last-house1&psig=AOvVaw2BSIxBUqQjGM-qSrHTQME4&ust=1731457874062000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNi1mLDF1YkDFQAAAAAdAAAAABAJ'}}
                    style={{ width: width * 0.8 , height: height * 0.52, borderRadius: 20 , borderColor: '#000', resizeMode: 'contain'}}
              className="rounded-lg"
            />
          </View>

          <Text className="text-4xl font-bold text-black text-center mb-2">
            {book.volumeInfo.title || 'Sin título'}
          </Text>

          <Text className="text-xl text-neutral-500 text-center mb-6">
            {book.volumeInfo.authors?.join(', ') || 'Autor desconocido'}
          </Text>

          <View className="">
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex items-center">
                <Text className="text-lg text-black font-bold">{book.volumeInfo.averageRating || '?'}</Text>
                <Text className="text-lg text-neutral-600">Rating</Text>
              </View>
              <View className="flex items-center">
                <Text className="text-lg text-black font-bold">{book.volumeInfo.pageCount || '?'}</Text>
                <Text className="text-lg text-neutral-600">Páginas</Text>
              </View>
              <View className="flex items-center">
                <Text className="text-lg text-black font-bold uppercase">{book.volumeInfo.language || 'Desconocido'}</Text>
                <Text className="text-lg text-neutral-600">Idioma</Text>
              </View>
              <View className="flex items-center">
                <Text className="text-lg text-black font-bold">{book.volumeInfo.publishedDate?.slice(0, 4) || 'Desconocida'}</Text>
                <Text className="text-lg text-neutral-600">Año</Text>
              </View>
            </View>
          </View>

          <Text className=' mt-6 mb-4 text-2xl font-bold'>Descripción</Text>
          <Text className="text-lg text-gray-600 mb-4">
            {book.volumeInfo.description || 'Lo sentimos, no hay descripción.'}
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default BookScreen;
