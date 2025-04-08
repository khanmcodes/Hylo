import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// SecureStore is not available on web, so we need to use localStorage
// Also need to handle Node.js environments where localStorage doesn't exist
const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === "web") {
      // Check if we're in a browser environment where localStorage exists
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      // Return null for server-side rendering or environments without localStorage
      return null;
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === "web") {
      // Check if we're in a browser environment where localStorage exists
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === "web") {
      // Check if we're in a browser environment where localStorage exists
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};

// Initialize Supabase with your project URL and anon key from environment variables
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  Constants.expoConfig?.extra?.supabaseAnonKey;

// Ensure the environment variables are set and valid
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase URL and Anon Key must be set in environment variables or app.json"
  );
  throw new Error("Missing Supabase configuration");
}

// Validate URL before creating client
let validatedSupabaseUrl = supabaseUrl;
try {
  // Test if the URL is valid by creating a URL object
  if (supabaseUrl) {
    new URL(supabaseUrl);
  } else {
    throw new Error("supabaseUrl is required");
  }
} catch (error) {
  console.error("Invalid Supabase URL:", error);
  throw new Error("Invalid Supabase URL configuration");
}

// Ensure we have a valid URL before creating the client
if (!validatedSupabaseUrl) {
  throw new Error("supabaseUrl is required");
}

export const supabase = createClient(validatedSupabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper function to get the current user
export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return !!user;
};
