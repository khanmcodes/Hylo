import React from 'react'
import { Tabs } from 'expo-router'
import { Image, Platform, View } from 'react-native'

const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#161616',
          borderTopWidth: 0,
          paddingBottom: 8,
          paddingTop: 8,
          position: 'absolute',
          bottom: 40,
          ...(Platform.OS === 'web' ? {
            left: '50%',
            width: '400px',
            transform: 'translateX(-50%)',
          } : {
            left: 20,
            right: 20,
          }),
          borderRadius: 16,
          height: 64,
          elevation: 0,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 24,
          shadowOffset: {
            width: 0,
            height: 4
          },
        },
        tabBarItemStyle: {
          paddingBottom: 6,
        },
        tabBarIcon: ({ focused }) => ({
          style: {
            width: Platform.OS === 'web' ? 40 : 34,
            height: Platform.OS === 'web' ? 40 : 34,
          }
        }),
        tabBarLabel: () => null,
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name='dashboard'
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <Image
                source={focused 
                  ? require('../../assets/images/Hylo Icons v1 (Dark) (Active)/1.png')
                  : require('../../assets/images/Hylo Icons v1 (Dark) (NOT Active)/1.png')
                }
                style={{
                  width: Platform.OS === 'web' ? 40 : 34,
                  height: Platform.OS === 'web' ? 40 : 34,
                }}
                resizeMode="contain"
              />
              {focused && (
                <View className="w-1 h-1 rounded-full bg-white absolute -bottom-4" />
              )}
            </>
          ),
        }}
      />
      <Tabs.Screen
        name='continue_course'
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <Image
                source={focused 
                  ? require('../../assets/images/Hylo Icons v1 (Dark) (Active)/2.png')
                  : require('../../assets/images/Hylo Icons v1 (Dark) (NOT Active)/2.png')
                }
                style={{
                  width: Platform.OS === 'web' ? 40 : 34,
                  height: Platform.OS === 'web' ? 40 : 34,
                }}
                resizeMode="contain"
              />
              {focused && (
                <View className="w-1 h-1 rounded-full bg-white absolute -bottom-4" />
              )}
            </>
          ),
        }}
      />
      <Tabs.Screen
        name='chat'
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <Image
                source={focused 
                  ? require('../../assets/images/Hylo Icons v1 (Dark) (Active)/3.png')
                  : require('../../assets/images/Hylo Icons v1 (Dark) (NOT Active)/3.png')
                }
                style={{
                  width: Platform.OS === 'web' ? 40 : 34,
                  height: Platform.OS === 'web' ? 40 : 34,
                }}
                resizeMode="contain"
              />
              {focused && (
                <View className="w-1 h-1 rounded-full bg-white absolute -bottom-4" />
              )}
            </>
          ),
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <Image
                source={focused 
                  ? require('../../assets/images/Hylo Icons v1 (Dark) (Active)/4.png')
                  : require('../../assets/images/Hylo Icons v1 (Dark) (NOT Active)/4.png')
                }
                style={{
                  width: Platform.OS === 'web' ? 40 : 34,
                  height: Platform.OS === 'web' ? 40 : 34,
                }}
                resizeMode="contain"
              />
              {focused && (
                <View className="w-1 h-1 rounded-full bg-white absolute -bottom-4" />
              )}
            </>
          ),
        }}
      />
      <Tabs.Screen
        name='my_courses'
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <Image
                source={focused 
                  ? require('../../assets/images/Hylo Icons v1 (Dark) (Active)/5.png')
                  : require('../../assets/images/Hylo Icons v1 (Dark) (NOT Active)/5.png')
                }
                style={{
                  width: Platform.OS === 'web' ? 40 : 34,
                  height: Platform.OS === 'web' ? 40 : 34,
                }}
                resizeMode="contain"
              />
              {focused && (
                <View className="w-1 h-1 rounded-full bg-white absolute -bottom-4" />
              )}
            </>
          ),
        }}
      />
    </Tabs>
  )
}

export default _Layout