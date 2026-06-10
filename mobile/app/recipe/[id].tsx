import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { ChevronLeft, Clock, Users, Flame, Play } from "lucide-react-native";
import { useState, useEffect } from "react";
import ImageColors from "react-native-image-colors";

const API_URL = "https://savora.vercel.app/api";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [bgColor, setBgColor] = useState("#E8960C");

  const { data: recipe } = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/recipes/${id}`);
      return res.json();
    },
  });

  useEffect(() => {
    if (recipe?.mainImageUrl) {
      ImageColors.getColors(recipe.mainImageUrl, {
        fallback: "#E8960C",
        cache: true,
        key: recipe.mainImageUrl,
      }).then((colors: any) => {
        if (colors.platform === "ios") setBgColor(colors.primary);
        else if (colors.platform === "android") setBgColor(colors.dominant);
      });
    }
  }, [recipe]);

  if (!recipe) return null;

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="h-[450] relative" style={{ backgroundColor: bgColor }}>
          <Image
            source={{ uri: recipe.mainImageUrl }}
            className="w-full h-full opacity-60"
            contentFit="cover"
          />
          <Pressable
            onPress={() => router.back()}
            className="absolute top-12 left-6 bg-white/20 p-2 rounded-full backdrop-blur-md"
          >
            <ChevronLeft size={24} color="white" />
          </Pressable>
          <View className="absolute bottom-8 left-6 right-6">
            <Text className="text-white text-4xl font-serif font-bold mb-4 shadow-sm">
              {recipe.title}
            </Text>
            <View className="flex-row gap-3">
              <Badge icon={<Clock size={14} color="white" />} label={`${recipe.cookTimeMinutes}m`} />
              <Badge icon={<Users size={14} color="white" />} label={`${recipe.servings} serving`} />
              <Badge icon={<Flame size={14} color="white" />} label={`${recipe.calories} kcal`} />
            </View>
          </View>
        </View>

        <View className="p-6">
          <Text className="text-muted-foreground text-lg mb-8 italic">
            "{recipe.description}"
          </Text>

          <View className="mb-10">
            <Text className="text-2xl font-serif font-bold mb-4">Ingredients</Text>
            {recipe.ingredients.map((ing: any, i: number) => (
              <View key={i} className="flex-row items-center mb-3 bg-muted/30 p-4 rounded-2xl">
                <View className="w-2 h-2 rounded-full bg-primary mr-3" />
                <Text className="text-base font-bold mr-2">{ing.quantity} {ing.unit}</Text>
                <Text className="text-base flex-1">{ing.name}</Text>
              </View>
            ))}
          </View>

          <View className="mb-20">
            <Text className="text-2xl font-serif font-bold mb-6">Instructions</Text>
            {recipe.steps.map((step: any, i: number) => (
              <View key={i} className="flex-row mb-8">
                <View className="w-10 h-10 rounded-full bg-primary items-center justify-center mr-4">
                  <Text className="text-white font-bold text-lg">{i + 1}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg leading-7 mb-4">{step.instruction}</Text>
                  {step.imageUrl && (
                    <Image
                      source={{ uri: step.imageUrl }}
                      className="w-full h-48 rounded-3xl"
                      contentFit="cover"
                    />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-10 left-6 right-6">
        <Pressable
          onPress={() => router.push(`/recipe/${id}/cook`)}
          className="bg-primary flex-row items-center justify-center py-5 rounded-3xl shadow-xl shadow-primary/40"
        >
          <Play size={24} color="white" fill="white" className="mr-2" />
          <Text className="text-white text-xl font-bold ml-2">Start Cooking</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Badge({ icon, label }: { icon: any, label: string }) {
  return (
    <View className="flex-row items-center bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">
      {icon}
      <Text className="text-white text-xs font-bold ml-1.5">{label}</Text>
    </View>
  );
}
