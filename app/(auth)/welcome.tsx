import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';

export default function WelcomePage() {
  return (
    <View className="flex-1 bg-dark-300">
      <View className="flex-1 justify-center items-center px-4 sm:px-6 md:px-8 lg:px-12">
        <Image 
          source={require('../../assets/images/logo.png')}
          className="w-[180px] sm:w-[320px] md:w-[400px] lg:w-[480px] h-[119px] sm:h-[136px] md:h-[170px] lg:h-[204px] sm:mb-8 md:mb-10"
          resizeMode="contain"
        />
        <Text className="text-base sm:text-lg md:text-lg text-gray-300 text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 max-w-[90%] sm:max-w-[80%] md:max-w-[70%]">
          Revolutionizing the way you learn
        </Text>
        
        <View className="w-full max-w-[400px] space-y-3 sm:space-y-4">
          <Link href="/login" asChild>
            <TouchableOpacity className="bg-primary py-3 sm:py-3 px-6 rounded-xl mb-3 sm:mb-0">
              <Text className="text-white text-center text-base sm:text-lg md:text-xl font-semibold">
                Login
              </Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/signup" asChild>
            <TouchableOpacity className="bg-dark-200 py-3 sm:py-3 px-6 rounded-xl border border-primary">
              <Text className="text-primary text-center text-base sm:text-lg md:text-xl font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
} 