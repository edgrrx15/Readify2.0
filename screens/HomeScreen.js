import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Text,
  Platform,
} from 'react-native';
import Category from '../components/Category';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Navbar from '../components/navbar';
import FavoriteList from '../components/FavoriteList';
import TrendingBooks from '../components/TrendingBooks';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  // Estado para controlar cuándo se deben volver a cargar los componentes
  const [refreshKey, setRefreshKey] = useState(0);

  // useEffect para configuración inicial
  useEffect(() => {
    // Configurar la barra de estado
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
  }, []);

  // Actualizar la pantalla cuando se vuelve a enfocar
  useFocusEffect(
    React.useCallback(() => {
      // Cuando la pantalla vuelve a recibir el foco, podríamos querer actualizar el estado
      // Por ejemplo, para refrescar favoritos si se han añadido/eliminado en otra pantalla
      setRefreshKey(prevKey => prevKey + 1);
      return () => {
        // Cleanup si es necesario
      };
    }, [])
  );

  // Manejar la acción de "pull to refresh"
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      // Incrementar la key para forzar el re-render de los componentes hijos
      setRefreshKey(prevKey => prevKey + 1);
      // Simular tiempo de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error al refrescar:', error);
      setError('Error al cargar los datos. Desliza hacia abajo para volver a intentarlo.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      <LinearGradient
        colors={['#2b2b2b', '#252526', '#2b2b2b']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingBottom: 100,  // Espacio adicional al final para evitar que el contenido se corte
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0 // Ajuste para Android
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#ffffff']}
              tintColor="#ffffff"
              title="Cargando..."
              titleColor="#ffffff"
            />
          }
        >
          {error ? (
            <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#ff4040', textAlign: 'center' }}>{error}</Text>
            </View>
          ) : (
            <>
              {/* Pasamos refreshKey a los componentes para forzar su actualización */}
              <TrendingBooks key={`trending-${refreshKey}`} />
              <Category key={`category-${refreshKey}`} />
              <FavoriteList key={`favorites-${refreshKey}`} />
            </>
          )}
        </ScrollView>
      </SafeAreaView>

    </View>
  );
}