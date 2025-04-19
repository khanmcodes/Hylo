import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Pressable, Platform, Dimensions } from 'react-native';
import InterText from './InterText';
import Feather from 'react-native-vector-icons/Feather';
import { BlurView } from 'expo-blur';

export type ShortcutType = 'link' | 'document';

interface ShortcutCardProps {
  title: string;
  emoji: string;
  color: string;
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
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const isWeb = Platform.OS === 'web';
  const isTablet = Dimensions.get('window').width > 768;

  const handleLongPress = (event: any) => {
    if (!isWeb) {
      const { pageX, pageY } = event.nativeEvent;
      setMenuPosition({ x: pageX, y: pageY });
      setShowMenu(true);
    }
  };

  const handleWebClick = (event: any) => {
    if (isWeb) {
      const { pageX, pageY } = event.nativeEvent;
      setMenuPosition({ x: pageX, y: pageY });
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
        style={{ flex: 1, minWidth: '50%', maxWidth: '50%' }}
      >
        <View
          className="py-2 px-4 rounded-xl justify-items-start"
          style={{
            borderRadius: 14,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderWidth: 2,
            borderColor: '#292929',
            backgroundColor: isSet ? color : '#292929',
          }}
        >
          <View className='flex flex-row justify-between'>
            <View className='flex'>
              <InterText className="text-xl text-white">{emoji}</InterText>
              <InterText className="text-sm font-medium text-white mt-2">
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
                onPress={handleWebClick}
                style={({ pressed }) => ({
                  borderRadius: 20,
                  padding: 8,
                  backgroundColor: pressed ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                })}
              >
                <Feather name="more-vertical" size={20} color="white" />
              </Pressable>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Menu Modal */}
      <Modal visible={showMenu} transparent animationType="none">
        <Pressable 
          onPress={() => setShowMenu(false)}
          className="absolute inset-0"
        >
          <View 
            className="absolute bg-dark-200 border-2 border-[#292929] rounded-lg shadow-lg overflow-hidden"
            style={{
              top: menuPosition.y,
              left: menuPosition.x,
              transform: [
                { translateX: -8 },
                { translateY: -8 }
              ]
            }}
          >
            <View className="space-y-1 p-1">
              {isSet ? (
                <>
                  <Pressable
                    onPress={() => {
                      setShowMenu(false);
                      onPress();
                    }}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 4,
                      backgroundColor: pressed ? '#333' : 'transparent',
                    })}
                  >
                    <Feather name="play" size={16} color="white" style={{ marginRight: 8 }} />
                    <InterText className="text-white">Run Shortcut</InterText>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setShowMenu(false);
                      onReset();
                    }}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 4,
                      backgroundColor: pressed ? '#333' : 'transparent',
                    })}
                  >
                    <Feather name="refresh-cw" size={16} color="white" style={{ marginRight: 8 }} />
                    <InterText className="text-white">Reset Shortcut</InterText>
                  </Pressable>
                </>
              ) : (
                <Pressable
                  onPress={() => {
                    setShowMenu(false);
                    onEdit();
                  }}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 4,
                    backgroundColor: pressed ? '#333' : 'transparent',
                  })}
                >
                  <Feather name="plus" size={16} color="white" style={{ marginRight: 8 }} />
                  <InterText className="text-white">Set Shortcut</InterText>
                </Pressable>
              )}
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Action Modal */}
      <Modal visible={showActionModal} transparent animationType="fade">
        <Pressable 
          onPress={() => setShowActionModal(false)}
          className="absolute inset-0 bg-black/50 flex items-center justify-center"
        >
          <BlurView intensity={30} tint="dark" className="absolute inset-0 flex items-center justify-center">
            <Pressable onPress={e => e.stopPropagation()}>
              <View className="bg-dark-200 p-6 rounded-xl w-11/12 max-w-md">
                <InterText className="text-xl font-semibold text-white mb-4">
                  No Shortcut Set
                </InterText>
                <InterText className="text-gray-400 mb-5">
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
            </Pressable>
          </BlurView>
        </Pressable>
      </Modal>
    </>
  );
};

export default ShortcutCard; 