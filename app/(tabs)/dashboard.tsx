import { View, Image, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";
import InterText from "../../components/InterText";
import { useAuth } from "../../contexts/AuthContext";
import ShortcutCard, { ShortcutType } from "../../components/ShortcutCard";
import CreateShortcutModal from "../../components/CreateShortcutModal";
import { Ionicons } from "@expo/vector-icons";

interface Shortcut {
  id: string;
  type: ShortcutType;
  title: string;
  content: string;
  emoji: string;
  color: [string, string];
  isSet: boolean;
}

export default function Dashboard() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.username;
  const profilePicture = user?.user_metadata?.avatar_url;
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedShortcut, setSelectedShortcut] = useState<Shortcut | null>(null);
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([
    {
      id: '1',
      type: 'link' as ShortcutType,
      title: 'Google',
      content: 'https://google.com',
      emoji: '🔍',
      color: ['#4285F4', '#4285F4'] as [string, string],
      isSet: true,
    },
    {
      id: '2',
      type: 'document' as ShortcutType,
      title: 'Resume',
      content: 'resume.pdf',
      emoji: '📄',
      color: ['#FF6B6B', '#FF8E8E'] as [string, string],
      isSet: true,
    },
    {
      id: '3',
      type: 'todo' as ShortcutType,
      title: 'Shopping',
      content: 'Buy groceries',
      emoji: '🛒',
      color: ['#4ECDC4', '#45B7AF'] as [string, string],
      isSet: true,
    },
    {
      id: '4',
      type: 'notes' as ShortcutType,
      title: 'Ideas',
      content: 'Project ideas',
      emoji: '💡',
      color: ['#FFD166', '#FFB700'] as [string, string],
      isSet: true,
    },
  ]);

  const handleCreateShortcut = (newShortcut: Omit<Shortcut, 'id' | 'isSet'>) => {
    const updatedShortcuts = [...shortcuts];
    const index = selectedShortcut ? shortcuts.findIndex(s => s.id === selectedShortcut.id) : -1;
    
    if (index !== -1) {
      // Update existing shortcut
      updatedShortcuts[index] = {
        ...updatedShortcuts[index],
        ...newShortcut,
        isSet: true,
      };
    } else {
      // Add new shortcut
      updatedShortcuts.push({
        ...newShortcut,
        id: Date.now().toString(),
        isSet: true,
      });
    }
    
    setShortcuts(updatedShortcuts);
    setSelectedShortcut(null);
    setIsCreateModalVisible(false);
  };

  const handleResetShortcut = (shortcutId: string) => {
    setShortcuts(shortcuts.map(shortcut => 
      shortcut.id === shortcutId ? { ...shortcut, isSet: false, content: '', title: '', emoji: '➕', color: ['#333', '#292929'] as [string, string] } : shortcut
    ));
  };

  return (
    <ScrollView className="flex-1 bg-dark-300">
      <View className="flex-1 flex-col sm:flex-row px-6 sm:px-56 py-28">
        {/* Greeting Section */}
        <View className="mb-8">
          <InterText className="text-xl font-medium text-white mb-3">
            Hey,
          </InterText>
          <View className="flex-row items-center w-fit gap-2 mb-3">
            <View className="border-2 border-primary rounded-full w-fit p-0.5">
              <Image
                source={{ uri: profilePicture }}
                defaultSource={require("../../assets/images/icons/profile48.png")}
                className="rounded-full"
                style={{ width: 35, height: 35 }}
              />
            </View>
            <InterText className="text-2xl font-medium text-white">
              {displayName}
            </InterText>
          </View>
          <View className="flex-row items-center gap-2">
            <InterText className="text-lg font-medium text-gray-500">
              Ready to continue learning?
            </InterText>
          </View>
        </View>

        {/* Shortcuts Section */}
        <View className="mb-8">
          <View className="flex flex-wrap flex-row w-full">
            {shortcuts.map((shortcut) => (
              <ShortcutCard
                key={shortcut.id}
                title={shortcut.title}
                emoji={shortcut.emoji}
                color={shortcut.color}
                type={shortcut.type}
                isSet={shortcut.isSet}
                content={shortcut.content}
                onPress={() => {
                  if (shortcut.type === 'link' && shortcut.content) {
                    window.open(shortcut.content, '_blank');
                  } else if (shortcut.type === 'todo') {
                    // Handle todo list
                    console.log('Opening todo list:', shortcut.content);
                  } else if (shortcut.type === 'notes') {
                    // Handle notes
                    console.log('Opening notes:', shortcut.content);
                  } else if (shortcut.type === 'document') {
                    // Handle document
                    console.log('Opening document:', shortcut.content);
                  }
                }}
                onEdit={() => {
                  setSelectedShortcut(shortcut);
                  setIsCreateModalVisible(true);
                }}
                onReset={() => handleResetShortcut(shortcut.id)}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Create Shortcut Modal */}
      <CreateShortcutModal
        visible={isCreateModalVisible}
        onClose={() => {
          setIsCreateModalVisible(false);
          setSelectedShortcut(null);
        }}
        onSave={handleCreateShortcut}
        initialData={selectedShortcut}
      />
    </ScrollView>
  );
}