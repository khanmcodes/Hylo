import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';

export default function WelcomePage() {
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
                Revolutionizing the way you learn
              </Text>
            </View>

            {/* Buttons Section */}
            <View className="w-full lg:w-1/2 max-w-[400px] bg-transparent lg:bg-[#0D0D0D] p-6 sm:p-8 md:p-10 rounded-2xl">
              <View className="space-y-6 sm:space-y-4">
                <Link href="/login" asChild>
                  <TouchableOpacity className="bg-primary py-4 rounded-xl">
                    <Text className="text-white text-center text-base sm:text-lg md:text-xl font-semibold">
                      Login
                    </Text>
                  </TouchableOpacity>
                </Link>
                
                <Link href="/signup" asChild>
                  <TouchableOpacity className="bg-dark-200 py-4 rounded-xl border border-primary mt-4">
                    <Text className="text-primary text-center text-base sm:text-lg md:text-xl font-semibold">
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
} 