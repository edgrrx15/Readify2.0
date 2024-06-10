import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const RecentlyViewedBooks = ({title}) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const getRecentlyViewedBooks = async () => {
      const history = await AsyncStorage.getItem('recentlyViewedBooks');
      if (history) {
        setRecentlyViewed(JSON.parse(history));
      }
    };

    getRecentlyViewedBooks();
  }, [recentlyViewed]); 

  const ClearHistory = async () => {
    try {
      await AsyncStorage.removeItem('recentlyViewedBooks');
      setRecentlyViewed([]);
      navigation.navigate('History');
    } catch (error) {
      console.error('Error al borrar el historial:', error);
    }
  }

  const handleClick = (book) => {
    navigation.navigate('Book', { book });
  };

  return (
    <ScrollView className="p-4 bg-color-blanco">

      {recentlyViewed.length > 0 ? (
          <View className='flex-row items-center justify-between'>
            <Text className="text-color-negro text-lg m-3">{title} ({recentlyViewed.length})</Text>
            <TouchableOpacity onPress={ClearHistory}>
                  <Text className="text-red-400 text-lg m-3">Limpiar historial</Text>
            </TouchableOpacity>
          </View>
        ) : null
      }

      <View className="flex flex-row flex-wrap justify-between mt-3 mb-6">
        {recentlyViewed.map(book => (
          <TouchableWithoutFeedback key={book.id} onPress={() => handleClick(book)}>
            <View className="w-1/2 mb-4 px-2">
              <View className="rounded-lg overflow-hidden">
                <Image
                   source={book.volumeInfo && book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail ? { uri: book.volumeInfo.imageLinks.thumbnail } : {uri: 'https://store.bookbaby.com/bookshop/OnePageBookCoverImage.jpg?BookID=BK90089173&abOnly=False'}}
                  style={{ width: '100%', height: 230, resizeMode: 'cover', }}
                  className="rounded-lg"
                />
              </View>
              <View className="mt-2">
                <Text className="text-neutral-500 ml-1">
                  {book.volumeInfo && book.volumeInfo.title ? 
                    (book.volumeInfo.title.length > 24 ? book.volumeInfo.title.slice(0,24) + '...' : book.volumeInfo.title) : 
                    "Sin título"
                  }
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
      {recentlyViewed.length === 0 && (
        <View className='flex-1 justify-center items-center'>
          <View className='flex-1 justify-center items-center p-4 text-center'> 
            <Image source={{uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/history-5591078-4652855.png'}} className='w-80 h-80'/> 
            <Text className="text-color-negro text-4xl font-bold text-center">¡Oops! Parece que aún no hay libros por aquí</Text> 
            <Text className="text-neutral-500 text-lg font-semibold text-center pt-4"> No te preocupes, el libro perfecto está esperando ser encontrado.</Text> 
          </View>
        </View>

      )}
    </ScrollView>
  );
};

export default RecentlyViewedBooks;