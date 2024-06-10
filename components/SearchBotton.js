import React from 'react';
import { View, TextInput, TouchableOpacity , Image} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SearchButton = () => {
    const navigation = useNavigation();
    
    return (
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
        <View className="mx-8 my-6">
          <View className="bg-input rounded-full border border-neutral-200 p-2 flex-row items-center">
            <Feather name="search" size={20} color="#0B1215" />
            <TextInput
              placeholder="Buscar libro"
              className="flex-1 text-gray-700 placeholder-gray-400 focus:outline-none pl-4"
              editable={false}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
}

export default SearchButton;
