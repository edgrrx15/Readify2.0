import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Switch,
  StyleSheet,
} from 'react-native';
import { Feather, AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const IconCircle = ({ children, backgroundColor }) => (
  <View style={[styles.iconCircle, { backgroundColor }]}>
    {children}
  </View>
);

export default function MenuScreen() {
  const navigation = useNavigation();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  const Option = ({ onPress, icon, text, switchValue, onSwitchChange }) => {
    if (switchValue !== undefined && onSwitchChange) {
      return (
        <View style={styles.optionButton}>
          {icon}
          <Text style={styles.optionText}>{text}</Text>
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#ccc', true: '#34c759' }}
            thumbColor={switchValue ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#ccc"
          />
        </View>
      );
    }
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.optionButton,
          pressed && { backgroundColor: 'rgba(255,255,255,0.07)' },
        ]}
      >
        {icon}
        <Text style={styles.optionText}>{text}</Text>
        <Feather name="chevron-right" size={20} color="#999" />
      </Pressable>
    );
  };

  return (
    <LinearGradient
      colors={['#000', '#000']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && { opacity: 0.6 },
          ]}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </Pressable>

        {/* Cuenta */}
        <Text style={styles.sectionTitle}>CUENTA</Text>

        <View style={styles.card}>
          <Option
            onPress={() => navigation.navigate('Favorite')}
            icon={
              <IconCircle backgroundColor="#FF3B30">
                <AntDesign name="hearto" size={18} color="white" />
              </IconCircle>
            }
            text="Mis libros favoritos"
          />
          <View style={styles.separator} />
          <Option
            onPress={() => navigation.navigate('History')}
            icon={
              <IconCircle backgroundColor="#007AFF">
                <MaterialIcons name="history" size={18} color="white" />
              </IconCircle>
            }
            text="Visto recientemente"
          />
        </View>

        {/* Preferencias */}
        <Text style={styles.sectionTitle}>PREFERENCIAS</Text>

        <View style={styles.card}>
          <Option
            icon={
              <IconCircle backgroundColor="#FF9500">
                <Ionicons name="notifications-outline" size={18} color="white" />
              </IconCircle>
            }
            text="Notificaciones"
            switchValue={notificationsEnabled}
            onSwitchChange={setNotificationsEnabled}
          />
          <View style={styles.separator} />
          <Option
            icon={
              <IconCircle backgroundColor="#34C759">
                <Feather name="moon" size={18} color="white" />
              </IconCircle>
            }
            text="Modo oscuro"
            switchValue={darkModeEnabled}
            onSwitchChange={setDarkModeEnabled}
          />
        </View>

        {/* Ayuda */}
        <Text style={styles.sectionTitle}>AYUDA</Text>

        <View style={styles.card}>
          <Option
            onPress={() => {}}
            icon={
              <IconCircle backgroundColor="#5856D6">
                <Feather name="help-circle" size={18} color="white" />
              </IconCircle>
            }
            text="Soporte y ayuda"
          />
          <View style={styles.separator} />
          <Option
            onPress={() => {}}
            icon={
              <IconCircle backgroundColor="#8E8E93">
                <Feather name="info" size={18} color="white" />
              </IconCircle>
            }
            text="Acerca de"
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginTop: 50,
    marginLeft: 20,
    marginBottom: 20,
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    color: '#aaa',
    fontSize: 12,
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 6,
    fontWeight: '600',
    letterSpacing: 1,
  },
  card: {
    marginHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginBottom: 25,
    overflow: 'hidden',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  optionText: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    fontWeight: '400',
    marginLeft: 12,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginHorizontal: 20,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
