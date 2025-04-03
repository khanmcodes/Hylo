import { View, Image } from 'react-native';
import React from 'react';
import InterText from '../../components/InterText';
import { useAuth } from "../../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.displayName || "Khan Muhammad";
  const profilePicture = user?.user_metadata?.profilePicture || require('../../assets/images/icons/profile48.png');

  return (
    <View className="flex-1 px-44 py-28 bg-dark-300">
      <InterText className="text-xl font-medium text-white mb-3">Hey,</InterText>
      <View className="flex-row items-center w-fit gap-2  mb-3">
      <View className="border-2 border-primary rounded-full w-fit p-0.5">
        <Image 
          source={typeof profilePicture === 'string' ? { uri: profilePicture } : profilePicture}
          className="rounded-full"
          style={{ width: 35, height: 35 }}
        />
      </View>
      <InterText className="text-3xl font-medium text-white">{displayName}</InterText>
      </View>
      <View className="flex-row items-center gap-2">
        <InterText className="text-lg font-medium text-gray-500">Ready to continue learning?</InterText>
      </View>
    </View>
  );
}
