import { Text, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const username = user?.user_metadata?.username || "User";

  return (
    <View className="flex-1 justify-center items-center bg-dark-300">
      <Text className="text-2xl font-medium text-primary font-sans">
        {" "}
        Welcome To Dashboard {username}
      </Text>
    </View>
  );
}
