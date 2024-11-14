import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const UserScreen = () => {
  return (
    <ScrollView classname="flex-1 px-6">
        <View>
            <Text>
                Usuario
            </Text>
        </View>

        <View>
          <TouchableOpacity>
            <Text>Hola</Text>
          </TouchableOpacity>
        </View>
    </ScrollView>
  )
}

export default UserScreen