import React, { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { Image, Platform, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

const _Layout = () => {
  const { user, loading } = useAuth();
  const router = useRouter();  

  // Protect all tab routes - redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      // User is not authenticated, redirect to login
      router.replace("/(auth)/login");
    }
  }, [user, loading, router]);

  // Don't render anything while checking authentication
  if (loading) {
    return null;
  }

  // Only render the tabs if authenticated
  if (!user) {
    return null;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: Platform.select({
          web: {
            backgroundColor: 'rgba(22, 22, 22, 0.7)',
            borderTopWidth: 0,
            paddingBottom: 8,
            paddingTop: 8,
            position: "absolute",
            bottom: 40,
            left: "50%",
            width: 400,
            transform: "translateX(-50%)",
            borderRadius: 16,
            height: 64,
            elevation: 0,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 24,
            shadowOffset: {
              width: 0,
              height: 4,
            },
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          default: {
            backgroundColor: 'rgba(22, 22, 22, 0.7)',
            borderTopWidth: 0,
            paddingBottom: 8,
            paddingTop: 8,
            position: "absolute",
            // bottom: 40,
            // left: 20,
            // right: 20,
            // borderRadius: 50,
            height: 90,
            elevation: 0,
            // shadowColor: "#000",
            // shadowOpacity: 0.1,
            // shadowRadius: 24,
            // shadowOffset: {
            //   width: 0,
            //   height: 4,
            // },
            borderWidth: 1,
            borderColor: '#292929',
          },
        }),
        tabBarItemStyle: {
          paddingBottom: 6,
          paddingTop: 3,
        },
        tabBarIcon: ({ focused }) => null,
        tabBarLabel: () => null,
        tabBarActiveTintColor: "#4A90E2",
        tabBarInactiveTintColor: "#9CA3AF",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <Image
                source={
                  focused
                    ? require("../../assets/images/Hylo Icons v1 (Dark) (Active)/1.png")
                    : require("../../assets/images/Hylo Icons v1 (Dark) (NOT Active)/1.png")
                }
                style={{
                  width: Platform.OS === "web" ? 40 : 30,
                  height: Platform.OS === "web" ? 40 : 30,
                }}
                resizeMode="contain"
              />
              {focused && (
                <View className="w-1 h-1 rounded-full bg-white absolute -bottom-3.5" />
              )}
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="continue_course"
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <Image
                source={
                  focused
                    ? require("../../assets/images/Hylo Icons v1 (Dark) (Active)/2.png")
                    : require("../../assets/images/Hylo Icons v1 (Dark) (NOT Active)/2.png")
                }
                style={{
                  width: Platform.OS === "web" ? 40 : 30,
                  height: Platform.OS === "web" ? 40 : 30,
                }}
                resizeMode="contain"
              />
              {focused && (
                <View className="w-1 h-1 rounded-full bg-white absolute -bottom-3.5" />
              )}
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <Image
                source={
                  focused
                    ? require("../../assets/images/Hylo Icons v1 (Dark) (Active)/3.png")
                    : require("../../assets/images/Hylo Icons v1 (Dark) (NOT Active)/3.png")
                }
                style={{
                  width: Platform.OS === "web" ? 40 : 30,
                  height: Platform.OS === "web" ? 40 : 30,
                }}
                resizeMode="contain"
              />
              {focused && (
                <View className="w-1 h-1 rounded-full bg-white absolute -bottom-3.5" />
              )}
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <Image
                source={
                  focused
                    ? require("../../assets/images/Hylo Icons v1 (Dark) (Active)/4.png")
                    : require("../../assets/images/Hylo Icons v1 (Dark) (NOT Active)/4.png")
                }
                style={{
                  width: Platform.OS === "web" ? 40 : 30,
                  height: Platform.OS === "web" ? 40 : 30,
                }}
                resizeMode="contain"
              />
              {focused && (
                <View className="w-1 h-1 rounded-full bg-white absolute -bottom-3.5" />
              )}
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="my_courses"
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <Image
                source={
                  focused
                    ? require("../../assets/images/Hylo Icons v1 (Dark) (Active)/5.png")
                    : require("../../assets/images/Hylo Icons v1 (Dark) (NOT Active)/5.png")
                }
                style={{
                  width: Platform.OS === "web" ? 40 : 30,
                  height: Platform.OS === "web" ? 40 : 30,
                }}
                resizeMode="contain"
              />
              {focused && (
                <View className="w-1 h-1 rounded-full bg-white absolute -bottom-3.5" />
              )}
            </>
          ),
        }}
      />

      {/* Hidden tabs */}
      <Tabs.Screen name="accolades" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="bookmarks" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
};

export default _Layout;
