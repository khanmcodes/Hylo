import { useEffect } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

// This component handles the redirect from OAuth providers
export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    // Handle the OAuth callback
    const handleOAuthCallback = async () => {
      try {
        // The access_token and refresh_token are in the URL params
        // Supabase client will handle setting the session
        if (params.access_token) {
          const { error } = await supabase.auth.setSession({
            access_token: params.access_token as string,
            refresh_token: params.refresh_token as string,
          });

          if (error) throw error;
        }

        // Redirect to the dashboard
        router.replace("/(tabs)/dashboard");
      } catch (error) {
        console.error("Error handling OAuth callback:", error);
        router.replace("/(auth)/login");
      }
    };

    handleOAuthCallback();
  }, [params, router]);

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-white text-lg">Completing login...</Text>
    </View>
  );
}
