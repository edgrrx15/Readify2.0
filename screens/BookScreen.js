import React, { useState, useEffect } from 'react'; 
import { ScrollView, Text, View, Image, Dimensions, TouchableOpacity, Linking, ActivityIndicator, StyleSheet } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const BookScreen = ({ route, navigation }) => {
  const { book } = route.params;
  const [isFavourite, setIsFavourite] = useState(false);
  const [audiobook, setAudiobook] = useState(null);
  const [loadingAudio, setLoadingAudio] = useState(false);

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

  useEffect(() => {
    const fetchAudiobook = async () => {
      setLoadingAudio(true);
      try {
        const title = encodeURIComponent(book.title || '');
        const author = encodeURIComponent(book.author_name ? book.author_name[0] : '');
        const url = `https://librivox.org/api/feed/audiobooks/?title=${title}&author=${author}&format=json`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.books && data.books.length > 0) {
          setAudiobook(data.books[0]);
        } else {
          setAudiobook(null);
        }
      } catch {
        setAudiobook(null);
      } finally {
        setLoadingAudio(false);
      }
    };
    fetchAudiobook();
  }, [book.title, book.author_name]);

  const rating = book.ratings_average 
    ? (typeof book.ratings_average === 'number' 
      ? (Number.isInteger(book.ratings_average) 
        ? book.ratings_average 
        : book.ratings_average.toFixed(2))
      : '?')
    : '?';

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

  const coverImage = book.cover_i 
    ? { uri: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` } 
    : require('../assets/no-cover.jpg');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2b2b2b', '#252526', '#2b2b2b']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Feather name="arrow-left" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleFavourite} style={styles.iconButton}>
            <AntDesign name={isFavourite ? "heart" : "hearto"} size={28} color={isFavourite ? '#ff3b30' : "#fff"} />
          </TouchableOpacity>
        </View>

        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image source={coverImage} style={styles.coverImage} />
        </View>

        {/* Title & Author */}
        <Text style={styles.title}>{book.title || 'Sin título'}</Text>
        <Text style={styles.author}>{book.author_name?.join(', ') || 'Autor desconocido'}</Text>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>{rating}</Text>
            <Text style={styles.infoLabel}>Calificación</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>{book.number_of_pages_median || '?'}</Text>
            <Text style={styles.infoLabel}>Páginas</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>
              {book.language && Array.isArray(book.language) && book.language.includes('spa') ? 'ESP' : 
               book.language && Array.isArray(book.language) && book.language.includes('eng') ? 'ENG' : '?'}
            </Text>
            <Text style={styles.infoLabel}>Idioma(s)</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>{book.first_publish_year || '?'}</Text>
            <Text style={styles.infoLabel}>Año</Text>
          </View>
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Categoría</Text>
        <Text style={styles.sectionText}>{book.subject?.slice(0, 2).join(', ') || 'No disponible'}</Text>

        {/* Description */}
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.sectionText}>
          {Array.isArray(book.first_sentence) && book.first_sentence.length > 0 
            ? book.first_sentence[0] 
            : typeof book.first_sentence === 'string' 
              ? book.first_sentence 
              : book.description 
                ? (typeof book.description === 'string' 
                  ? book.description 
                  : Array.isArray(book.description) 
                    ? book.description[0] 
                    : 'Lo sentimos, no hay descripción disponible.')
                : 'Lo sentimos, no hay descripción disponible.'}
        </Text>

        {/* External Links */}
        {links.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Obtenlo donde tú quieras</Text>
            {links.map((link, index) => (
              <TouchableOpacity key={index} onPress={() => Linking.openURL(link.url)} style={styles.linkButton}>
                <Text style={styles.linkText}>{link.name}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Audiobook */}
        <Text style={styles.sectionTitle}>Audiolibro</Text>
        {loadingAudio ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginVertical: 20 }} />
        ) : audiobook ? (
          <TouchableOpacity
            onPress={() => Linking.openURL(audiobook.url_librivox)}
            style={styles.audioButton}
          >
            <Text style={styles.audioButtonText}>Escuchar audiolibro: {audiobook.title}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.sectionText, { color: '#888' }]}>Audiolibro no disponible.</Text>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: {
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  iconButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  coverContainer: {
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
    borderRadius: 20,
  },
  coverImage: {
    width: width * 0.75,
    height: height * 0.5,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
  },
  author: {
    fontSize: 18,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  infoLabel: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ddd',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#aaa',
    lineHeight: 24,
    marginBottom: 24,
  },
  linkButton: {
    paddingVertical: 12,
  },
  linkText: {
    fontSize: 16,
    color: '#4aa1f0',
    fontWeight: '600',
  },
  audioButton: {
    backgroundColor: '#4aa1f0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  audioButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default BookScreen;
