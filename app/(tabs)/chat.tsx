import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import InterText from '../../components/InterText';
import { GoogleGenerativeAI } from '@google/generative-ai';
// import { GEN_AI_KEY } from '@env';
// Define message interface
interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
  isLoading?: boolean;
  isError?: boolean;
}

// Initialize the Gemini AI with your API key
const genAI = new GoogleGenerativeAI('AIzaSyAxWR5_y8AoHxiMp0VV-lZR1yr5s7jRxqA');
// const genAI = new GoogleGenerativeAI(process.env.GEN_AI_KEY || '');
// const genAI = new GoogleGenerativeAI(GEN_AI_KEY);

// Configure the Gemini model
const MODEL_NAME = 'gemini-2.0-flash';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! How can I help you today?', isBot: true, timestamp: '10:30 AM' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  // Function to call Gemini API using the Google GenAI library
  const getAIResponse = async (userMessage: string) => {
    try {
      setIsLoading(true);
      
      console.log(`Calling Gemini API (${MODEL_NAME}) with message:`, userMessage);
      
      // Get the model
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      
      // Generate content
      const result = await model.generateContent(userMessage);
      const response = await result.response;
      const text = response.text();
      
      console.log("API Response:", text);
      
      return text;
    } catch (error: any) {
      console.error('Error in getAIResponse:', error);
      
      // Handle common errors
      if (error.message?.includes('API key')) {
        throw new Error('API Key Error: Invalid or missing API key. Please check your Gemini API key.');
      }
      
      if (error.message?.includes('403')) {
        throw new Error('Authorization Error: Your API key doesn\'t have permission to access this model. Make sure you have enabled the Gemini API in Google Cloud Console.');
      }
      
      if (error.message?.includes('404')) {
        throw new Error(`Model Error: The model "${MODEL_NAME}" was not found. Check if the model name is correct.`);
      }
      
      if (error.message?.includes('429')) {
        throw new Error('Rate Limit Exceeded: You have sent too many requests. Please wait a few minutes and try again.');
      }
      
      // Generic error
      throw new Error(`AI Error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (message.trim() === '') return;
    
    const newMessage = {
      id: Date.now().toString(),
      text: message,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    const userMessageText = message;
    setMessage('');
    
    try {
      // Add loading message
      const loadingMsgId = Date.now() + 1;
      setMessages(prev => [...prev, {
        id: loadingMsgId.toString(),
        text: '...',
        isBot: true,
        isLoading: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      
      // Get response from AI
      const botResponseText = await getAIResponse(userMessageText);
      
      // Remove loading message
      setMessages(prev => prev.filter(msg => msg.id !== loadingMsgId.toString()));
      
      // Add AI response
      const botResponse = {
        id: (Date.now() + 2).toString(),
        text: botResponseText,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error: any) {
      // Remove loading message if it exists
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      // Show the actual error message
      const errorResponse = {
        id: (Date.now() + 2).toString(),
        text: error.message || "API Error. Please check console for details.",
        isBot: true,
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, errorResponse]);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessage = ({ item }: { item: Message }) => (
    <View 
      className={`mb-4 max-w-[80%] ${item.isBot ? 'self-start' : 'self-end'}`}
    >
      <View 
        className={`rounded-2xl p-3 ${
          item.isBot 
            ? 'bg-dark-200 rounded-tl-none' 
            : 'bg-primary rounded-tr-none'
        }`}
      >
        {item.isLoading ? (
          <ActivityIndicator size="small" color="#9CA3AF" />
        ) : item.isError ? (
          <InterText className="text-red-500 text-base">
            {item.text}
          </InterText>
        ) : (
          <InterText className={`${item.isBot ? 'text-gray-100' : 'text-white'} text-base`}>
            {item.text}
          </InterText>
        )}
      </View>
      <InterText className="text-gray-400 text-xs mt-1 ml-1">
        {item.timestamp}
      </InterText>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-dark-300"
    >
      {/* Header */}
      <View className="bg-dark-200 pt-12 pb-4 px-4 border-b border-dark-100">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-primary items-center justify-center mr-3">
            <Feather name="message-circle" size={20} color="white" />
          </View>
          <View>
            <InterText className="text-white text-lg font-semibold">Hylo AI Assistant</InterText>
            <InterText className="text-gray-400 text-xs">Powered by Google Gemini 2.0</InterText>
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList<Message>
        ref={flatListRef}
        className="flex-1 px-4 pt-4"
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item: Message) => item.id}
        contentContainerStyle={{ flexGrow: 1 }}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Message Input */}
      <View className="p-4 border-t border-dark-100 bg-dark-200">
        <View className="flex-row items-center bg-dark-100 rounded-full px-4 py-2">
          <TextInput
            className="flex-1 text-white mr-2 py-2"
            placeholder="Ask me anything..."
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
            multiline
            editable={!isLoading}
          />
          <TouchableOpacity 
            onPress={sendMessage}
            disabled={isLoading || message.trim() === ''}
            className={`${isLoading || message.trim() === '' ? 'bg-gray-600' : 'bg-primary'} w-10 h-10 rounded-full items-center justify-center`}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Feather name="send" size={18} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chat;