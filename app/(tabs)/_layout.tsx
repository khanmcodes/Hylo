// /app/(tabs)/_layout.tsx
import React, { useEffect } from "react";
import { Tabs, useRouter, usePathname, Slot } from "expo-router";
import { Image, Platform, View, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import Icon from 'react-native-vector-icons/Feather';

const _Layout = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Left navbar items configuration - Fixed case sensitivity
  const leftNavItems = [
    {
      name: 'Accolades',
      route: '/(LeftNavBar)/accolades',
      icon: 'award',
    },
    {
      name: 'Bookmarks',
      route: '/(LeftNavBar)/bookmarks',
      icon: 'bookmark',
    },
    {
      name: 'Explore',
      route: '/(LeftNavBar)/explore',
      icon: 'compass',
    },
    {
      name: 'Profile',
      route: '/(LeftNavBar)/profile',
      icon: 'user',
    },
    {
      name: 'Settings',
      route: '/(LeftNavBar)/settings',
      icon: 'settings',
    },
  ];

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

  // Only render the navigation if authenticated
  if (!user) {
    return null;
  }

  // Check if current route is from LeftNavBar
  const isLeftNavRoute = pathname.includes('(LeftNavBar)');
  
  // Left navbar component
  const LeftNavbar = () => (
    <View style={[
      styles.leftNavbar,
      {
        width: 70,
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        backgroundColor: "#161616",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }
    ]}>
      <View style={{ 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        paddingVertical: 32,
        gap: 32
      }}>
        {leftNavItems.map((item) => {
          const isActive = pathname.includes(item.route);
          
          return (
            <TouchableOpacity
              key={item.name}
              style={{ position: "relative", alignItems: "center", justifyContent: "center" }}
              onPress={() => {
                console.log("Navigating to:", item.route); // Debug log
                router.push(item.route);
              }}
            >
              <View style={{ alignItems: "center", justifyContent: "center", width: 40, height: 40 }}>
                <Icon
                  name={item.icon}
                  size={24}
                  color={isActive ? '#FFFFFF' : '#9CA3AF'}
                />
              </View>
              
              {isActive && (
                <View style={[
                  styles.activeIndicator,
                  { right: -12 }
                ]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // If the path is a LeftNavBar route, we'll render just the left navbar + content
  if (isLeftNavRoute) {
    return (
      <View style={{ flex: 1 }}>
        <LeftNavbar />
        <View style={{ flex: 1, marginLeft: 70 }}>
          <Slot />
        </View>
      </View>
    );
  }

  // Otherwise, render the full tabs layout
  return (
    <View style={{ flex: 1 }}>
      {/* Render Left Navbar */}
      <LeftNavbar />
      
      {/* Render Bottom Tabs */}
      <Tabs
        screenOptions={{
          tabBarStyle: Platform.select({
            web: {
              backgroundColor: "#161616",
              borderTopWidth: 0,
              paddingBottom: 8,
              paddingTop: 8,
              position: "absolute",
              bottom: 40,
              left: "45%",
              width: 400,
              transform: [{ translateX: -200 }],
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
              marginLeft: 70, // Offset for left navbar
            },
            default: {
              backgroundColor: "#161616",
              borderTopWidth: 0,
              paddingBottom: 8,
              paddingTop: 8,
              position: "absolute",
              bottom: 40,
              left: 90, // Offset from left edge to account for left navbar
              right: 20,
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
            },
          }),
          tabBarItemStyle: {
            paddingBottom: 6,
          },
          tabBarIcon: ({ focused }) => null,
          tabBarLabel: () => null,
          tabBarActiveTintColor: "#4A90E2",
          tabBarInactiveTintColor: "#9CA3AF",
          headerShown: false,
        }}
        sceneContainerStyle={{ 
          marginLeft: 70, // Add left margin to content to make space for left navbar
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
                    width: Platform.OS === "web" ? 40 : 34,
                    height: Platform.OS === "web" ? 40 : 34,
                  }}
                  resizeMode="contain"
                />
                {focused && (
                  <View style={styles.bottomTabIndicator} />
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
                    width: Platform.OS === "web" ? 40 : 34,
                    height: Platform.OS === "web" ? 40 : 34,
                  }}
                  resizeMode="contain"
                />
                {focused && (
                  <View style={styles.bottomTabIndicator} />
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
                    width: Platform.OS === "web" ? 40 : 34,
                    height: Platform.OS === "web" ? 40 : 34,
                  }}
                  resizeMode="contain"
                />
                {focused && (
                  <View style={styles.bottomTabIndicator} />
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
                    width: Platform.OS === "web" ? 40 : 34,
                    height: Platform.OS === "web" ? 40 : 34,
                  }}
                  resizeMode="contain"
                />
                {focused && (
                  <View style={styles.bottomTabIndicator} />
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
                    width: Platform.OS === "web" ? 40 : 34,
                    height: Platform.OS === "web" ? 40 : 34,
                  }}
                  resizeMode="contain"
                />
                {focused && (
                  <View style={styles.bottomTabIndicator} />
                )}
              </>
            ),
          }}
        />
      </Tabs>
    </View>
  );
};

const styles = StyleSheet.create({
  leftNavbar: {
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 5,
  },
  activeIndicator: {
    position: "absolute",
    width: 1,
    height: 16,
    backgroundColor: "white",
    borderRadius: 4
  },
  bottomTabIndicator: {
    width: 1,
    height: 1,
    borderRadius: 4,
    backgroundColor: "white",
    position: "absolute",
    bottom: -4
  }
});

export default _Layout;