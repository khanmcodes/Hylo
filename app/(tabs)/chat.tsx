import { View } from 'react-native'
import React from 'react'
import InterText from '../../components/InterText'

const chat = () => {
  return (
    
    <View className="flex-1 justify-center items-center bg-dark-300" >
      <InterText className="text-2xl font-medium text-primary">Hylo Chatbot</InterText>
    </View>
  )
}

export default chat