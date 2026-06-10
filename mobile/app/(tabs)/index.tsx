import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import RecipeCard from "../../components/RecipeCard";

const API_URL = "https://savora.vercel.app/api";

export default function DiscoverScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const { data: recipes, isLoading, refetch } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/recipes`);
      return res.json();
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <ScrollView
      className="flex-1 bg-background p-4"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text className="text-3xl font-serif font-bold mb-6 text-foreground">Discover</Text>

      <View className="flex-row flex-wrap justify-between">
        {recipes?.map((recipe: any) => (
          <View key={recipe.id} className="w-[48%] mb-4">
            <RecipeCard recipe={recipe} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
