import React from 'react'
import { Tabs } from 'expo-router'

const _Layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name='dashboard'
        options={{
          title: 'Dashboard',
          headerShown: false
        }}
      />
      <Tabs.Screen
        name='continue_course'
        options={{
          title: 'Continue',
          headerShown: false
        }}
      />
      <Tabs.Screen
        name='chat'
        options={{
          title: 'Chat',
          headerShown: false
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          title: 'Search',
          headerShown: false
        }}
      />
      <Tabs.Screen
        name='my_courses'
        options={{
          title: 'My Courses',
          headerShown: false
        }}
      />
    </Tabs>
  )
}

export default _Layout