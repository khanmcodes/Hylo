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
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
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

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const uploadImage = async (
  base64: string,
  filePath: string,
  retryCount = 0
): Promise<string> => {
  try {
    // First, try to delete the existing profile image if it exists
    try {
      const { data: existingFiles } = await supabase.storage
        .from("avatars")
        .list(filePath.substring(0, filePath.lastIndexOf("/")));

      if (existingFiles && existingFiles.length > 0) {
        const filesToDelete = existingFiles.map(
          (file) =>
            `${filePath.substring(0, filePath.lastIndexOf("/"))}/${file.name}`
        );
        await supabase.storage.from("avatars").remove(filesToDelete);
      }
    } catch (deleteError) {
      console.log(
        "No existing files to delete or error deleting:",
        deleteError
      );
    }

    // Upload the new image
    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, decode(base64), {
        contentType: "image/jpeg",
        upsert: true,
        cacheControl: "3600",
      });

    if (error) {
      if (error.message.includes("not found") && retryCount < MAX_RETRIES) {
        // Try to create the folder first
        const folderPath = filePath.substring(0, filePath.lastIndexOf("/"));
        await supabase.storage
          .from("avatars")
          .upload(`${folderPath}/.keep`, new Uint8Array(), {
            contentType: "text/plain",
            upsert: true,
          });

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return uploadImage(base64, filePath, retryCount + 1);
      }
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return uploadImage(base64, filePath, retryCount + 1);
    }
    throw error;
  }
};

export default function Profile() {
  const { user, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: "",
    username: "",
    role: "",
    email: "",
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
        setProfileData({
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

        try {
          // Compress and resize the image
          const compressedImage = await manipulateAsync(
            result.assets[0].uri,
            [{ resize: { width: 500 } }],
            {
              compress: 0.7,
              format: SaveFormat.JPEG,
              base64: true,
            }
          );

          if (!compressedImage.base64) {
            throw new Error("Failed to compress image");
          }

          const filePath = `${user?.id}/profile.jpg`;

          // Delete existing avatar if it exists
          try {
            const { data: existingFiles } = await supabase.storage
              .from("avatars")
              .list(user?.id || "");

            if (existingFiles && existingFiles.length > 0) {
              await supabase.storage
                .from("avatars")
                .remove([`${user?.id}/profile.jpg`]);
            }
          } catch (deleteError) {
            console.log("No existing avatar or error deleting:", deleteError);
          }

          // Upload new image
          const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, decode(compressedImage.base64), {
              contentType: "image/jpeg",
              upsert: true,
            });

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("avatars").getPublicUrl(filePath);

          // Update profile with new avatar URL
          const { error: updateError } = await supabase
            .from("users")
            .update({
              avatar_url: publicUrl,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user?.id);

          if (updateError) throw updateError;

          setProfileData((prev) => ({ ...prev, avatar_url: publicUrl }));
          Alert.alert("Success", "Profile picture updated successfully");
        } catch (error) {
          console.error("Error in image processing:", error);
          Alert.alert("Error", "Failed to process image. Please try again.");
        }
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
      setLoading(true);
      const updates = {
        id: user?.id,
        full_name: profileData.full_name,
        username: profileData.username,
        role: profileData.role,
        bio: profileData.bio,
        website: profileData.website,
        github: profileData.github,
        twitter: profileData.twitter,
        theme_preference: profileData.theme_preference,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(updates, { onConflict: "id" });

      if (error) throw error;

      // Refresh user data throughout the app
      await refreshUserData();

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
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
                profileData.avatar_url
                  ? { uri: profileData.avatar_url }
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
              value={profileData.full_name}
              onChangeText={(text) =>
                setProfileData((prev) => ({ ...prev, full_name: text }))
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
              value={profileData.username}
              onChangeText={(text) =>
                setProfileData((prev) => ({ ...prev, username: text }))
              }
              placeholder="Enter your username"
              placeholderTextColor="#666"
            />
          </View>

          <View>
            <InterText className="text-white mb-2 text-base">Email</InterText>
            <TextInput
              className="bg-dark-400 text-white p-4 rounded-lg text-base"
              value={profileData.email}
              onChangeText={(text) =>
                setProfileData((prev) => ({ ...prev, email: text }))
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
              value={profileData.bio}
              onChangeText={(text) =>
                setProfileData((prev) => ({ ...prev, bio: text }))
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
              value={profileData.website}
              onChangeText={(text) =>
                setProfileData((prev) => ({ ...prev, website: text }))
              }
              placeholder="https://your-website.com"
              placeholderTextColor="#666"
            />
          </View>

          <View>
            <InterText className="text-white mb-2 text-base">GitHub</InterText>
            <TextInput
              className="bg-dark-400 text-white p-4 rounded-lg text-base"
              value={profileData.github}
              onChangeText={(text) =>
                setProfileData((prev) => ({ ...prev, github: text }))
              }
              placeholder="https://github.com/username"
              placeholderTextColor="#666"
            />
          </View>

          <View>
            <InterText className="text-white mb-2 text-base">Twitter</InterText>
            <TextInput
              className="bg-dark-400 text-white p-4 rounded-lg text-base"
              value={profileData.twitter}
              onChangeText={(text) =>
                setProfileData((prev) => ({ ...prev, twitter: text }))
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
                    profileData.theme_preference === theme
                      ? "bg-primary"
                      : "bg-dark-400"
                  }`}
                  onPress={() =>
                    setProfileData((prev) => ({
                      ...prev,
                      theme_preference: theme,
                    }))
                  }
                >
                  <InterText
                    className={`text-center text-base ${
                      profileData.theme_preference === theme
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
