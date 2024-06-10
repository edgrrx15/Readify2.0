import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import * as Progress from 'react-native-progress';

var {width, height} = Dimensions.get('window')
export default function loading() {
  return (
    <View style={{height, width}}  className='absoulte flex-row justify-center items-center'>
      <Progress.CircleSnailk thickness={12} size={140} color={{color: '#1a62d6'}}/>
    </View>
  )
}