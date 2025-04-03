import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as DocumentPicker from 'expo-document-picker';

const MyCourses = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [file, setFile] = useState(null);
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
      if (result.type === 'success') {
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
      <Text className="text-2xl font-medium text-white text-center mb-4 font-sans">My Courses</Text>

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
              <Text className="text-2xl text-white font-sans">{course.emoji}</Text>
              <Text className="text-2xl font-regular text-white font-sans">{course.title}</Text>
              <Text className="text-xs text-center text-gray-400 mt-2 font-medium font-sans">{course.desc}</Text>
              <Pressable className="px-6 py-2 bg-primary rounded-full mt-5" onPress={course.action}>
                <Text className="text-white text-center text-base font-regular font-sans">{course.btn}</Text>
              </Pressable>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sections */}
      <View className="mt-8 mx-64">
        <Text className="text-xl font-semibold text-white font-sans">In Progress</Text>
          <View className="justify-center items-center">
          <Text className="text-gray-400 font-sans">Ongoing courses will appear here.</Text>
          </View>
      </View>

      <View className="mt-16 mx-64">
        <Text className="text-xl font-semibold text-white font-sans">Enrolled</Text>
        <View className="justify-center items-center">
          <Text className="text-gray-400 font-sans">Your enrolled courses will appear here.</Text>
        </View>
      </View>

      {/* Modal for Course Upload */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <BlurView intensity={30} tint="dark" className="absolute inset-0 flex items-center justify-center">
          <View className="bg-dark-200 p-6 rounded-xl w-11/12 max-w-md opacity-100">
            <Text className="text-xl font-semibold text-primary mb-4 font-sans">Create a Course</Text>

            {/* Course Type Selection */}
            <Text className="text-white mb-2 font-sans">Choose what you are uploading:</Text>
            <TouchableOpacity
              onPress={() => setFileType('outline')}
              className={`p-3 rounded-md mb-2 ${fileType === 'outline' ? 'bg-blue-600' : 'bg-dark-500'}`}
            >
              <Text className="text-white font-sans">📄 Course Outline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFileType('material')}
              className={`p-3 rounded-md mb-2 ${fileType === 'material' ? 'bg-blue-600' : 'bg-dark-500'}`}
            >
              <Text className="text-white font-sans">📚 Course Material</Text>
            </TouchableOpacity>

            {/* Mode Selection */}
            <Text className="text-white mt-4 mb-2 font-sans">Select Mode:</Text>
            <TouchableOpacity
              onPress={() => setMode('podcast')}
              className={`p-3 rounded-md mb-2 ${mode === 'podcast' ? 'bg-blue-600' : 'bg-dark-500'}`}
            >
              <Text className="text-white font-sans">🎙️ Hylo Podcast Mode</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('notes')}
              className={`p-3 rounded-md mb-2 ${mode === 'notes' ? 'bg-blue-600' : 'bg-dark-500'}`}
            >
              <Text className="text-white font-sans">📖 Study Notes</Text>
            </TouchableOpacity>

            {/* File Upload */}
            <Text className="text-white mt-4 mb-2 font-sans">Upload File:</Text>
            <Pressable
              onPress={handleFilePick}
              className={`p-3 bg-dark-500 rounded-md mb-4 ${file ? 'bg-green-600' : ''}`}
            >
              <Text className="text-white font-sans">{file ? `📁 ${file.name}` : '📤 Select File'}</Text>
            </Pressable>

            {/* Upload Button */}
            {isUploading ? (
              <Text className="text-white text-center mb-4 font-sans">Uploading...</Text>
            ) : (
              <Pressable className="p-3 bg-blue-600 rounded-md" onPress={handleUpload}>
                <Text className="text-white text-center font-sans">Upload</Text>
              </Pressable>
            )}

            {/* Close Modal */}
            <Pressable className="p-3 bg-red-500 rounded-md mt-4" onPress={() => setModalVisible(false)}>
              <Text className="text-white text-center font-sans">Close</Text>
            </Pressable>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

export default MyCourses;
