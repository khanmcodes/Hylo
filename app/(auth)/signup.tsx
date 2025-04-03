import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import Feather from "react-native-vector-icons/Feather";
import { useAuth } from "../../contexts/AuthContext";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { signUp, signInWithGoogle, signInWithApple } = useAuth();

  const handleSignUp = async () => {
    // Form validation
    if (!name || !username || !email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await signUp(email, password, username, name);

      if (error) {
        setErrorMsg(error.message || "Failed to sign up");
      } else {
        // Navigation is handled by the auth state change in _layout.tsx
        // Show success message
        Alert.alert(
          "Success",
          "Your account has been created. Please check your email for verification.",
          [{ text: "OK" }]
        );
      }
    } catch (error: any) {
      setErrorMsg(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-black"
    >
      <View className="flex-1 items-center justify-center p-4">
        <Image
          source={require("../../assets/images/icon.png")}
          className="absolute right-0 w-screen h-screen opacity-100 lg:opacity-70"
          style={[
            Platform.OS === "web"
              ? { transform: [{ scale: 3 }] }
              : { transform: [{ scale: 1.5 }] },
          ]}
          blurRadius={10}
          resizeMode="cover"
        />
        <View className="w-full min-h-[650px] justify-center items-center min-w-[1300px] max-w-[1200px] bg-transparent lg:bg-[#161616] p-10 sm:p-8 md:p-10">
          <View className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Logo Section */}
            <View className="w-full lg:w-1/2 flex items-center justify-center">
              <Image
                source={require("../../assets/images/logo.png")}
                className="w-[180px] sm:w-[320px] md:w-[400px] lg:w-[580px] h-[119px] sm:h-[136px] md:h-[170px] lg:h-[304px] sm:mb-8 md:mb-10"
                resizeMode="contain"
              />
              <Text className="text-white sm:text-lg md:text-2xl font-gochi-hand text-center">
                Join Our Learning Community
              </Text>
            </View>

            {/* Form Section */}
            <View className="w-full min-w-[300px] lg:w-1/2 max-w-[400px] bg-[#0D0D0D] p-6 sm:p-8 md:p-10 rounded-2xl">
              <View className="space-y-4 sm:space-y-3">
                {/* Full Name Input */}
                <View className="flex-row items-center bg-dark-200 rounded-full px-4 mb-3 md:mb-0">
                  <Feather name="user" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 text-white sm:text-base px-3 py-4 lg:py-3 mx-3 font-sans"
                    placeholder="Enter your full name"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>

                {/* Username Input */}
                <View className="flex-row items-center bg-dark-200 rounded-full px-4 mb-3">
                  <Feather name="at-sign" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 bg-dark-200 text-white sm:text-base px-3 py-4 lg:py-3 mx-3 font-sans"
                    placeholder="Create a username"
                    placeholderTextColor="#9CA3AF"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>

                {/* Email Input */}
                <View className="flex-row items-center bg-dark-200 rounded-full px-4 mb-3">
                  <Feather name="mail" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 bg-dark-200 text-white sm:text-base px-3 py-4 lg:py-3 mx-3 font-sans"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {/* Password Input */}
                <View className="flex-row items-center bg-dark-200 rounded-full px-4 mb-3">
                  <Feather name="lock" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 text-white sm:text-sm px-3 py-4 lg:py-3 mx-3 font-sans"
                    placeholder="Create a password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Feather
                      name={showPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>

                {/* Confirm Password Input */}
                <View className="flex-row items-center bg-dark-200 rounded-full px-4 mb-3 lg:mb-0">
                  <Feather name="lock" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 text-white sm:text-sm px-3 py-4 lg:py-3 mx-3 font-sans"
                    placeholder="Confirm your password"
                    placeholderTextColor="#9CA3AF"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Feather
                      name={showConfirmPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>

                {/* Error Message */}
                {errorMsg ? (
                  <Text className="text-red-500 text-sm mt-2 text-center font-sans">
                    {errorMsg}
                  </Text>
                ) : null}

                {/* Sign Up Button */}
                <TouchableOpacity
                  className={`bg-primary py-3 sm:py-3 rounded-full mt-6 ${
                    loading ? "opacity-70" : ""
                  }`}
                  onPress={handleSignUp}
                  disabled={loading}
                >
                  <Text className="text-white text-center text-base sm:text-lg md:text-lg font-semibold font-sans">
                    {loading ? "Creating Account..." : "Sign Up"}
                  </Text>
                </TouchableOpacity>

                {/* Login Link */}
                <View className="flex-row justify-center lg:justify-start mt-4">
                  <Text className="text-gray-300 text-sm sm:text-base font-sans lg:mt-4">
                    Already have an account?{" "}
                  </Text>
                  <Link href="/(auth)/login" asChild>
                    <TouchableOpacity>
                      <Text className="text-primary font-semibold text-sm sm:text-base font-sans lg:mt-4">
                        Login
                      </Text>
                    </TouchableOpacity>
                  </Link>
                </View>
                {/* Social Login */}
                <View className="mt-6">
                  <View className="flex-row items-center lg:mt-4">
                    <View className="flex-1 h-[1px] bg-gray-700" />
                    <Text className="text-gray-400 mx-4 font-sans">or continue with</Text>
                    <View className="flex-1 h-[1px] bg-gray-700" />
                  </View>

                  <View className="flex-row justify-center space-x-4 mt-6">
                    <TouchableOpacity
                      className="w-12 h-12 lg:w-10 lg:h-10 bg-dark-200 rounded-full items-center justify-center"
                      onPress={async () => {
                        setLoading(true);
                        setErrorMsg("");
                        try {
                          const { success, error } = await signInWithGoogle();
                          if (!success && error) {
                            setErrorMsg(
                              typeof error === "string"
                                ? error
                                : "Failed to sign in with Google"
                            );
                          }
                        } catch (error: any) {
                          setErrorMsg("An error occurred with Google sign in");
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                    >
                      <Image
                        source={require("../../assets/images/google.png")}
                        className="w-6 h-6 lg:w-4 lg:h-4"
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="w-12 h-12 lg:w-10 lg:h-10 bg-dark-200 rounded-full items-center justify-center"
                      onPress={async () => {
                        setLoading(true);
                        setErrorMsg("");
                        try {
                          const { success, error } = await signInWithApple();
                          if (!success && error) {
                            setErrorMsg(
                              typeof error === "string"
                                ? error
                                : "Failed to sign in with Apple"
                            );
                          }
                        } catch (error: any) {
                          setErrorMsg("An error occurred with Apple sign in");
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                    >
                      <Image
                        source={require("../../assets/images/apple.png")}
                        className="w-6 h-6 lg:w-4 lg:h-4"
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
