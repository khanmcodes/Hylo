import { View, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import InterText from "../../components/InterText";
import { useAuth } from "../../contexts/AuthContext";
import ShortcutCard, { ShortcutType } from "../../components/ShortcutCard";
import CreateShortcutModal from "../../components/CreateShortcutModal";

interface Shortcut {
  id: string;
  type: ShortcutType;
  title: string;
  content: string;
  emoji: string;
  color: string;
  isSet: boolean;
}

export default function Dashboard() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.username;
  const profilePicture = user?.user_metadata?.avatar_url;
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([
    {
      id: '1',
      type: 'link' as ShortcutType,
      title: 'Google',
      content: 'https://google.com',
      emoji: '🔍',
      color: '#FF6B6B',
      isSet: true,
    },
    {
      id: '2',
      type: 'document' as ShortcutType,
      title: 'Resume',
      content: 'resume.pdf',
      emoji: '📄',
      color: '#4285F4',
      isSet: true,
    },
    {
      id: '3',
      type: 'link' as ShortcutType,
      title: 'GitHub',
      content: 'https://github.com',
      emoji: '💻',
      color: '#34C759',
      isSet: true,
    },
    {
      id: '4',
      type: 'document' as ShortcutType,
      title: 'Project',
      content: 'project.pdf',
      emoji: '📁',
      color: '#5AC8FA',
      isSet: true,
    },
  ]);

  const handleAddShortcut = (newShortcutData: Omit<Shortcut, "id" | "isSet">) => {
    const newShortcut: Shortcut = {
      ...newShortcutData,
      id: Date.now().toString(),
      isSet: true,
    };
    setShortcuts([...shortcuts, newShortcut]);
    setIsCreateModalVisible(false);
  };
  
  const handleSetShortcut = (newShortcutData: Omit<Shortcut, "id" | "isSet">) => {
    const unsetIndex = shortcuts.findIndex(s => !s.isSet);
    let updatedShortcuts;

    if (unsetIndex !== -1) {
        updatedShortcuts = shortcuts.map((shortcut, index) => 
            index === unsetIndex 
            ? { ...newShortcutData, id: shortcut.id, isSet: true }
            : shortcut
        );
    } else {
        const newShortcut: Shortcut = {
            ...newShortcutData,
            id: Date.now().toString(), 
            isSet: true,
        };
        updatedShortcuts = [...shortcuts, newShortcut]; 
    }
    
    setShortcuts(updatedShortcuts);
    setIsCreateModalVisible(false);
  };

  const handleResetShortcut = (shortcutId: string) => {
    setShortcuts(
      shortcuts.map((shortcut) =>
        shortcut.id === shortcutId
          ? {
              ...shortcut,
              isSet: false,
              content: "",
              title: "",
              emoji: "➕",
              color: "#292929",
            }
          : shortcut
      )
    );
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
                  } else if (shortcut.type === 'document') {
                    // Handle document
                    console.log('Opening document:', shortcut.content);
                  }
                }}
                onEdit={() => {
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
        }}
        onSave={handleSetShortcut}
      />
    </ScrollView>
  );
}