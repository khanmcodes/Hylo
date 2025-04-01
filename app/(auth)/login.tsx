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
    router.replace('/(tabs)/dashboard');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-black"
    >
      <View className="flex-1 items-center justify-center p-4">
        <Image
          source={require('../../assets/images/icon.png')}
          className="absolute top-1/2 right-0 w-screen h-screen opacity-20 sm:opacity-20 lg:opacity-70 -translate-y-1/2"
          style={{ transform: [{ scale: 3 }, { translateY: -50 }] }}
          blurRadius={10}
          resizeMode='cover'
        />
        <View className="w-full max-w-[1200px] bg-transparent lg:bg-[#161616] rounded-2xl p-6 sm:p-8 md:p-10">
          <View className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Logo Section */}
            <View className="w-full lg:w-1/2 flex items-center justify-center">
              <Image
                source={require('../../assets/images/logo.png')}
                className="w-[180px] sm:w-[320px] md:w-[400px] lg:w-[580px] h-[119px] sm:h-[136px] md:h-[170px] lg:h-[304px] sm:mb-8 md:mb-10"
                resizeMode="contain"
              />
              <Text className='text-white sm:text-lg md:text-2xl font-gochi-hand text-center'>
              Back at it  –  Let's Keep Learning!
              </Text>
            </View>

            {/* Form Section */}
            <View className="w-full lg:w-1/2 max-w-[400px] bg-[#0D0D0D] p-6 sm:p-8 md:p-10 rounded-2xl">

              <View className="space-y-4 sm:space-y-3">
                {/* Email Input */}
                <View className="flex-row items-center bg-dark-200 rounded-lg px-4 mb-3 lg:mb-0">
                  <Feather name="mail" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 bg-dark-200 text-white sm:text-lg px-3 py-5 mx-3"
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
                    className="flex-1 text-white sm:text-lg px-3 py-5 mx-3"
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
                  className="bg-primary py-3 sm:py-4 rounded-xl mt-6"
                  onPress={handleLogin}
                >
                  <Text className="text-white text-center text-base sm:text-lg md:text-xl font-semibold">
                    Login
                  </Text>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View className="flex-row justify-center lg:justify-start mt-6">
                  <Text className="text-gray-300 text-sm sm:text-base">
                    Don't have an account?{' '}
                  </Text>
                  <Link href="/(auth)/signup" asChild>
                    <TouchableOpacity>
                      <Text className="text-primary font-semibold text-sm sm:text-base">
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </Link>
                </View>

                {/* Social Login */}
                <View className="mt-6">
                  <View className="flex-row items-center">
                    <View className="flex-1 h-[1px] bg-gray-700" />
                    <Text className="text-gray-400 mx-4">or continue with</Text>
                    <View className="flex-1 h-[1px] bg-gray-700" />
                  </View>
                  
                  <View className="flex-row justify-center space-x-4 mt-4">
                    <TouchableOpacity className="w-12 h-12 lg:w-10 lg:h-10 bg-dark-200 rounded-full items-center justify-center">   
                      <Image
                        source={require('../../assets/images/google.png')}
                        className="w-6 h-6 lg:w-4 lg:h-4"
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity className="w-12 h-12 lg:w-10 lg:h-10 bg-dark-200 rounded-full items-center justify-center">
                      <Image
                        source={require('../../assets/images/apple.png')}
                        className="w-6 h-6 lg:w-4 lg:h-4"
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
