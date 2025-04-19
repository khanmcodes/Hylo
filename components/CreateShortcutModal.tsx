import React, { useState, useEffect } from 'react';
import { View, Modal, Pressable, ScrollView, Platform, TextInput } from 'react-native';
import { BlurView } from 'expo-blur';
import InterText from './InterText';
import Feather from 'react-native-vector-icons/Feather';
import { ShortcutType } from './ShortcutCard';

type Step = 'type' | 'details';

interface CreateShortcutModalProps {  
  visible: boolean;
  onClose: () => void;
  onSave: (shortcut: {
    title: string;
    type: ShortcutType;
    content: any;
    emoji: string;
    color: string;
  }) => void;
}

const shortcutTypes = [
  { type: 'link', emoji: '🔗', title: 'Quick Link', color: '#4285F4' },
  { type: 'document', emoji: '📄', title: 'Open File', color: '#FF6B6B' },
];

const emojiOptions = [
  '🔗', '📄', '⌚', '👤', '🏫', '⌨️', '💀', '📅', '🔔', '🔍', '📚', '📁', '📂', '📝', '📋', '📎', '📏',
  '🔖', '📌', '📍', '🎯', '💡', '✨', '🌟', '⭐', '💫', '🎨', '🎬', '🎮', '🎲'
];

const colorOptions = [
  "#636366", // system gray 2
  "#2C2C2E", // dark card background
  "#48484A", // dark mode gray
  "#8E8E93", // system gray 3
  "#3A3A3C", // system gray 1 (dark text/secondary)
  "#007AFF", // system blue (primary)
  "#34C759", // system green
  "#FF9500", // system orange
  "#FF3B30", // system red
  "#AF52DE", // system purple
  "#5AC8FA", // system teal blue
  "#FFD60A", // system yellow
];

const CreateShortcutModal: React.FC<CreateShortcutModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [currentStep, setCurrentStep] = useState<'type' | 'details'>('type');
  const [selectedType, setSelectedType] = useState<ShortcutType | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<any>(null);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [previewFile, setPreviewFile] = useState<any>(null);

  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);

  const resetForm = () => {
    setCurrentStep('type');
    setSelectedType(null);
    setTitle('');
    setContent(null);
    setSelectedEmoji('');
    setSelectedColor('');
    setPreviewFile(null);
  };

  const handleNext = () => {
    if (currentStep === 'type' && selectedType) {
      setCurrentStep('details');
    } else if (currentStep === 'details' && title && content) {
      handleSave();
    }
  };

  const handleBack = () => {
    if (currentStep === 'details') {
      setCurrentStep('type');
    }
  };

  const handleSave = () => {
    const finalEmoji = selectedEmoji || (selectedType === 'link' ? '🔗' : '📄');
    const finalColor = selectedColor || (selectedType === 'link' ? '#007AFF' : '#FF3B30');

    if (selectedType && title && content) {
      onSave({
        title,
        type: selectedType,
        content,
        emoji: finalEmoji,
        color: finalColor,
      });
      onClose();
    }
  };

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewFile(file);
      setContent(file);
    }
  };

  const renderStep = () => {
    if (currentStep === 'type') {
      return (
        <View className="space-y-4">
          <InterText className="text-white text-lg mb-4">
            What type of shortcut would you like to create?
          </InterText>
          {shortcutTypes.map((typeInfo) => (
            <Pressable
              key={typeInfo.type}
              onPress={() => setSelectedType(typeInfo.type as ShortcutType)}
              className={`p-4 rounded-xl transition-all duration-200 ${
                selectedType === typeInfo.type 
                  ? 'bg-primary scale-105' 
                  : 'bg-dark-300 hover:bg-dark-100'
              }`}
            >
              <View className="flex-row items-center">
                <InterText className="text-2xl mr-3">{typeInfo.emoji}</InterText>
                <InterText className="text-white">{typeInfo.title}</InterText>
              </View>
            </Pressable>
          ))}
        </View>
      );
    }

    return (
      <View className="space-y-6">
        <View className="space-y-4">
          <InterText className="text-white text-lg">Shortcut Name</InterText>
          <TextInput
            className="bg-dark-300 text-white p-4 rounded-xl focus:ring-2 focus:ring-primary transition-all duration-200"
            placeholder="Enter shortcut name"
            placeholderTextColor="#666"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {selectedType === 'link' ? (
          <View className="space-y-4">
            <InterText className="text-white text-lg">URL</InterText>
            <TextInput
              className="bg-dark-300 text-white p-4 rounded-xl focus:ring-2 focus:ring-primary transition-all duration-200"
              placeholder="https://example.com"
              placeholderTextColor="#666"
              value={content}
              onChangeText={setContent}
              keyboardType="url"
            />
          </View>
        ) : (
          <View className="space-y-4">
            <InterText className="text-white text-lg">Upload File</InterText>
            {Platform.OS === 'web' ? (
              <View className="border-2 border-dashed border-dark-300 rounded-xl p-6 text-center">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Pressable
                  onPress={() => document.getElementById('file-upload')?.click()}
                  style={({ pressed }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed ? 0.8 : 1
                  })}
                >
                  <Feather name="upload" size={24} color="white" />
                  <InterText className="text-white text-center mt-2">
                    {previewFile ? previewFile.name : 'Click to upload file'}
                  </InterText>
                  {previewFile && (
                    <View className="mt-2">
                      <InterText className="text-gray-400 text-center text-sm">
                        {Math.round(previewFile.size / 1024)} KB
                      </InterText>
                    </View>
                  )}
                </Pressable>
              </View>
            ) : (
              <TextInput
                className="bg-dark-300 text-white p-4 rounded-xl"
                placeholder="Enter file path"
                placeholderTextColor="#666"
                value={content}
                onChangeText={setContent}
              />
            )}
          </View>
        )}

        <View className="space-y-4">
          <InterText className="text-white text-lg">Choose an emoji</InterText>
          <ScrollView 
            className="h-48"
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={false}
            indicatorStyle="white"
          >
            <View className="flex-row flex-wrap gap-2">
              {emojiOptions.map((emoji, index) => (
                <Pressable
                  key={`${emoji}-${index}`}
                  onPress={() => setSelectedEmoji(emoji)}
                  style={({ pressed }) => ({
                    width: 40,
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                    backgroundColor: selectedEmoji === emoji 
                      ? '#007AFF' 
                      : pressed ? '#333' : '#1C1C1E',
                    transform: [{ scale: selectedEmoji === emoji ? 1.1 : pressed ? 1.05 : 1 }],
                    margin: 2,
                  })}
                >
                  <InterText className="text-2xl">{emoji}</InterText>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        <View className="space-y-4">
          <InterText className="text-white text-lg">Choose a color</InterText>
          <ScrollView 
            className="h-48"
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={false}
            indicatorStyle="white"
          >
            <View className="flex-row flex-wrap gap-2">
              {colorOptions.map((color, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedColor(color)}
                  style={({ pressed }) => ({
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: color,
                    transform: [{ scale: selectedColor === color ? 1.1 : pressed ? 1.05 : 1 }],
                    borderWidth: selectedColor === color ? 2 : 0,
                    borderColor: 'white',
                    margin: 2,
                  })}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable 
        onPress={onClose}
        className="absolute inset-0 bg-black/50 flex items-center justify-center p-4"
      >
        <BlurView intensity={30} tint="dark" className="absolute inset-0 flex items-center justify-center p-4">
          <Pressable onPress={e => e.stopPropagation()}>
            <View className="bg-dark-200 p-6 rounded-xl w-full max-w-md">
              <View className="mb-6">
                <View className="flex-row justify-between mb-2">
                  {['type', 'details'].map((step, index) => (
                    <View
                      key={step}
                      className={`h-1 flex-1 mx-1 rounded-full ${
                        index < ['type', 'details'].indexOf(currentStep)
                          ? 'bg-primary'
                          : index === ['type', 'details'].indexOf(currentStep)
                          ? 'bg-primary/50'
                          : 'bg-dark-300'
                      }`}
                    />
                  ))}
                </View>
                <InterText className="text-white text-center text-sm mb-5">
                  Step {['type', 'details'].indexOf(currentStep) + 1} of 2
                </InterText>
              </View>

              {renderStep()}

              <View className="flex-row justify-between mt-8">
                <Pressable
                  onPress={handleBack}
                  className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                    currentStep === 'type' 
                      ? 'opacity-0' 
                      : 'bg-dark-300 hover:bg-dark-100'
                  }`}
                  disabled={currentStep === 'type'}
                >
                  <InterText className="text-white font-medium">Back</InterText>
                </Pressable>
                <Pressable
                  onPress={handleNext}
                  className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                    currentStep === 'details' 
                      ? 'bg-primary hover:bg-primary/90' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  disabled={
                    (currentStep === 'type' && !selectedType) ||
                    (currentStep === 'details' && (!title || !content))
                  }
                >
                  <InterText className="text-white font-medium">
                    {currentStep === 'details' ? 'Create' : 'Next'}
                  </InterText>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </BlurView>
      </Pressable>
    </Modal>
  );
};

export default CreateShortcutModal; 