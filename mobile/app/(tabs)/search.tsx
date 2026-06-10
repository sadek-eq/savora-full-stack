import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { Search as SearchIcon, X } from "lucide-react-native";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  return (
    <View className="flex-1 bg-background p-4">
      <View className="flex-row items-center bg-card border border-muted rounded-2xl px-4 h-14 mb-6">
        <SearchIcon size={20} color="#6B7280" />
        <TextInput placeholder="Search recipes..." value={query} onChangeText={setQuery} className="flex-1 ml-3 h-full text-lg" />
      </View>
      <View className="flex-1 items-center justify-center opacity-40">
        <SearchIcon size={80} color="#D1D5DB" />
        <Text className="text-xl font-serif font-bold mt-4">Search for inspiration</Text>
      </View>
    </View>
  );
}
