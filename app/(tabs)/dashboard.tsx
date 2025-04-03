import { View } from 'react-native';
import React from 'react';
import InterText from '../../components/InterText';
import { useAuth } from "../../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const username = user?.user_metadata?.username || "User";

  return (
    <View className="flex-1 justify-center items-center bg-dark-300">
      <InterText className="text-2xl font-medium text-primary">Welcome To Dashboard {username}</InterText>
    </View>
  );
}
