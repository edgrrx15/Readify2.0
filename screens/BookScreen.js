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
      const newFavourites = favourites.filter((fav) => fav.key !== book.key);
      await AsyncStorage.setItem('favourites', JSON.stringify(newFavourites));
    } else {
      favourites.push(book);
      await AsyncStorage.setItem('favourites', JSON.stringify(favourites));
    }
    setIsFavourite(!isFavourite);
  };

  useEffect(() => {
    const loadFavourites = async () => {
      const storedFavourites = await AsyncStorage.getItem('favourites');
      const favourites = storedFavourites ? JSON.parse(storedFavourites) : [];
      const isBookFavourite = favourites.some(fav => fav.key === book.key);
      setIsFavourite(isBookFavourite);
    };

    loadFavourites();
  }, [book.key]);


  const rating = 
    book.ratings_average ? 
    Number.isInteger(book.ratings_average) ? 
    book.ratings_average : book.ratings_average.toFixed(2) : '?';

  const toggleLinks = () => {
    const amazonId = book.id_amazon && book.id_amazon[0];
    const librarything = book.id_librarything && book.id_librarything[0];
    const goodreads = book.id_goodreads && book.id_goodreads[0];
    const google = book.id_google && book.id_google[0];

    let links = [];

    if (amazonId) {
      links.push({ name: 'Amazon', url: `https://www.amazon.com/dp/${amazonId}` });
    }
    if (librarything) {
      links.push({ name: 'LibraryThing', url: `https://www.librarything.com/work/${librarything}` });
    }
    if (goodreads) {
      links.push({ name: 'Goodreads', url: `https://www.goodreads.com/book/show/${goodreads}` });
    }
    if (google) {
      links.push({ name: 'Google Books (Vista previa)', url: `https://books.google.com/books?id=${google}` });
    }

    return links;
  };

  const links = toggleLinks();

  return (
    <ScrollView 
      className="flex-1"
    >
      <LinearGradient
                  start={{ x: 0.1, y: 1 }}
                  end={{ x: 0.1, y: 0 }}
        colors={['#fff', '#cef2d6', '#Fff']}
        style={{ flex: 1, padding: 20 }}
      >
        <View className='px-2 pt-6 pb-12'>
          <View className="flex-row  justify-between items-center mb-4 mt-8">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleFavourite}>
            <AntDesign name={isFavourite ? "heart" : "hearto"} size={24} color={isFavourite ? '#ff2626' : "#000"} />
            </TouchableOpacity>
          </View>
          <View className="items-center mb-4 shadow-2x">
            <Image
              source={book.cover_i ? { uri: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` } : {uri: require('../assets/no-cover.jpg')}}
              style={{ width: width * 0.8, height: height * 0.52, borderRadius: 20, borderColor: '#000', resizeMode: 'contain' }}
              className="rounded-lg"
            />
          </View>

          <Text className="text-4xl font-bold text-black text-center mb-2">
            {book.title || 'Sin título'}
          </Text>

          <Text className="text-xl text-neutral-500 text-center mb-6">
            {book.author_name?.join(', ') || 'Autor desconocido'}
          </Text>

          <View className="flex-row justify-between items-center mb-2">
            <View className="flex items-center">
              <Text className="text-lg text-black font-bold">
                {rating}
              </Text>
              <Text className="text-lg text-neutral-600">Calificación</Text>
            </View>
            <View className="flex items-center">
              <Text className="text-lg text-black font-bold">{book.number_of_pages_median || '?'}</Text>
              <Text className="text-lg text-neutral-600">Páginas</Text>
            </View>
            <View className="flex items-center">
              <Text className="text-lg text-black font-bold uppercase">
                {book.language && book.language.includes('spa') ? 'ESP' : 
                book.language && book.language.includes('eng') ? 'ENG' : '?'}
              </Text>
              <Text className="text-lg text-neutral-600">Idioma(s)</Text>
            </View>
            <View className="flex items-center">
              <Text className="text-lg text-black font-bold">{book.first_publish_year || '?'}</Text>
              <Text className="text-lg text-neutral-600">Año</Text>
            </View>
          </View>

          <Text className="mt-6 mb-4 text-2xl font-bold">Categoria</Text>
          <Text className="text-lg text-gray-600 mb-4">
            {book.subject?.slice(0,2).join(', ') || 'No disponible'}
          </Text>

          <Text className="mt-6 mb-4 text-2xl font-bold">Descripción</Text>
          <Text className="text-lg text-gray-600 mb-4">
            {book.first_sentence?.[0] || 'Lo sentimos, no hay descripción disponible.'}
          </Text>

          {links.length > 0 && (
            <View className="mt-6">
              <Text className="text-2xl font-bold mb-4">Obtenlo donde tú quieras</Text>
              {links.map((link, index) => (
                <TouchableOpacity  key={index} onPress={() => Linking.openURL(link.url)}>
                  <Text className="text-lg text-blue-600">{link.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default BookScreen;
