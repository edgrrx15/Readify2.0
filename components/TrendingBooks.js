import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableWithoutFeedback, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
const { width, height } = Dimensions.get('window');

const TrendingBooks = () => {
  const [categoryData, setCategoryData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://openlibrary.org/search.json?q=bestsellers&limit=10`);
        setCategoryData(response.data.docs || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleClick = (item) => {
    navigation.navigate('Book', { book: item });
  };

  const renderBookItem = (item, index) => {
    const title = item.title || 'Título no disponible';
    const coverUrl = item.cover_i
      ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`
      : 'URL de imagen de respaldo';

    return (
      <View key={index} style={{ width: width * 0.7, marginRight: 24 }}>
        <TouchableWithoutFeedback onPress={() => handleClick(item)}>
          <View className="rounded-lg overflow-hidden shadow-lg ">
            <Image
              source={{ uri: coverUrl }}
              style={{
                width: width * 0.68,
                height: height * 0.5,
                resizeMode: 'stretch',
              }}
            />
          </View>
        </TouchableWithoutFeedback>

        <Text className="text-center mt-2 text-xl font-semibold text-neutral-100 px-2">
          {title.length > 40 ? title.slice(0, 40) + '...' : title}
        </Text>
      </View>
    );
  };

  return (

    <View>
        <Text className='px-4 mt-4 mb-2 text-[32px] font-bold text-white'>Explora las tendencias</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 8, marginLeft: 16 }}
    >
    
      {categoryData.map((book, index) => renderBookItem(book, index))}
    </ScrollView>
    </View>
  );
};

export default TrendingBooks;
