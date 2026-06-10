import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Clock, Star } from "lucide-react-native";

export default function RecipeCard({ recipe }: { recipe: any }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/recipe/${recipe.id}`)}
      className="bg-card rounded-3xl overflow-hidden border border-muted shadow-sm"
    >
      <View className="relative aspect-[4/5]">
        <Image
          source={{ uri: recipe.mainImageUrl }}
          contentFit="cover"
          className="w-full h-full"
        />
        <View className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded-lg flex-row items-center">
          <Clock size={12} color="white" />
          <Text className="text-white text-[10px] ml-1 font-bold">
            {recipe.cookTimeMinutes}m
          </Text>
        </View>
      </View>
      <View className="p-3">
        <Text className="font-serif font-bold text-base text-foreground mb-1" numberOfLines={1}>
          {recipe.title}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            {recipe.difficulty}
          </Text>
          <View className="flex-row items-center">
            <Star size={12} color="#E8960C" fill="#E8960C" />
            <Text className="text-primary text-[10px] ml-1 font-bold">
              {recipe.averageRating.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
