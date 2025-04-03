import { View } from 'react-native'
import React from 'react'
import InterText from '../../components/InterText'

const continue_course = () => {
  return (
    <View className="flex-1 justify-center items-center bg-dark-300" >
      <InterText className="text-2xl font-medium text-primary">Continue Course</InterText>
    </View>
  )
}

export default continue_course