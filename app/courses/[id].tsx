import { View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const movie_details = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Protect course details - redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      // User is not authenticated, redirect to login
      router.replace("/(auth)/login");
    }
  }, [user, loading, router]);

  // Don't render anything while checking authentication
  if (loading || !user) {
    return null;
  }
  return (
    <View>
      <Text>movie_details</Text>
    </View>
  );
};

export default movie_details;
