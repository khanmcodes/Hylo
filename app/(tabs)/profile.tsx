import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import InterText from "../../components/InterText";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import { User } from "@supabase/supabase-js";

type ProfileData = {
  full_name: string;
  username: string;
  role: string;
  email: string;
  bio: string;
  avatar_url: string;
  website: string;
  github: string;
  twitter: string;
  theme_preference: "light" | "dark" | "system";
};

type UserProfile = {
  id: string;
  full_name: string;
  username: string;
  role: string;
  email: string;
  bio: string;
  avatar_url: string;
  website: string;
  github: string;
  twitter: string;
  theme_preference: "light" | "dark" | "system";
  created_at: string;
  updated_at: string;
};

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    full_name: "",
    username: "",
    role: "",
    email: user?.email || "",
    bio: "",
    avatar_url: "",
    website: "",
    github: "",
    twitter: "",
    theme_preference: "system",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      if (data) {
        const userProfile = data as UserProfile;
        setProfile({
          full_name: userProfile.full_name || "",
          username: userProfile.username || "",
          email: userProfile.email || user?.email || "",
          bio: userProfile.bio || "",
          role: userProfile.role || "",
          avatar_url: userProfile.avatar_url || "",
          website: userProfile.website || "",
          github: userProfile.github || "",
          twitter: userProfile.twitter || "",
          theme_preference: userProfile.theme_preference || "system",
        });
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant camera roll permissions to upload images"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setSaving(true);
        const base64 = result.assets[0].base64;
        const fileExt = result.assets[0].uri.split(".").pop();
        const fileName = `profile.${fileExt}`;
        const folderPath = `${user?.id}/`;
        const filePath = `${folderPath}${fileName}`;

        // Convert base64 to blob
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: `image/${fileExt}` });

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("User Avatar Images")
          .upload(filePath, blob, {
            contentType: `image/${fileExt}`,
            upsert: true,
            cacheControl: "3600",
          });

        if (uploadError) {
          // If folder doesn't exist, try creating it by uploading a dummy file
          if (uploadError.message.includes("not found")) {
            const dummyPath = `${folderPath}.keep`;
            await supabase.storage
              .from("User Avatar Images")
              .upload(dummyPath, new Blob([""], { type: "text/plain" }), {
                contentType: "text/plain",
                upsert: true,
              });

            // Retry the original upload
            const { error: retryError } = await supabase.storage
              .from("User Avatar Images")
              .upload(filePath, blob, {
                contentType: `image/${fileExt}`,
                upsert: true,
                cacheControl: "3600",
              });

            if (retryError) throw retryError;
          } else {
            throw uploadError;
          }
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("User Avatar Images").getPublicUrl(filePath);

        // Update profile with new avatar URL
        const { error: updateError } = await supabase
          .from("users")
          .update({
            avatar_url: publicUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user?.id);

        if (updateError) throw updateError;

        setProfile((prev) => ({ ...prev, avatar_url: publicUrl }));
        Alert.alert("Success", "Profile picture updated successfully");
      }
    } catch (error) {
      console.error("Error in handleImagePick:", error);
      Alert.alert(
        "Error",
        "Failed to update profile picture. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Ensure email is not null
      if (!profile.email) {
        throw new Error("Email is required");
      }

      const { error } = await supabase.from("users").upsert(
        {
          id: user?.id,
          email: profile.email,
          full_name: profile.full_name,
          username: profile.username,
          bio: profile.bio,
          website: profile.website,
          role: profile.role,
          github: profile.github,
          twitter: profile.twitter,
          theme_preference: profile.theme_preference,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        }
      );

      if (error) throw error;
      Alert.alert("Success", "Profile updated successfully");
    } catch (error: any) {
      console.error("Error in handleSave:", error);
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-dark-300 items-center justify-center">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-dark-300"
      contentContainerStyle={{ padding: Platform.OS === "web" ? 24 : 16 }}
    >
      <View className="max-w-2xl mx-auto w-full">
        <View className="items-center mb-8">
          <TouchableOpacity
            onPress={handleImagePick}
            className="relative"
            disabled={saving}
          >
            <Image
              source={
                profile.avatar_url
                  ? { uri: profile.avatar_url }
                  : require("../../assets/images/icons/profile48.png")
              }
              className="w-32 h-32 rounded-full"
            />
            <View className="absolute bottom-0 right-0 bg-primary rounded-full p-2">
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="space-y-6">
          <View>
            <InterText className="text-white mb-2 text-base">
              Full Name
            </InterText>
            <TextInput
              className="bg-dark-400 text-white p-4 rounded-lg text-base"
              value={profile.full_name}
              onChangeText={(text) =>
                setProfile((prev) => ({ ...prev, full_name: text }))
              }
              placeholder="Enter your full name"
              placeholderTextColor="#666"
            />
          </View>

          <View>
            <InterText className="text-white mb-2 text-base">
              Username
            </InterText>
            <TextInput
              className="bg-dark-400 text-white p-4 rounded-lg text-base"
              value={profile.username}
              onChangeText={(text) =>
                setProfile((prev) => ({ ...prev, username: text }))
              }
              placeholder="Enter your username"
              placeholderTextColor="#666"
            />
          </View>

          <View>
            <InterText className="text-white mb-2 text-base">Email</InterText>
            <TextInput
              className="bg-dark-400 text-white p-4 rounded-lg text-base"
              value={profile.email}
              onChangeText={(text) =>
                setProfile((prev) => ({ ...prev, email: text }))
              }
              placeholder="Enter your email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <InterText className="text-white mb-2 text-base">Bio</InterText>
            <TextInput
              className="bg-dark-400 text-white p-4 rounded-lg text-base h-32"
              value={profile.bio}
              onChangeText={(text) =>
                setProfile((prev) => ({ ...prev, bio: text }))
              }
              placeholder="Tell us about yourself"
              placeholderTextColor="#666"
              multiline
              textAlignVertical="top"
            />
          </View>

          <View>
            <InterText className="text-white mb-2 text-base">Website</InterText>
            <TextInput
              className="bg-dark-400 text-white p-4 rounded-lg text-base"
              value={profile.website}
              onChangeText={(text) =>
                setProfile((prev) => ({ ...prev, website: text }))
              }
              placeholder="https://your-website.com"
              placeholderTextColor="#666"
            />
          </View>

          <View>
            <InterText className="text-white mb-2 text-base">GitHub</InterText>
            <TextInput
              className="bg-dark-400 text-white p-4 rounded-lg text-base"
              value={profile.github}
              onChangeText={(text) =>
                setProfile((prev) => ({ ...prev, github: text }))
              }
              placeholder="https://github.com/username"
              placeholderTextColor="#666"
            />
          </View>

          <View>
            <InterText className="text-white mb-2 text-base">Twitter</InterText>
            <TextInput
              className="bg-dark-400 text-white p-4 rounded-lg text-base"
              value={profile.twitter}
              onChangeText={(text) =>
                setProfile((prev) => ({ ...prev, twitter: text }))
              }
              placeholder="https://twitter.com/username"
              placeholderTextColor="#666"
            />
          </View>

          <View>
            <InterText className="text-white mb-2 text-base">
              Theme Preference
            </InterText>
            <View className="flex-row space-x-4">
              {(["light", "dark", "system"] as const).map((theme) => (
                <TouchableOpacity
                  key={theme}
                  className={`flex-1 p-4 rounded-lg ${
                    profile.theme_preference === theme
                      ? "bg-primary"
                      : "bg-dark-400"
                  }`}
                  onPress={() =>
                    setProfile((prev) => ({ ...prev, theme_preference: theme }))
                  }
                >
                  <InterText
                    className={`text-center text-base ${
                      profile.theme_preference === theme
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </InterText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            className="bg-primary p-4 rounded-lg mt-8"
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <InterText className="text-white text-center text-base font-medium">
                Save Changes
              </InterText>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
