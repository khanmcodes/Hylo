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
  initialData?: {
    title: string;
    type: ShortcutType;
    content: string;
    emoji: string;
    color: [string, string];
  } | null;
}

const shortcutTypes = [
  { type: 'link', emoji: '🔗', title: 'Quick Link', color: ['#4285F4', '#4285F4'] },
  { type: 'document', emoji: '📄', title: 'Document', color: ['#FF6B6B', '#FF6B6B'] },
  { type: 'todo', emoji: '✅', title: 'Todo List', color: ['#4ECDC4', '#4ECDC4'] },
  { type: 'notes', emoji: '📝', title: 'Quick Notes', color: ['#FFD166', '#FFD166'] },
];

const emojiOptions = ['🔗', '📄', '✅', '📝', '🔍', '📚', '📅', '💡', '🎯', '✨'];

const colorOptions: [string, string][] = [
  ['#4285F4', '#4285F4'], // Blue
  ['#FF6B6B', '#FF6B6B'], // Red
  ['#4ECDC4', '#4ECDC4'], // Teal
  ['#FFD166', '#FFD166'], // Yellow
  ['#A78BFA', '#A78BFA'], // Purple
  ['#F87171', '#F87171'], // Deep red
];

const CreateShortcutModal: React.FC<CreateShortcutModalProps> = ({
  visible,
  onClose,
  onSave,
  initialData,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('type');
  const [selectedType, setSelectedType] = useState<ShortcutType | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<any>(null);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [selectedColor, setSelectedColor] = useState<[string, string]>(['#3B82F6', '#1e1e1e']);

  useEffect(() => {
    if (initialData) {
      setSelectedType(initialData.type);
      setTitle(initialData.title);
      setContent(initialData.content);
      setSelectedEmoji(initialData.emoji);
      setSelectedColor(initialData.color);
      setCurrentStep('appearance');
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setCurrentStep('type');
    setSelectedType(null);
    setTitle('');
    setContent(null);
    setSelectedEmoji('');
    setSelectedColor(['#3B82F6', '#1e1e1e']);
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'type':
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
    if (selectedType && title && content && selectedEmoji) {
      onSave({
        title,
        type: selectedType,
        content,
        emoji: selectedEmoji,
        color: selectedColor,
      });
      resetForm();
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
            {shortcutTypes.map((type) => (
              <Pressable
                key={type.type}
                onPress={() => setSelectedType(type.type as ShortcutType)}
                className={`p-4 rounded-xl ${
                  selectedType === type.type ? 'bg-primary' : 'bg-dark-300'
                }`}
              >
                <View className="flex-row items-center">
                  <InterText className="text-2xl mr-3">{type.emoji}</InterText>
                  <InterText className="text-white">{type.title}</InterText>
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
        return (
          <View className="space-y-6">
            <View>
              <InterText className="text-white text-lg mb-4">
                Choose an emoji
              </InterText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row space-x-4">
                  {emojiOptions.map((emoji) => (
                    <Pressable
                      key={emoji}
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
                  {colorOptions.map((color, index) => (
                    <Pressable
                      key={index}
                      onPress={() => setSelectedColor(color as [string, string])}
                      className="w-12 h-12 rounded-full overflow-hidden"
                    >
                      <LinearGradient
                        colors={color as [string, string]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="w-full h-full"
                      />
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        );
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
              Enter the document name
            </InterText>
            <TextInput
              className="bg-dark-300 text-white p-4 rounded-xl"
              placeholder="Document name"
              placeholderTextColor="#666"
              value={content}
              onChangeText={setContent}
            />
          </View>
        );
      case 'todo':
        return (
          <View className="space-y-4">
            <InterText className="text-white text-lg mb-4">
              Enter your first todo item
            </InterText>
            <TextInput
              className="bg-dark-300 text-white p-4 rounded-xl"
              placeholder="Todo item"
              placeholderTextColor="#666"
              value={content}
              onChangeText={setContent}
            />
          </View>
        );
      case 'notes':
        return (
          <View className="space-y-4">
            <InterText className="text-white text-lg mb-4">
              Enter your first note
            </InterText>
            <TextInput
              className="bg-dark-300 text-white p-4 rounded-xl"
              placeholder="Note content"
              placeholderTextColor="#666"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={4}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={30} tint="dark" className="absolute inset-0 flex items-center justify-center">
        <View className="bg-dark-200 p-6 rounded-xl w-11/12 max-w-md">
          <Pressable
            onPress={onClose}
            className="absolute top-4 right-4"
          >
            <Feather name="x" size={24} color="white" />
          </Pressable>

          <View className="mb-6">
            <View className="flex-row justify-between mb-2">
              {['type', 'title', 'content', 'appearance'].map((step, index) => (
                <View
                  key={step}
                  className={`h-1 flex-1 mx-1 rounded-full ${
                    index <= ['type', 'title', 'content', 'appearance'].indexOf(currentStep)
                      ? 'bg-primary'
                      : 'bg-dark-300'
                  }`}
                />
              ))}
            </View>
            <InterText className="text-white text-center">
              Step {['type', 'title', 'content', 'appearance'].indexOf(currentStep) + 1} of 4
            </InterText>
          </View>

          {renderStep()}

          <View className="flex-row justify-between mt-8">
            {currentStep !== 'type' && (
              <Pressable
                onPress={handleBack}
                className="px-6 py-2 rounded-lg bg-dark-300"
              >
                <InterText className="text-white">Back</InterText>
              </Pressable>
            )}
            <Pressable
              onPress={handleNext}
              className={`px-6 py-2 rounded-lg ${
                currentStep === 'appearance' ? 'bg-primary' : 'bg-dark-300'
              }`}
            >
              <InterText className="text-white">
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