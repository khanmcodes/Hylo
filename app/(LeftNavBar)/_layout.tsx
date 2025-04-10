// app/(LeftNavBar)/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

export default function LeftNavBarLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}