// /app/(tabs)/_layout.tsx
import React, { useEffect } from "react";
import { Tabs, useRouter, usePathname, Slot } from "expo-router";
import { Image, Platform, View, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import Icon from 'react-native-vector-icons/Feather';

type AppRoute = {
  name: string;
  route: string;
  icon: string;
};

const _Layout = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Left navbar items configuration
  const leftNavItems: AppRoute[] = [
    {
      name: 'Accolades',
      route: "/(tabs)/accolades",
      icon: 'award',
    },
    {
      name: 'Bookmarks',
      route: "/(tabs)/bookmarks",
      icon: 'bookmark',
    },
    {
      name: 'Explore',
      route: "/(tabs)/explore",
      icon: 'compass',
    },
    {
      name: 'Profile',
      route: "/(tabs)/profile",
      icon: 'user',
    },
    {
      name: 'Settings',
      route: "/(tabs)/settings",
      icon: 'settings',
    },
  ];

  // Protect routes - redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/(auth)/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

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
        ...(Platform.OS === 'web' ? {
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.1)'
        } : {
          shadowColor: '#000',
          shadowOffset: {
            width: 4,
            height: 0,
          },
          shadowOpacity: 0.1,
          shadowRadius: 24,
          elevation: 5,
        })
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
          const isActive = pathname === item.route;
          
          return (
            <TouchableOpacity
              key={item.name}
              style={{ position: "relative", alignItems: "center", justifyContent: "center" }}
              onPress={() => {
                router.push(item.route as any);
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

  return (
    <View style={{ flex: 1 }}>
      {/* Render Left Navbar */}
      <LeftNavbar />
      
      <View style={{ flex: 1, marginLeft: 70 }}>
        {/* Main Content Area */}
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
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
              },
              default: {
                backgroundColor: "#161616",
                borderTopWidth: 0,
                paddingBottom: 8,
                paddingTop: 8,
                position: "absolute",
                bottom: 40,
                left: 20,
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
            tabBarIcon: ({ focused }: { focused: boolean }) => null,
            tabBarLabel: () => null,
            tabBarActiveTintColor: "#4A90E2",
            tabBarInactiveTintColor: "#9CA3AF",
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="dashboard"
            options={{
              tabBarIcon: ({ focused }: { focused: boolean }) => (
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
              tabBarIcon: ({ focused }: { focused: boolean }) => (
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
              tabBarIcon: ({ focused }: { focused: boolean }) => (
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
              tabBarIcon: ({ focused }: { focused: boolean }) => (
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
              tabBarIcon: ({ focused }: { focused: boolean }) => (
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

          {/* Add screens for left navbar routes */}
          <Tabs.Screen
            name="accolades"
            options={{ href: null }}
          />
          <Tabs.Screen
            name="bookmarks"
            options={{ href: null }}
          />
          <Tabs.Screen
            name="explore"
            options={{ href: null }}
          />
          <Tabs.Screen
            name="profile"
            options={{ href: null }}
          />
          <Tabs.Screen
            name="settings"
            options={{ href: null }}
          />
        </Tabs>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  leftNavbar: Platform.select({
    web: {
      boxShadow: '4px 0 24px rgba(0, 0, 0, 0.1)'
    },
    default: {
      shadowColor: '#000',
      shadowOffset: {
        width: 4,
        height: 0,
      },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 5,
    }
  }),
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