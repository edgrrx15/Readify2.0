import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import PromptChat from '../components/PromptChat';

export default function IaScreen() {
  const [input, setInput] = useState('');

 
  return (
    <SafeAreaView className="flex-1 bg-black">
     <PromptChat/>
    </SafeAreaView>
  );
}
