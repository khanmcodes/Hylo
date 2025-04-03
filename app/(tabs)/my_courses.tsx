import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as DocumentPicker from 'expo-document-picker';
import InterText from '../../components/InterText';

const MyCourses = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [file, setFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [fileType, setFileType] = useState('');
  const [mode, setMode] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const courses = [
    { emoji: '📑', title: 'Create a Course', color: ['#3B82F6', '#1e1e1e'] as [string, string], desc: 'Upload a document or course outline, Hylo will generate learning materials, quizzes, and a study plan.', action: () => setModalVisible(true), btn: 'Get Started' },
    { emoji: '🧠', title: 'Quiz Me', color: ['#8B5CF6', '#1e1e1e'] as [string, string], desc: 'Take AI-generated quizzes based on your courses. Improve retention and track progress.', btn: 'Quiz Me' },
    { emoji: '💡', title: 'Flashcards', color: ['#FACC15', '#1e1e1e'] as [string, string], desc: 'Generate smart flashcards and concise notes from your course materials to reinforce learning.', btn: 'Create Flashcards' },
    { emoji: '🌍', title: 'Explore Courses', color: ['#22C55E', '#1e1e1e'] as [string, string], desc: 'Browse free and paid courses created by expert educators. Learn at your own pace and earn certifications.', btn: 'Explore Now' },
  ];

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (result.canceled === false) {
        setFile(result);
      }
    } catch (error) {
      console.log('Error picking file: ', error);
    }
  };

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate file upload (replace with actual upload logic)
    setTimeout(() => {
      setIsUploading(false);
      alert('File uploaded successfully!');
      setModalVisible(false);
    }, 2000);
  };

  return (
    <View className="flex-1 bg-dark-300 px-24 py-10">
      <InterText className="text-2xl font-medium text-white text-center mb-4">My Courses</InterText>

      {/* Cards Grid */}
      <View className="flex flex-wrap flex-row justify-center gap-2">
        {courses.map((course, index) => (
          <TouchableOpacity
            key={index}
            className="w-full sm:w-[48%] lg:w-[18%] p-4 rounded-xl "
            onPress={course.action || (() => {})}
          >
            <LinearGradient 
              colors={course.color}
              locations={[0, 0.5, 0.5, 0]}  // First color fades at 50%, second starts from 50%
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              className="p-6 rounded-xl items-center">
              <InterText className="text-2xl text-white">{course.emoji}</InterText>
              <InterText className="text-2xl font-regular text-white">{course.title}</InterText>
              <InterText className="text-xs text-center text-gray-400 mt-2 font-medium">{course.desc}</InterText>
              <Pressable className="px-6 py-1 bg-primary rounded-full mt-5" onPress={course.action}>
                <InterText className="text-white text-center text-base font-regular">{course.btn}</InterText>
              </Pressable>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sections */}
      <View className="mt-8 mx-64">
        <InterText className="text-xl font-semibold text-white">In Progress</InterText>
          <View className="justify-center items-center">
          <InterText className="text-gray-400">Ongoing courses will appear here.</InterText>
          </View>
      </View>

      <View className="mt-16 mx-64">
        <InterText className="text-xl font-semibold text-white">Enrolled</InterText>
        <View className="justify-center items-center">
          <InterText className="text-gray-400">Your enrolled courses will appear here.</InterText>
        </View>
      </View>

      {/* Modal for Course Upload */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <BlurView intensity={30} tint="dark" className="absolute inset-0 flex items-center justify-center">
          <View className="bg-dark-200 p-6 rounded-xl w-11/12 max-w-md opacity-100">
            <InterText className="text-xl font-semibold text-primary mb-4">Create a Course</InterText>

            {/* Course Type Selection */}
            <InterText className="text-white mb-2">Choose what you are uploading:</InterText>
            <TouchableOpacity
              onPress={() => setFileType('outline')}
              className={`p-3 rounded-md mb-2 ${fileType === 'outline' ? 'bg-blue-600' : 'bg-dark-500'}`}
            >
              <InterText className="text-white">📄 Course Outline</InterText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFileType('material')}
              className={`p-3 rounded-md mb-2 ${fileType === 'material' ? 'bg-blue-600' : 'bg-dark-500'}`}
            >
              <InterText className="text-white">📚 Course Material</InterText>
            </TouchableOpacity>

            {/* Mode Selection */}
            <InterText className="text-white mt-4 mb-2">Select Mode:</InterText>
            <TouchableOpacity
              onPress={() => setMode('podcast')}
              className={`p-3 rounded-md mb-2 ${mode === 'podcast' ? 'bg-blue-600' : 'bg-dark-500'}`}
            >
              <InterText className="text-white">🎙️ Hylo Podcast Mode</InterText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('notes')}
              className={`p-3 rounded-md mb-2 ${mode === 'notes' ? 'bg-blue-600' : 'bg-dark-500'}`}
            >
              <InterText className="text-white">📖 Study Notes</InterText>
            </TouchableOpacity>

            {/* File Upload */}
            <InterText className="text-white mt-4 mb-2">Upload File:</InterText>
            <Pressable
              onPress={handleFilePick}
              className={`p-3 bg-dark-500 rounded-md mb-4 ${file ? 'bg-green-600' : ''}`}
            >
              <InterText className="text-white">{file && file.assets ? `📁 ${file.assets[0].name}` : '📤 Select File'}</InterText>
            </Pressable>

            {/* Upload Button */}
            {isUploading ? (
              <InterText className="text-white text-center mb-4">Uploading...</InterText>
            ) : (
              <Pressable className="p-3 bg-blue-600 rounded-md" onPress={handleUpload}>
                <InterText className="text-white text-center">Upload</InterText>
              </Pressable>
            )}

            {/* Close Modal */}
            <Pressable className="p-3 bg-red-500 rounded-md mt-4" onPress={() => setModalVisible(false)}>
              <InterText className="text-white text-center">Close</InterText>
            </Pressable>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

export default MyCourses;
