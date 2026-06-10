import { View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useState, useRef } from "react";
import { Send } from "lucide-react-native";

export default function AIChefScreen() {
  const [messages, setMessages] = useState([{ role: "assistant", text: "How can I help you today?" }]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input) return;
    const userMsg = { role: "user", text: input };
    setMessages([...messages, userMsg]);
    setInput("");

    const res = await fetch("https://savora.vercel.app/api/ai/chef-chat", {
      method: "POST",
      body: JSON.stringify({ message: input, history: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })) }),
    });
    const data = await res.json();
    setMessages(prev => [...prev, { role: "assistant", text: data.text }]);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-background" keyboardVerticalOffset={100}>
      <ScrollView className="flex-1 p-4">
        {messages.map((m, i) => (
          <View key={i} className={`mb-4 max-w-[80%] p-4 rounded-3xl ${m.role === "user" ? "bg-primary self-end" : "bg-muted self-start"}`}>
            <Text className={m.role === "user" ? "text-white" : "text-foreground"}>{m.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View className="p-4 bg-card border-t border-muted flex-row items-center">
        <TextInput placeholder="Ask chef..." value={input} onChangeText={setInput} className="flex-1 bg-muted h-12 rounded-full px-4" />
        <Pressable onPress={handleSend} className="bg-primary p-3 rounded-full ml-2"><Send size={20} color="white" /></Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
