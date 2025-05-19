import React, { useState, useRef } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback, Image, ScrollView, ActivityIndicator, Keyboard, Platform, StatusBar, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';

const trendingSearches = [
  'Las que no duermen',
  'El Clan',
  'La grieta del silencio',
  'Un animal salvaje',
  'Invisible',
  'La asistenta',
  'Las hijas de la criada',
  'La península de las casas vacías',
  'El niño que perdió la guerra',
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const inputRef = useRef(null);

  const searchBooks = async (searchTerm) => {
    const q = searchTerm || query;
    if (!q.trim()) return;

    setLoading(true);
    setQuery(q);  // Actualiza el input si se busca por botón
    try {
      const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=20`);
      setResults(response.data.docs || []);
      setSearchCompleted(true);
    } catch (error) {
      console.error('Error al buscar libros:', error);
    } finally {
      setLoading(false);
    }
    Keyboard.dismiss();
  };

  const handleClick = async (item) => {
    navigation.navigate('Book', { book: item });
    let history = await AsyncStorage.getItem('recentlyViewedBooks');
    history = history ? JSON.parse(history) : [];
    if (!history.find(book => book.key === item.key)) {
      history.push(item);
      await AsyncStorage.setItem('recentlyViewedBooks', JSON.stringify(history));
    }
  };

  return (
    <View style={{ flex: 1}}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      <LinearGradient
        colors={['#2b2b2b', '#252526', '#2b2b2b']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ ...StyleSheet.absoluteFillObject }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingTop: 16, paddingHorizontal: 16 }} keyboardShouldPersistTaps="handled">

          <BlurView
  intensity={50}
  tint="dark"
  style={{
    flexDirection: 'row',
    borderRadius: 9999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 12,
    alignItems: 'center',
  }}
>
  <TextInput
    ref={inputRef}
    placeholder="Buscar libro..."
    placeholderTextColor="#aaa"
    style={{
      flex: 1,
      color: '#fff',
      paddingVertical: Platform.OS === 'ios' ? 10 : 6,
      paddingHorizontal: 12,
      fontSize: 16,
    }}
    value={query}
    onChangeText={setQuery}
    onSubmitEditing={() => searchBooks()}
    keyboardAppearance="dark"
    returnKeyType="search"
  />
  {query.length > 0 && (
    <TouchableOpacity
      onPress={() => {
        setQuery('');
        setSearchCompleted(false);
        setResults([]);
      }}
      style={{ padding: 6 }}
    >
      <AntDesign name="closecircle" size={20} color="#ccc" />
    </TouchableOpacity>
  )}
  <TouchableOpacity onPress={() => searchBooks()} style={{ padding: 8, borderRadius: 9999 }}>
    <AntDesign name="search1" size={24} color="#fff" />
  </TouchableOpacity>
</BlurView>


          <TouchableOpacity onPress={() => navigation.navigate('IaScreen')} style={{ marginBottom: 20 }}>
            <BlurView intensity={60} tint="dark" style={{ borderRadius: 9999, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 24 }}>
              <MaskedView
                maskElement={
                  <View>
                    <Text style={{ fontSize: 22, fontWeight: '800', color: 'black' }}>
                      Descubre libros con IA.
                    </Text>
                  </View>
                }
              >
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  colors={['#A2C2E1', '#A7D3B4', '#B7C9D6']}
                >
                  <Text style={{ fontSize: 24, fontWeight: '800', paddingLeft: 8, opacity: 0 }}>
                    Descubre libros con IA.
                  </Text>
                </LinearGradient>
              </MaskedView>
              <AntDesign name="search1" size={24} color="#fff" />
            </BlurView>
          </TouchableOpacity>

          {loading ? (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text style={{ color: '#fff', marginBottom: 10 }}>Buscando <Text style={{ fontWeight: 'bold' }}>"{query}"</Text>...</Text>
              <ActivityIndicator size="large" />
            </View>
          ) : searchCompleted && results.length > 0 ? (
            <View style={{ marginBottom: 100 }}>
              <Text style={{ color: '#fff', fontWeight: '800', marginBottom: 12 }}>Resultados ({results.length})</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {results.map((item, index) => (
                  <TouchableWithoutFeedback key={index} onPress={() => handleClick(item)}>
                    <View style={{ width: '48%', marginBottom: 20 }}>
                      <View style={{ borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#444' }}>
                        <Image
                          source={item.cover_i ? { uri: `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg` } : require('../assets/no-cover.jpg')}
                          style={{ width: '100%', height: 230, resizeMode: 'cover' }}
                        />
                      </View>
                      <Text
                        style={{
                          color: '#bbb',
                          marginTop: 8,
                          fontWeight: '700',
                          fontSize: Platform.OS === 'ios' ? 14 : 16,
                        }}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                ))}
              </View>
            </View>
          ) : (
        
  <View style={{ marginTop: 30 }}>
    <Text style={{ color: '#888', textAlign: 'center', marginBottom: 12, fontSize: 16, fontWeight: '600' }}>
      Búsquedas en trendencia:
    </Text>
    <View style={{}}>
      {trendingSearches.map((term, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => searchBooks(term)}
          style={{
            backgroundColor: '#1f1f1f',
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: 10,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: '#3b3b3c',
          }}
        >
          <Text style={{ color: '#eee', fontWeight: '600', fontSize: 16 }}>{term}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
)}

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
