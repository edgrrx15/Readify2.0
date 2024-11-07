import React from 'react';
import { View, TextInput, TouchableOpacity , Image} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SearchButton = () => {
    const navigation = useNavigation();
    
    return (
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
        <View  className="flex-1 px-6 pt-6 pb-3 ">
          <View className="bg-neutral-100 rounded-full border border-neutral-300 px-3 py-[12px] flex-row items-center">
            <TextInput
              placeholder="Buscar..."
              className="flex-1 text-gray-700 placeholder-gray-400 focus:outline-none pl-4"
              editable={false}
            />
             <Feather  name="search" size={20} color="#0B1215" />
          </View>
        </View>
      </TouchableOpacity>
    );
}

export default SearchButton;
