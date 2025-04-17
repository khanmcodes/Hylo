import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Pressable, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import InterText from './InterText';
import Feather from 'react-native-vector-icons/Feather';
import { BlurView } from 'expo-blur';

export type ShortcutType = 'link' | 'document' | 'todo' | 'notes';

interface ShortcutCardProps {
  title: string;
  emoji: string;
  color: [string, string];
  type: ShortcutType;
  isSet: boolean;
  content?: string;
  onPress: () => void;
  onEdit: () => void;
  onReset: () => void;
}

const ShortcutCard: React.FC<ShortcutCardProps> = ({
  title,
  emoji,
  color,
  type,
  isSet,
  content,
  onPress,
  onEdit,
  onReset,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const isWeb = Platform.OS === 'web';
  const isTablet = Dimensions.get('window').width > 768;

  const handleLongPress = () => {
    if (!isWeb) {
      setShowMenu(true);
    }
  };

  const handlePress = () => {
    if (isSet) {
      onPress();
    } else {
      setShowActionModal(true);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={handleLongPress}
        className="w-[50%] p-1 sm:p-3 rounded-xl"
      >
        <LinearGradient
          colors={isSet ? color : [color[0], '#292929']}
          locations={[0, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          className="py-2 px-4 rounded-xl justify-items-start"
          style={{
            borderRadius: 14,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: '#292929',
          }}
        >
          
          <View className='flex flex-row justify-between'>
            <View className='flex'>
              <InterText className="text-4xl text-white">{emoji}</InterText>
              <InterText className="text-lg font-medium text-white mt-2">
                {title}
              </InterText>
              {!isSet && (
                <InterText className="text-xs text-gray-400 mt-1 font-medium">
                  Tap to set shortcut
                </InterText>
              )}
            </View>
            {isWeb && (
              <Pressable
                onPress={() => setShowMenu(true)}
                className="rounded-full hover:bg-white/10 p-2"
              >
                <Feather name="more-vertical" size={20} color="white" />
              </Pressable>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Menu Modal */}
      <Modal visible={showMenu} transparent animationType="fade">
        <BlurView intensity={30} tint="dark" className="absolute inset-0 flex items-center justify-center">
          <View className="bg-dark-200 p-4 rounded-xl w-11/12 max-w-md">
            <Pressable
              onPress={() => setShowMenu(false)}
              className="absolute top-2 right-2 p-2"
            >
              <Feather name="x" size={24} color="white" />
            </Pressable>

            <View className="space-y-4">
              {isSet ? (
                <>
                  <Pressable
                    onPress={() => {
                      setShowMenu(false);
                      onPress();
                    }}
                    className="flex-row items-center p-3 rounded-lg hover:bg-dark-300"
                  >
                    <Feather name="play" size={20} color="white" />
                    <InterText className="text-white ml-3">Run Shortcut</InterText>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setShowMenu(false);
                      onEdit();
                    }}
                    className="flex-row items-center p-3 rounded-lg hover:bg-dark-300"
                  >
                    <Feather name="edit" size={20} color="white" />
                    <InterText className="text-white ml-3">Edit Shortcut</InterText>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setShowMenu(false);
                      onReset();
                    }}
                    className="flex-row items-center p-3 rounded-lg hover:bg-dark-300"
                  >
                    <Feather name="refresh-cw" size={20} color="white" />
                    <InterText className="text-white ml-3">Reset Shortcut</InterText>
                  </Pressable>
                </>
              ) : (
                <Pressable
                  onPress={() => {
                    setShowMenu(false);
                    onEdit();
                  }}
                  className="flex-row items-center p-3 rounded-lg hover:bg-dark-300"
                >
                  <Feather name="plus" size={20} color="white" />
                  <InterText className="text-white ml-3">Set Shortcut</InterText>
                </Pressable>
              )}
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Action Modal */}
      <Modal visible={showActionModal} transparent animationType="fade">
        <BlurView intensity={30} tint="dark" className="absolute inset-0 flex items-center justify-center">
          <View className="bg-dark-200 p-6 rounded-xl w-11/12 max-w-md">
            <Pressable
              onPress={() => setShowActionModal(false)}
              className="absolute top-4 right-4"
            >
              <Feather name="x" size={24} color="white" />
            </Pressable>

            <InterText className="text-xl font-semibold text-white mb-4">
              No Shortcut Set
            </InterText>
            <InterText className="text-gray-400 mb-6">
              This shortcut hasn't been configured yet. Would you like to set it up now?
            </InterText>

            <View className="flex-row justify-end space-x-4">
              <Pressable
                onPress={() => setShowActionModal(false)}
                className="px-4 py-2 rounded-lg bg-dark-300"
              >
                <InterText className="text-white">Cancel</InterText>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowActionModal(false);
                  onEdit();
                }}
                className="px-4 py-2 rounded-lg bg-primary"
              >
                <InterText className="text-white">Set Shortcut</InterText>
              </Pressable>
            </View>
          </View>
        </BlurView>
      </Modal>
    </>
  );
};

export default ShortcutCard; 