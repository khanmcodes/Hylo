import React, { useState, useEffect } from 'react';
import { View, Modal, Pressable, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import InterText from './InterText';
import Feather from 'react-native-vector-icons/Feather';
import { TextInput } from 'react-native';
import { ShortcutType } from './ShortcutCard';

type Step = 'type' | 'title' | 'content' | 'appearance';

interface CreateShortcutModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (shortcut: {
    title: string;
    type: ShortcutType;
    content: any;
    emoji: string;
    color: [string, string];
  }) => void;
}

const shortcutTypes = [
  { type: 'link', emoji: '🔗', title: 'Quick Link', color: ['#4285F4', '#4285F4'] },
  { type: 'document', emoji: '📄', title: 'Open File', color: ['#FF6B6B', '#FF6B6B'] },
];

const emojiOptions = [
  '🔗', '📄', '🔍', '📚', '📁', '📂', '📝', '📋', '📎', '📏',
  '🔖', '📌', '📍', '🎯', '💡', '✨', '🌟', '⭐', '💫', '🎨',
  '🎭', '🎪', '🎬', '🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎬'
];

const colorOptions: [string, string][] = [
  ['#4285F4', '#4285F4'], // Blue
  ['#FF6B6B', '#FF6B6B'], // Red
  ['#4ECDC4', '#4ECDC4'], // Teal
  ['#FFD166', '#FFD166'], // Yellow
  ['#A78BFA', '#A78BFA'], // Purple
  ['#F87171', '#F87171'], // Deep red
  ['#10B981', '#10B981'], // Green
  ['#F59E0B', '#F59E0B'], // Orange
  ['#EC4899', '#EC4899'], // Pink
  ['#6366F1', '#6366F1'], // Indigo
];

const CreateShortcutModal: React.FC<CreateShortcutModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('type');
  const [selectedType, setSelectedType] = useState<ShortcutType | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<any>(null);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [selectedColor, setSelectedColor] = useState<[string, string]>([colorOptions[0][0], colorOptions[0][1]]);

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
    setSelectedColor([colorOptions[0][0], colorOptions[0][1]]);
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'type':
        if (!selectedEmoji) {
            const typeInfo = shortcutTypes.find(t => t.type === selectedType);
            if (typeInfo) setSelectedEmoji(typeInfo.emoji);
        }
        if (!selectedColor || selectedColor[0] === colorOptions[0][0]) {
            const typeInfo = shortcutTypes.find(t => t.type === selectedType);
             if (typeInfo) setSelectedColor([typeInfo.color[0], typeInfo.color[1]]);
        }
        setCurrentStep('title');
        break;
      case 'title':
        setCurrentStep('content');
        break;
      case 'content':
        setCurrentStep('appearance');
        break;
      case 'appearance':
        handleSave();
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'title':
        setCurrentStep('type');
        break;
      case 'content':
        setCurrentStep('title');
        break;
      case 'appearance':
        setCurrentStep('content');
        break;
    }
  };

  const handleSave = () => {
    const finalEmoji = selectedEmoji || (selectedType === 'link' ? '🔗' : '📄');
    const finalColorTuple: [string, string] = 
        (selectedColor && selectedColor[0] !== '') 
        ? selectedColor 
        : (selectedType === 'link' ? ['#4285F4', '#4285F4'] : ['#FF6B6B', '#FF6B6B']);

    if (selectedType && title && content) {
      onSave({
        title,
        type: selectedType,
        content,
        emoji: finalEmoji,
        color: finalColorTuple,
      });
      onClose();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'type':
        return (
          <View className="space-y-4">
            <InterText className="text-white text-lg mb-4">
              What type of shortcut would you like to create?
            </InterText>
            {shortcutTypes.map((typeInfo) => (
              <Pressable
                key={typeInfo.type}
                onPress={() => setSelectedType(typeInfo.type as ShortcutType)}
                className={`p-4 rounded-xl ${
                  selectedType === typeInfo.type ? 'bg-primary' : 'bg-dark-300'
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

      case 'title':
        return (
          <View className="space-y-4">
            <InterText className="text-white text-lg mb-4">
              Give your shortcut a name
            </InterText>
            <TextInput
              className="bg-dark-300 text-white p-4 rounded-xl"
              placeholder="Enter shortcut name"
              placeholderTextColor="#666"
              value={title}
              onChangeText={setTitle}
            />
          </View>
        );

      case 'content':
        return renderContentStep();

      case 'appearance':
        return renderAppearanceStep();
    }
  };

  const renderContentStep = () => {
    switch (selectedType) {
      case 'link':
        return (
          <View className="space-y-4">
            <InterText className="text-white text-lg mb-4">
              Enter the URL for your link
            </InterText>
            <TextInput
              className="bg-dark-300 text-white p-4 rounded-xl"
              placeholder="https://example.com"
              placeholderTextColor="#666"
              value={content}
              onChangeText={setContent}
              keyboardType="url"
            />
          </View>
        );
      case 'document':
        return (
          <View className="space-y-4">
            <InterText className="text-white text-lg mb-4">
              Enter the document name or path
            </InterText>
            <TextInput
              className="bg-dark-300 text-white p-4 rounded-xl"
              placeholder="Document name / path"
              placeholderTextColor="#666"
              value={content}
              onChangeText={setContent}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const renderAppearanceStep = () => {
    return (
      <View className="space-y-6">
        <View>
          <InterText className="text-white text-lg mb-4">
            Choose an emoji
          </InterText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-4">
              {emojiOptions.map((emoji, index) => (
                <Pressable
                  key={`${emoji}-${index}`}
                  onPress={() => setSelectedEmoji(emoji)}
                  className={`p-4 rounded-xl ${
                    selectedEmoji === emoji ? 'bg-primary' : 'bg-dark-300'
                  }`}
                >
                  <InterText className="text-2xl">{emoji}</InterText>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        <View>
          <InterText className="text-white text-lg mb-4">
            Choose a color
          </InterText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-4">
              {colorOptions.map((colorPair, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedColor(colorPair)}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
                    selectedColor[0] === colorPair[0] ? 'border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: colorPair[0] }}
                >
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={30} tint="dark" className="absolute inset-0 flex items-center justify-center p-4">
        <View className="bg-dark-200 p-6 rounded-xl w-full max-w-md">
          <Pressable
            onPress={onClose}
            className="absolute top-4 right-4 z-10 p-1"
          >
            <Feather name="x" size={24} color="white" />
          </Pressable>

          <View className="mb-6">
            <View className="flex-row justify-between mb-2">
              {['type', 'title', 'content', 'appearance'].map((step, index) => (
                <View
                  key={step}
                  className={`h-1 flex-1 mx-1 rounded-full ${
                    index < ['type', 'title', 'content', 'appearance'].indexOf(currentStep)
                      ? 'bg-primary'
                      : index === ['type', 'title', 'content', 'appearance'].indexOf(currentStep)
                      ? 'bg-primary/50'
                      : 'bg-dark-300'
                  }`}
                />
              ))}
            </View>
            <InterText className="text-white text-center text-sm">
              Step {['type', 'title', 'content', 'appearance'].indexOf(currentStep) + 1} of 4
            </InterText>
          </View>

          {renderStep()}

          <View className="flex-row justify-between mt-8">
             <Pressable
                onPress={handleBack}
                className={`px-6 py-3 rounded-lg bg-dark-300 ${
                  currentStep === 'type' ? 'opacity-0' : 'opacity-100'
                }`}
                disabled={currentStep === 'type'}
              >
                <InterText className="text-white font-medium">Back</InterText>
              </Pressable>
            <Pressable
              onPress={handleNext}
              className={`px-6 py-3 rounded-lg ${
                currentStep === 'appearance' ? 'bg-primary' : 'bg-blue-500'
              }`}
              disabled={
                  (currentStep === 'type' && !selectedType) ||
                  (currentStep === 'title' && !title) ||
                  (currentStep === 'content' && !content)
              }
            >
              <InterText className="text-white font-medium">
                {currentStep === 'appearance' ? 'Create' : 'Next'}
              </InterText>
            </Pressable>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default CreateShortcutModal; 