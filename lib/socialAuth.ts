import { supabase } from "./supabase";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Get the URL for the current environment
const getURL = () => {
  // For development on localhost
  if (__DEV__) {
    if (Platform.OS === "android") {
      return (
        Constants.expoConfig?.extra?.androidScheme + "://" ||
        "exp://localhost:19000"
      );
    } else {
      return "exp://localhost:19000";
    }
  } else {
    // For production
    return Constants.expoConfig?.extra?.scheme + "://" || "hylo://";
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const redirectUrl = getURL() + "/auth/callback";
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    if (data?.url) {
      // Open the browser for authentication
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );

      if (result.type === "success") {
        // Extract the access token from the URL
        const url = result.url;
        if (url) {
          // The session will be automatically updated by the onAuthStateChange listener
          return { success: true, error: null };
        }
      }
    }

    return { success: false, error: "Could not authenticate with Google" };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    return { success: false, error };
  }
};

// Sign in with Apple
export const signInWithApple = async () => {
  try {
    const redirectUrl = getURL() + "/auth/callback";
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    if (data?.url) {
      // Open the browser for authentication
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );

      if (result.type === "success") {
        // The session will be automatically updated by the onAuthStateChange listener
        return { success: true, error: null };
      }
    }

    return { success: false, error: "Could not authenticate with Apple" };
  } catch (error) {
    console.error("Error signing in with Apple:", error);
    return { success: false, error };
  }
};
