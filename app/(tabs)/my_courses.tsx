import { View, Text, TouchableOpacity, Modal, Pressable, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as DocumentPicker from 'expo-document-picker';
import InterText from '../../components/InterText';
import Feather from 'react-native-vector-icons/Feather';
import { DocumentPickerAsset } from 'expo-document-picker';
import { useDropzone } from 'react-dropzone';

const MyCourses = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [files, setFiles] = useState<DocumentPickerAsset[]>([]);
  const [fileType, setFileType] = useState('');
  const [mode, setMode] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const courses = [
    { emoji: '📑', title: 'Create a Course', color: ['#3B82F6', '#1e1e1e'] as [string, string], desc: 'Upload a document or course outline, Hylo will generate learning materials, quizzes, and a study plan.', action: () => setModalVisible(true), btn: 'Get Started' },
    { emoji: '🧠', title: 'Quiz Me', color: ['#8B5CF6', '#1e1e1e'] as [string, string], desc: 'Take AI-generated quizzes based on your courses. Improve retention and track progress.', btn: 'Quiz Me' },
    { emoji: '💡', title: 'Flashcards', color: ['#FACC15', '#1e1e1e'] as [string, string], desc: 'Generate smart flashcards and concise notes from your course materials to reinforce learning.', btn: 'Create Flashcards' },
    { emoji: '🌍', title: 'Explore Courses', color: ['#22C55E', '#1e1e1e'] as [string, string], desc: 'Browse free and paid courses created by expert educators. Learn at your own pace and earn certifications.', btn: 'Explore Now' },
  ];

  const inProgressCourses = []; // Replace with actual data
  const enrolledCourses = []; // Replace with actual data

  const handleFilePick = async () => {
    try {
      const results = await DocumentPicker.getDocumentAsync({ multiple: true });
      if (results.canceled === false) {
        setFiles(prevFiles => [...prevFiles, ...results.assets]);
      }
    } catch (error) {
      console.log('Error picking files: ', error);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const fileArray: DocumentPickerAsset[] = acceptedFiles.map(file => ({
      name: file.name,
      type: file.type,
      uri: '', // Set to an empty string or handle as needed
    }));
    setFiles(prevFiles => [...prevFiles, ...fileArray]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate file upload (replace with actual upload logic)
    setTimeout(() => {
      setIsUploading(false);
      alert('Files uploaded successfully!');
      setModalVisible(false);
      setFiles([]);
    }, 2000);
  };

  // Check if the upload button should be enabled
  const isUploadEnabled = fileType !== '' && mode !== '' && files.length > 0;

  return (
    <View className="flex-1 bg-dark-300 px-24 py-10">
      <InterText className="text-2xl font-medium text-white text-center mb-4">My Courses</InterText>

      {/* Cards Grid */}
      <View className="flex flex-wrap flex-row justify-center gap-2">
        {courses.map((course, index) => (
          <TouchableOpacity
            key={index}
            className="w-full sm:w-[48%] lg:w-[18%] p-4 rounded-xl "
            onPress={course.action || (() => { })}
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

      {/* In Progress Section */}
      <View className="mt-8 mx-64">
        <InterText className="text-lg font-semibold text-white">
          In Progress <InterText className="text-gray-400 font-regular">{inProgressCourses.length}</InterText>
        </InterText>
        <View className="justify-center items-center">
          {inProgressCourses.length === 0 ? (
            <InterText className="text-gray-400">Ongoing courses will appear here.</InterText>
          ) : (
            // Render course card components here
            // Example: inProgressCourses.map(course => <CourseCard key={course.id} course={course} />)
            <InterText className="text-gray-400">Course cards will be rendered here.</InterText>
          )}
        </View>
      </View>

      {/* Enrolled Section */}
      <View className="mt-16 mx-64">
        <InterText className="text-lg font-semibold text-white">
          Enrolled <InterText className="text-gray-400 font-regular">{enrolledCourses.length}</InterText>
        </InterText>
        <View className="justify-center items-center">
          {enrolledCourses.length === 0 ? (
            <InterText className="text-gray-400">Your enrolled courses will appear here.</InterText>
          ) : (
            // Render course card components here
            // Example: enrolledCourses.map(course => <CourseCard key={course.id} course={course} />)
            <InterText className="text-gray-400">Course cards will be rendered here.</InterText>
          )}
        </View>
      </View>

      {/* Modal for Course Upload */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <BlurView intensity={30} tint="dark" className="absolute inset-0 flex items-center justify-center">
          <View className="bg-dark-200 p-6 rounded-xl w-11/12 max-w-md opacity-100">
            {/* Close Icon */}
            <Pressable onPress={() => setModalVisible(false)} className="absolute top-4 right-4">
              <Feather name="x" size={24} color="white" />
            </Pressable>

            <InterText className="text-xl font-semibold text-white mb-4">Create a Course</InterText>

            <View className="h-[1px] bg-gray-700" />
            {/* Course Type Selection */}
            <InterText className="text-white mb-2 mt-4">Choose what you are uploading:</InterText>
            <View className="flex flex-row justify-around mb-4 mt-4">
              <TouchableOpacity
                onPress={() => setFileType('outline')}
                className={`py-3 px-5 border border-gray-700 rounded-full ${fileType === 'outline' ? 'bg-primary' : 'bg-dark-500'}`}
              >
                <InterText className="text-white">📄 Course Outline</InterText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFileType('material')}
                className={`py-3 px-5 border border-gray-700 rounded-full ${fileType === 'material' ? 'bg-primary' : 'bg-dark-500'}`}
              >
                <InterText className="text-white">📚 Course Material</InterText>
              </TouchableOpacity>
            </View>

            <View className="h-[1px] bg-gray-700" />
            {/* Mode Selection */}
            <InterText className="text-white mt-4 mb-2">Select Mode:</InterText>
            <View className="flex flex-row justify-around mb-4 mt-4">
              <TouchableOpacity
                onPress={() => setMode('podcast')}
                className={`py-3 px-5 border border-gray-700 rounded-full ${mode === 'podcast' ? 'bg-primary' : 'bg-dark-500'}`}
              >
                <InterText className="text-white">🎙️ Hylo Podcast Mode</InterText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMode('notes')}
                className={`py-3 px-5 border border-gray-700 rounded-full ${mode === 'notes' ? 'bg-primary' : 'bg-dark-500'}`}
              >
                <InterText className="text-white">📖 Study Notes</InterText>
              </TouchableOpacity>
            </View>

            <View className="h-[1px] bg-gray-700" />
            {/* File Upload */}
            <InterText className="text-white mt-4 mb-2">Upload File:</InterText>
            <Pressable
              onPress={handleFilePick}
              className={`p-3 bg-dark-500 rounded-md mb-4 mt-4 ${files.length > 0 ? 'bg-green-600' : ''}`}
            >
              <InterText className="text-white">{files.length > 0 ? `📁 ${files.map(file => file.name).join(', ')}` : 'No Files Selected'}</InterText>
            </Pressable>

            {/* Dashed Box for Drag and Drop Uploading */}
            <div {...getRootProps()} className="border-dashed border-2 border-gray-400 rounded-lg p-4 mb-4">
              <input {...getInputProps()} />
              <InterText className="text-gray-400 text-center">Drag and drop your files here</InterText>
              {/* Preview Section */}
              {files.length > 0 && (
                <View className="flex items-center justify-between mt-2">
                  {files.map((file, index) => (
                    <View key={index} className="flex-row items-center justify-between w-full">
                      <InterText className="text-white text-center">{file.name}</InterText>
                      <Pressable onPress={() => setFiles(prev => prev.filter((_, i) => i !== index))}>
                        <Feather name="x" size={20} color="red" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </div>

            <Pressable
              className={`px-6 py-1.5 bg-primary w-fit self-center rounded-full mt-5 ${isUploadEnabled ? '' : 'opacity-50'}`}
              onPress={isUploadEnabled ? handleUpload : undefined}
              disabled={!isUploadEnabled}
            >
              <InterText className="text-white text-base text-center">Create Course</InterText>
            </Pressable>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

export default MyCourses;
