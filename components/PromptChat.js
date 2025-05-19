import { View, Text, TouchableOpacity, ScrollView, TextInput, Keyboard, Platform, Image, TouchableWithoutFeedback } from 'react-native';
import React, { useState, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';

const ejemplos = [
  "Libros para estudiar cálculo",
  "Libros recomendados para 2024",
  "Libros clásicos imperdibles",
  "Libros sobre desarrollo personal",
  "Mejores libros de ciencia ficción",
  "Libros sobre historia mundial",
  "Mejores libros de terror",
  "Libros sobre emprendimiento",
  "Libros para mejorar la productividad",
  "Libros de fantasía épica",
  "El mejor libro de cocina mexicana",
  "Libros para programar en C#",
  "Libros de física para prepa",
  "Mejor libro para ser feliz",
  "El mejor libro de comedia",
];

const COHERE_API_KEY = 'El265fvxpOdK7LttXZoNiczqh1xzdlsCLgL4a9Ax';

const PromptChat = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState('');
  const navigation = useNavigation();
  const inputRef = useRef(null);

  const getCohereQuery = async (prompt) => {
    try {
      const response = await axios.post(
        'https://api.cohere.ai/v1/generate',
        {
          model: 'command-r-plus',
          prompt: `
Eres un asistente que recomienda libros disponibles en OpenLibrary.

Prompt del usuario: "${prompt}"

Responde solo con el **título de un libro relevante o relacionado**, sin explicaciones, subtítulos, ni comillas. 
Debes variar tu respuesta en cada consulta, incluso si el prompt es repetido.
Si el tema es poco claro (como "Fortnite"), interpreta el contexto (por ejemplo, libros sobre videojuegos).
Recuerda: solo responde con **el título exacto de un libro popular** que pueda encontrarse en OpenLibrary.

Ejemplo:
Usuario: Libros para aprender matemáticas
Respuesta: Álgebra Baldor
`,
          max_tokens: 50,
          temperature: 0.9,
        },
        {
          headers: {
            Authorization: `Bearer ${COHERE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data.generations?.[0]?.text) {
        return response.data.generations[0].text.trim();
      }

      return 'No se encontraron resultados.';
    } catch (error) {
      console.error('Error al obtener datos de Cohere:', error.response?.data || error.message);
      return 'No se encontraron resultados.';
    }
  };

  const searchBooks = async () => {
    setLoading(true);
    try {
      const cohereQuery = await getCohereQuery(query);
      setResponseText(cohereQuery);

      const booksArray = cohereQuery.split("\n").filter(book => book.trim() !== "");
      const searchResults = [];

      for (let book of booksArray) {
        const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(book.trim())}&limit=1`);
        if (response.data.docs?.length > 0) {
          searchResults.push(response.data.docs[0]);
        }
      }

      setResults(searchResults);
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
    if (!history.find((book) => book.key === item.key)) {
      history.push(item);
      await AsyncStorage.setItem('recentlyViewedBooks', JSON.stringify(history));
    }
  };

  return (
    <ScrollView>
      <LinearGradient
        start={{ x: 0.6, y: 0.6 }}
        end={{ x: 1, y: -0.34 }}
        colors={['#000', '#26004a']}
        style={{ flex: 1, padding: 20 }}
      >
        <View className="px-2 pt-16">
          <MaskedView
            maskElement={
              <View className="flex">
                <Text className="text-6xl font-bold">Encuentra tu siguiente aventura literaria con la ayuda de la IA.</Text>
              </View>
            }
          >
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              colors={['#42ffd9', '#9b5bc9', '#b4ed9d']}
            >
              <Text className="opacity-0 text-6xl font-bold">Encuentra tu siguiente aventura literaria con la ayuda de la IA.</Text>
            </LinearGradient>
          </MaskedView>

          <View className="bg-transparent mt-12 mb-3 flex-row justify-between border border-neutral-200 rounded-2xl">
            <TextInput
              ref={inputRef}
              placeholder="Buscar libro..."
              className="flex-1 text-white focus:outline-none pl-4 bg-transparent"
              value={query}
              placeholderTextColor={'#fff'}
              onChangeText={(text) => setQuery(text)}
              onSubmitEditing={searchBooks}
            />
            <TouchableOpacity onPress={searchBooks} className="rounded-full p-3 m-1">
              <AntDesign name="search1" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          >
            {results.map((book) => {
              const coverUrl = book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                : null;
              const imageSource = coverUrl ? { uri: coverUrl } : require('../assets/no-cover.jpg');
              const title = book.title;

              return (
                <TouchableWithoutFeedback key={book.key} onPress={() => handleClick(book)}>
                  <View className="w-[172px] mb-4 pr-3 mt-5" accessible={true}>
                    <View className="rounded-lg overflow-hidden border border-neutral-100">
                      <Image
                        source={imageSource}
                        style={{ width: '100%', height: 250, resizeMode: 'cover' }}
                        className="rounded-lg"
                      />
                    </View>
                    <Text
                      className="text-base text-neutral-100 mt-2 font-semibold"
                      style={{ fontSize: Platform.OS === 'ios' ? 14 : 16 }}
                    >
                      {title.length > 26 ? title.slice(0, 26) + '...' : title}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </ScrollView>

          {responseText ? (
            <View className="mt-6">
              <Text className="text-lg font-semibold text-neutral-200 mb-4">Respuesta de la IA:</Text>
              <Text className="text-base text-neutral-100">{responseText}</Text>
            </View>
          ) : null}

          <View className="mt-6">
            <Text className="text-lg font-semibold text-neutral-200 mb-4">Ejemplos para inspirarte:</Text>
            <View className="flex-wrap flex-row">
              {ejemplos.map((ejemplo, index) => (
                <TouchableOpacity key={index} onPress={() => setQuery(ejemplo)} className="m-1 rounded-md overflow-hidden">
                  <LinearGradient
                    colors={['#42ffd9', '#9b5bc9', '#b4ed9d']}
                    start={{ x: -0.26, y: 1.9 }}
                    end={{ x: 1.4, y: 1 }}
                    className="p-2 rounded-md"
                  >
                    <Text className="text-black text-[12px] font-bold text-center">{ejemplo}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default PromptChat;
