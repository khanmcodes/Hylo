import { View } from 'react-native';
import InterText from '../../components/InterText';

export default function Profile() {
  return (
    <View className="flex-1 bg-dark-300 p-4">
      <InterText className="text-2xl font-medium text-white">Profile</InterText>
      {/* Add profile content here */}
    </View>
  );
} 