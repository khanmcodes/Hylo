// /app/(tabs)/_layout.tsx
import React, { useEffect, useState } from "react";
import { Tabs, useRouter, usePathname, Slot } from "expo-router";
import { Image, Platform, View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isWeb = Platform.OS === 'web';

  // Nav items configuration
  const navItems: AppRoute[] = [
    {
      name: 'Close',
      route: "",  // No route for close button
      icon: 'x',
    },
    {
      name: 'Profile',
      route: "/(tabs)/profile",
      icon: 'user',
    },
    {
      name: 'Compass',
      route: "/(tabs)/explore",
      icon: 'compass',
    },
    {
      name: 'Awards',
      route: "/(tabs)/accolades",
      icon: 'award',
    },
    {
      name: 'Bookmarks',
      route: "/(tabs)/bookmarks",
      icon: 'heart',
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Navbar component - positioned left on web, right on mobile
  const SideNavbar = () => {
    // For web, keep the left sidebar behavior
    if (isWeb) {
      return (
        <View style={[
          styles.sideNavbar,
          styles.leftNavbar
        ]}>
          <NavbarContent />
        </View>
      );
    }
    
    // For mobile, show hamburger menu button and collapsible right sidebar
    return (
      <>
        {/* Hamburger menu button on the top right */}
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={toggleMenu}
        >
          <Icon name="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        {/* Collapsible sidebar */}
        {isMenuOpen && (
          <View style={[
            styles.sideNavbar,
            styles.rightNavbar,
          ]}>
            <NavbarContent />
          </View>
        )}
      </>
    );
  };

  // Content of the navbar (used in both mobile and web versions)
  const NavbarContent = () => (
    <View style={{ 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      paddingVertical: 32,
      gap: 32,
      height: '100%'
    }}>
      {navItems.map((item, index) => {
        const isActive = item.route && pathname === item.route;
        const isCloseButton = index === 0 && !isWeb;
        
        // Handle close button separately
        if (isCloseButton) {
          return (
            <TouchableOpacity
              key={item.name}
              style={styles.navItemContainer}
              onPress={toggleMenu}
            >
              <View style={styles.navIconContainer}>
                <Icon
                  name={item.icon}
                  size={24}
                  color="#FFFFFF"
                />
              </View>
            </TouchableOpacity>
          );
        }
        
        // Skip close button on web
        if (index === 0 && isWeb) {
          return null;
        }

        return (
          <TouchableOpacity
            key={item.name}
            style={[
              styles.navItemContainer,
              isActive && styles.activeNavItem
            ]}
            onPress={() => {
              if (item.route) {
                router.push(item.route as any);
                if (!isWeb) setIsMenuOpen(false); // Close menu after selection on mobile
              }
            }}
          >
            <View style={[
              styles.navIconContainer,
              isActive && styles.activeIconContainer
            ]}>
              <Icon
                name={item.icon}
                size={24}
                color={isActive ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
            
            {isActive && (
              <View style={[
                styles.highlightOverlay
              ]} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Render Side Navbar */}
      <SideNavbar />
      
      <View style={isWeb ? { flex: 1, marginLeft: 70 } : { flex: 1 }}>
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
                elevation: 5,
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

          {/* Add screens for navbar routes */}
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

// Create platform-specific shadow styles to avoid warnings
const createShadowStyle = (direction = 'right') => {
  if (Platform.OS === 'web') {
    return {
      boxShadow: direction === 'right' 
        ? '4px 0 24px rgba(0, 0, 0, 0.1)' 
        : '-4px 0 24px rgba(0, 0, 0, 0.1)'
    };
  } else {
    return {
      elevation: 5,
    };
  }
};

const createMenuButtonShadow = () => {
  if (Platform.OS === 'web') {
    return {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)'
    };
  } else {
    return {
      elevation: 5
    };
  }
};

const styles = StyleSheet.create({
  sideNavbar: {
    width: 70,
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: "#161616",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 50,
  },
  leftNavbar: {
    left: 0,
    ...createShadowStyle('right')
  },
  rightNavbar: {
    right: 0,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: 'hidden',
    ...createShadowStyle('left')
  },
  menuButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 100,
    backgroundColor: '#161616',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...createMenuButtonShadow()
  },
  navItemContainer: {
    position: "relative",
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  navIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'transparent',
  },
  activeIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeNavItem: {
    position: 'relative',
  },
  highlightOverlay: {
    position: 'absolute',
    bottom: 0,
    width: 70,
    height: 70,
    backgroundColor: 'rgba(249, 168, 37, 0.2)',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
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