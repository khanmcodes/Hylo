import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as DocumentPicker from "expo-document-picker";
import InterText from "../../components/InterText";
import Feather from "react-native-vector-icons/Feather";
import { DocumentPickerAsset } from "expo-document-picker";
import { useWindowDimensions, Platform } from "react-native";

const MyCourses = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [files, setFiles] = useState<DocumentPickerAsset[]>([]);
  const [fileType, setFileType] = useState("");
  const [mode, setMode] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isMobile = width < 640; // Tailwind 'sm' starts at 640px

  const coursesActionCard = [
    {
      emoji: "📑",
      title: "Create a Course",
      color: ["#3B82F6", "#1e1e1e"] as [string, string],
      desc: "Upload a document or course outline, Hylo will generate learning materials, quizzes, and a study plan.",
      action: () => setModalVisible(true),
      btn: "Get Started",
    },
    {
      emoji: "🧠",
      title: "Quiz Me",
      color: ["#8B5CF6", "#1e1e1e"] as [string, string],
      desc: "Take AI-generated quizzes based on your courses. Improve retention and track progress.",
      btn: "Quiz Me",
    },
    {
      emoji: "💡",
      title: "Flashcards",
      color: ["#FACC15", "#1e1e1e"] as [string, string],
      desc: "Generate smart flashcards and concise notes from your course materials to reinforce learning.",
      btn: "Create Flashcards",
    },
    {
      emoji: "🌍",
      title: "Explore Courses",
      color: ["#22C55E", "#1e1e1e"] as [string, string],
      desc: "Browse free and paid courses created by expert educators. Learn at your own pace and earn certifications.",
      btn: "Explore Now",
    },
  ];

  const inProgressCourses = []; // Replace with actual data
  const enrolledCourses = []; // Replace with actual data

  const handleFilePick = async () => {
    try {
      const results = await DocumentPicker.getDocumentAsync({ multiple: true });
      if (results.canceled === false) {
        setFiles((prevFiles) => [...prevFiles, ...results.assets]);
      }
    } catch (error) {
      console.log("Error picking files: ", error);
    }
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      alert("Please select a file to upload.");
      return;
    }

    if (!fileType) {
      alert(
        "Please select what you are uploading (Course Outline or Material)."
      );
      return;
    }

    if (!mode) {
      alert("Please select a mode (Podcast Mode or Study Notes).");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    const formData = new FormData();

    // Add metadata to the form
    formData.append("fileType", fileType);
    formData.append("mode", mode);

    // Process each file
    for (const file of files) {
      try {
        const response = await fetch(file.uri);
        const blob = await response.blob();

        // Add file to form data with proper name
        formData.append("file", blob, file.name);
      } catch (error) {
        setIsUploading(false);
        setUploadError(`Error processing ${file.name}`);
        console.error(`Error creating blob for ${file.name}:`, error);
        return;
      }
    }

    try {
      // Use XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        setIsUploading(false);

        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            console.log("Upload successful:", data);
            alert("Course material uploaded and processed successfully!");
            setModalVisible(false);
            setFiles([]);
            setFileType("");
            setMode("");
            setUploadProgress(0);
          } catch (e) {
            setUploadError("Error processing server response");
            console.error("Error parsing response:", e);
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            setUploadError(errorData.error || "Upload failed");
            console.error("Upload failed:", errorData);
          } catch (e) {
            setUploadError(`Server error: ${xhr.status}`);
            console.error("Error parsing error response:", e);
          }
        }
      });

      xhr.addEventListener("error", () => {
        setIsUploading(false);
        setUploadError("Network error during upload");
        console.error("XHR error during upload");
      });

      xhr.addEventListener("abort", () => {
        setIsUploading(false);
        setUploadError("Upload was aborted");
        console.log("Upload aborted");
      });

      // Open and send the request
      xhr.open("POST", "https://hylo-api.onrender.com/upload");
      xhr.send(formData);
    } catch (error) {
      setIsUploading(false);
      setUploadError("Failed to initiate upload");
      console.error("Upload error:", error);
    }
  };

  // Check if the upload button should be enabled
  const isUploadEnabled = fileType !== "" && mode !== "" && files.length > 0;

  return (
    <ScrollView className="flex-1 bg-dark-300 px-4 sm:px-24 py-9 lg:py-10">
      <InterText className="text-base sm:text-2xl font-medium text-white text-center mb-4">
        My Courses
      </InterText>

      {/* Cards Grid */}
      <View className="flex flex-wrap p-4 flex-row justify-center">
        {coursesActionCard.map((course, index) => (
          <TouchableOpacity
            key={index}
            className="w-[50%] sm:w-[48%] md:w-[20%] lg:w-[30%] xl:w-[24%] p-1 sm:p-3 rounded-xl "
            onPress={course.action || (() => {})}
            style={{ borderRadius: 14 }}
          >
            <LinearGradient
              colors={isMobile ? [course.color[0], "#292929"] : course.color}
              // colors={course.color}
              locations={isMobile ? [0, 1] : [0, 0.5, 0.5, 0]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{
                borderRadius: 14,
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: "#292929",
              }}
              className="py-2 px-4 sm:pt-6 rounded-xl sm:items-center justify-items-start sm:justify-items-center"
            >
              <InterText className="text-lg mb-1 sm:text-2xl text-white sm:text-center">
                {course.emoji}
              </InterText>
              <InterText className="xl:text-2xl mb-2 lg:text-xl font-medium sm:font-normal sm:text-center text-white">
                {course.title}
              </InterText>
              <InterText className="hidden sm:block text-xs text-center text-gray-400 mt-2 font-medium">
                {course.desc}
              </InterText>
              <Pressable
                className="hidden sm:block px-6 py-1 bg-primary rounded-full mt-5 mb-5"
                onPress={course.action}
              >
                <InterText className="text-white text-center xl:text-base lg:text-sm text-xs font-regular">
                  {course.btn}
                </InterText>
              </Pressable>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* In Progress Section */}
      <View className="mt-8 mx-4 sm:mx-64">
        <InterText className="text-lg font-semibold text-white">
          In Progress{" "}
          <InterText className="text-gray-400 font-regular">
            {inProgressCourses.length}
          </InterText>
        </InterText>
        <View className="justify-center items-center">
          {inProgressCourses.length === 0 ? (
            <InterText className="text-gray-400 mt-7">
              Ongoing courses will appear here.
            </InterText>
          ) : (
            // Render course card components here
            // Example: inProgressCourses.map(course => <CourseCard key={course.id} course={course} />)
            <InterText className="text-gray-400 mt-7">
              Course cards will be rendered here.
            </InterText>
          )}
        </View>
      </View>

      {/* Enrolled Section */}
      <View className="mt-16 mx-4 sm:mx-64">
        <InterText className="text-lg font-semibold text-white">
          Enrolled{" "}
          <InterText className="text-gray-400 font-regular">
            {enrolledCourses.length}
          </InterText>
        </InterText>
        <View className="justify-center items-center">
          {enrolledCourses.length === 0 ? (
            <InterText className="text-gray-400 mt-7">
              Your enrolled courses will appear here.
            </InterText>
          ) : (
            // Render course card components here
            // Example: enrolledCourses.map(course => <CourseCard key={course.id} course={course} />)
            <InterText className="text-gray-400 mt-7">
              Course cards will be rendered here.
            </InterText>
          )}
        </View>
      </View>

      {/* Modal for Course Upload */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <BlurView
          intensity={30}
          tint="dark"
          className="absolute inset-0 flex items-center justify-center"
        >
          <View className="bg-dark-200 p-6 rounded-xl w-11/12 max-w-md opacity-100">
            {/* Close Icon */}
            <Pressable
              onPress={() => setModalVisible(false)}
              hitSlop={10}
              className="absolute top-4 right-4 z-20"
            >
              <Feather name="x" size={24} color="white" />
            </Pressable>

            <InterText className="text-xl font-semibold text-white mb-4">
              Create a Course
            </InterText>

            <View className="h-[1px] bg-gray-700" />
            {/* Course Type Selection */}
            <InterText className="text-white mb-2 mt-4">
              Choose what you are uploading:
            </InterText>
            <View className="flex sm:flex-row flex-col gap-2 justify-around mb-4 mt-4">
              <TouchableOpacity
                onPress={() => setFileType("outline")}
                className={`py-3 px-5 border border-gray-700 rounded-full ${
                  fileType === "outline" ? "bg-primary" : "bg-dark-500"
                }`}
              >
                <InterText className="text-white">📄 Course Outline</InterText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFileType("material")}
                className={`py-3 px-5 border border-gray-700 rounded-full ${
                  fileType === "material" ? "bg-primary" : "bg-dark-500"
                }`}
              >
                <InterText className="text-white">📚 Course Material</InterText>
              </TouchableOpacity>
            </View>

            <View className="h-[1px] bg-gray-700" />
            {/* Mode Selection */}
            <InterText className="text-white mt-4 mb-2">Select Mode:</InterText>
            <View className="flex sm:flex-row flex-col gap-2 justify-around mb-4 mt-4">
              <TouchableOpacity
                onPress={() => setMode("podcast")}
                className={`py-3 px-5 border border-gray-700 rounded-full ${
                  mode === "podcast" ? "bg-primary" : "bg-dark-500"
                }`}
              >
                <InterText className="text-white">
                  🎙️ Hylo Podcast Mode
                </InterText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMode("notes")}
                className={`py-3 px-5 border border-gray-700 rounded-full ${
                  mode === "notes" ? "bg-primary" : "bg-dark-500"
                }`}
              >
                <InterText className="text-white">📖 Study Notes</InterText>
              </TouchableOpacity>
            </View>

            <View className="h-[1px] bg-gray-700" />
            {/* File Upload */}
            <InterText className="text-white mt-4 mb-2">Upload File:</InterText>
            <Pressable
              onPress={handleFilePick}
              className={`p-3 bg-dark-500 rounded-md mb-4 mt-4 ${
                files.length > 0 ? "bg-green-600" : ""
              }`}
            >
              <InterText className="text-white">
                {files.length > 0
                  ? `📁 ${files.map((file) => file.name).join(", ")}`
                  : "No Files Selected"}
              </InterText>
            </Pressable>

            {/* File Preview Section */}
            {files.length > 0 && (
              <View className="border-dashed border-2 border-gray-400 rounded-lg p-4 mb-4">
                {files.map((file, index) => (
                  <View
                    key={index}
                    className="flex-row items-center justify-between w-full mb-2"
                  >
                    <InterText className="text-white">{file.name}</InterText>
                    <Pressable
                      onPress={() =>
                        setFiles((prev) => prev.filter((_, i) => i !== index))
                      }
                    >
                      <Feather name="x" size={20} color="red" />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}

            {/* Upload Progress Indicator */}
            {isUploading && (
              <View className="mt-4 mb-2">
                <View className="w-full bg-gray-700 rounded-full h-2.5">
                  <View
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </View>
                <InterText className="text-white text-center mt-2">
                  Uploading... {uploadProgress}%
                </InterText>
              </View>
            )}

            {/* Error Message */}
            {uploadError && (
              <View className="mt-4 mb-2 p-3 bg-red-900/30 border border-red-500 rounded-lg">
                <InterText className="text-red-400 text-center">
                  {uploadError}
                </InterText>
              </View>
            )}

            <Pressable
              className={`px-6 py-1.5 bg-primary w-fit self-center rounded-full mt-5 ${
                isUploadEnabled && !isUploading ? "" : "opacity-50"
              }`}
              onPress={
                isUploadEnabled && !isUploading ? handleUpload : undefined
              }
              disabled={!isUploadEnabled || isUploading}
            >
              <InterText className="text-white text-base text-center">
                {isUploading ? "Uploading..." : "Create Course"}
              </InterText>
            </Pressable>
          </View>
        </BlurView>
      </Modal>
    </ScrollView>
  );
};

export default MyCourses;
