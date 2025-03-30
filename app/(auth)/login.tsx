import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // TODO: Implement login logic
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-dark-300"
    >
      <View className="flex-1 justify-center px-4 sm:px-6 md:px-8 lg:px-12 items-center">
      <Image 
          source={require('../../assets/images/icon.png')}
          className="w-[180px] sm:w-[320px] md:w-[400px] lg:w-[480px] h-[119px] sm:h-[136px] md:h-[170px] lg:h-[204px] sm:mb-8 mb-5"
          resizeMode="contain"
        />
        <View className="max-w-[400px] mx-auto w-full">
          <Text className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-6 sm:mb-8 text-center">
            Welcome Back
          </Text>
          
          <View className="space-y-4 sm:space-y-5">
            {/* Email Input */}
            <View className="flex-row items-center bg-dark-200 rounded-lg px-4 mb-3 ">
              <Feather name="mail" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 text-white sm:text-lg px-3 py-5"
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            {/* Password Input */}
            <View className="flex-row items-center bg-dark-200 rounded-lg px-4">
              <Feather name="key" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 text-white sm:text-lg px-3 py-5"
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            
            {/* Login Button */}
            <TouchableOpacity 
              className="bg-primary py-3 sm:py-4 rounded-xl mt-6 sm:mt-8"
              onPress={handleLogin}
            >
              <Text className="text-white text-center text-base sm:text-lg md:text-xl font-semibold">
                Login
              </Text>
            </TouchableOpacity>
            
            {/* Sign Up Link */}
            <View className="flex-row justify-center mt-4 sm:mt-6">
              <Text className="text-gray-300 text-sm sm:text-base">Don't have an account? </Text>
              <Link href="/(auth)/signup" asChild>
                <TouchableOpacity>
                  <Text className="text-primary font-semibold text-sm sm:text-base">Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
