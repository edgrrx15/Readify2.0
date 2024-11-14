import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableWithoutFeedback, Image, Text, Dimensions, Modal, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

const FavouriteBooks = ({ title }) => {
  const [favourites, setFavourites] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigation = useNavigation();

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
    let history = await AsyncStorage.getItem('recentlyViewedBooks');
    history = history ? JSON.parse(history) : [];
    if (!history.find(book => book.id === item.id)) {
      history.push(item);
      await AsyncStorage.setItem('recentlyViewedBooks', JSON.stringify(history));
    }
  }

  const clearFavorites =  async () =>{
    try {
      await AsyncStorage.removeItem('favourites');
      setFavourites([]);
      navigation.navigate('Favorite');
      setShowConfirmation(false)
    } catch (error) {
      console.error('Error al borrar tus favoritos:', error);
    }
  }
  

  return (

<ScrollView className="p-4 bg-neutral-50">
  {favourites.length > 0 ? (
    <View className="flex-row justify-between p-3 mb-2">
      <Text className="text-color-negro text-lg">{title} ({favourites.length})</Text>
      <TouchableOpacity onPress={() => setShowConfirmation(true)}>
        <Text className="text-red-500 text-lg">Borrar todo</Text>
      </TouchableOpacity>
    </View>
  ) : null}

  <Modal visible={showConfirmation} animationType="fade" transparent >
    <View className="flex-1 justify-center items-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
      <View className="bg-color-blanco p-6 rounded-xl items-center border border-gray-700">
        <Ionicons name="alert" size={72} color="#0B1215" />
        <Text className="text-color-negro text-2xl text-center font-bold mt-5 mb-5">
          ¿Estás seguro que quieres borrar tus {favourites.length} libros favoritos?
        </Text>   
        <View className="flex-row justify-center">
          <Pressable onPress={() => setShowConfirmation(false)} className="p-4 mr-4 rounded-lg items-center">
            <Text className="text-color-negro font-bold">Cancelar</Text>
          </Pressable>
          <Pressable onPress={clearFavorites}  className="bg-red-400 px-4 py-2 rounded-lg flex-row items-center">
            <Feather name="trash" size={20} color="white" />
            <Text className="text-white font-bold ml-2">Borrar Favoritos</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>

  <View className="flex flex-row flex-wrap justify-between mb-6">
    {favourites.length > 0 ? (
      favourites.map((book) => (
        <TouchableWithoutFeedback key={book.id} onPress={() => handleClick(book)}>
          <View className="w-1/2 mb-4 px-2">
            <View className="rounded-lg overflow-hidden ">
              <Image
                source={book.volumeInfo.imageLinks?.thumbnail ? { uri: book.volumeInfo.imageLinks.thumbnail } : {uri: 'https://store.bookbaby.com/bookshop/OnePageBookCoverImage.jpg?BookID=BK90089173&abOnly=False'}}
                style={{ width: '100%', height: 230, resizeMode: 'cover' }}
                className="rounded-lg"
              />
            </View>
            <View className="mt-2">
              <Text  className="text-neutral-500 ml-1">
                {book.volumeInfo.title.length > 24 ? book.volumeInfo.title.slice(0, 24) + '...' : book.volumeInfo.title}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      ))
    ) : (
      <View className='flex-1 justify-center items-center'>
        <View className='flex-1 justify-center items-center p-4 text-center'> 
          <Image source={{uri: 'https://cdn3d.iconscout.com/3d/free/thumb/free-favourite-book-3985339-3317717.png'}} className='w-80 h-80'  /> 
          <Text className="text-color-negro text-4xl font-bold text-center">Aun tienes ningún libro favorito</Text> 
          <Text className="text-neutral-500 text-lg font-semibold text-center pt-2"> No te preocupes, el libro perfecto está esperando ser encontrado.</Text> 
        </View>
      </View>
    )}
  </View>
</ScrollView>

  );
};

export default FavouriteBooks;