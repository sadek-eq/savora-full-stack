import { View, Text, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { Settings, LogOut, ChevronRight, Utensils, Heart, Calendar } from "lucide-react-native";

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-background p-6">
      <View className="flex-row items-center mb-10">
        <Image source={{ uri: "https://images.unsplash.com/photo-1577214495773-550614ffcc7c?w=400" }} className="w-24 h-24 rounded-full border-4 border-primary/20" />
        <View className="ml-6 flex-1">
          <Text className="text-3xl font-serif font-bold">Chef Julian</Text>
          <Text className="text-muted-foreground text-lg mb-2">@chefjulian</Text>
        </View>
      </View>
      <View className="bg-card border border-muted rounded-[2rem] p-2 mb-10">
        <MenuItem icon={<Utensils size={22} color="#E8960C" />} label="My Recipes" />
        <MenuItem icon={<Heart size={22} color="#D4845A" />} label="Saved Recipes" />
      </View>
    </ScrollView>
  );
}

function MenuItem({ icon, label }: { icon: any, label: string }) {
  return (
    <Pressable className="flex-row items-center p-5 rounded-[2rem]">
      <View className="w-12 h-12 bg-muted items-center justify-center rounded-2xl">{icon}</View>
      <Text className="flex-1 ml-4 text-lg font-bold">{label}</Text>
      <ChevronRight size={20} color="#D1D5DB" />
    </Pressable>
  );
}
