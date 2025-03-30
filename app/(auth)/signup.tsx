import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = () => {
    // TODO: Implement signup logic
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
            Create an account
          </Text>

          <View className="space-y-4 sm:space-y-5">
            {/* Full Name Input */}
            <View className="flex-row items-center bg-dark-200 rounded-lg px-4 mb-3">
              <Feather name="user" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 text-white text-base sm:text-lg px-3 py-4"
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            {/* Username Input */}
            <View className="flex-row items-center bg-dark-200 rounded-lg px-4 mb-3">
              <Feather name="at-sign" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 text-white text-base sm:text-lg px-3 py-4"
                placeholder="Create a username"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            {/* Email Input */}
            <View className="flex-row items-center bg-dark-200 rounded-lg px-4 mb-3">
              <Feather name="mail" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 text-white text-base sm:text-lg px-3 py-4"
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            {/* Password Input */}
            <View className="flex-row items-center bg-dark-200 rounded-lg px-4 mb-3">
              <Feather name="lock" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 text-white text-base sm:text-lg px-3 py-4"
                placeholder="Create a password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View className="flex-row items-center bg-dark-200 rounded-lg px-4 mb-2">
              <Feather name="lock" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 text-white text-base sm:text-lg px-3 py-4"
                placeholder="Confirm your password"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            
            {/* Sign Up Button */}
            <TouchableOpacity 
              className="bg-primary py-3 sm:py-4 rounded-xl mt-6 sm:mt-8"
              onPress={handleSignUp}
            >
              <Text className="text-white text-center text-base sm:text-lg md:text-xl font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>
            
            {/* Login Link */}
            <View className="flex-row justify-center mt-4 sm:mt-6">
              <Text className="text-gray-300 text-sm">Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text className="text-primary font-semibold text-sm">Login</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
