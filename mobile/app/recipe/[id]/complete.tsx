import { View, Text, Pressable } from "react-native";
import { CheckCircle2, ChefHat, Star, Share2 } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function CookingCompleteScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background p-6 items-center justify-center">
      <Text className="text-4xl font-serif font-bold text-center">Chef's Kiss!</Text>
      <Pressable
        onPress={() => router.push("/(tabs)")}
        className="mt-8 bg-primary py-4 px-8 rounded-full"
      >
        <Text className="text-white font-bold">Done</Text>
      </Pressable>
    </View>
  );
}
