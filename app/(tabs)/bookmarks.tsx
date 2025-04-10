import { View } from 'react-native';
import InterText from '../../components/InterText';

export default function Bookmarks() {
  return (
    <View className="flex-1 bg-dark-300 p-4">
      <InterText className="text-2xl font-medium text-white">Bookmarks</InterText>
      {/* Add bookmarks content here */}
    </View>
  );
} 