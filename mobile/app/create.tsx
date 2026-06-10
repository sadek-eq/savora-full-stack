import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { ChefHat, Plus, Trash2, Save, ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function CreateRecipeScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);

  return (
    <View className="flex-1 bg-background">
      <View className="p-6 pt-14 border-b border-muted bg-card flex-row items-center justify-between">
        <Pressable onPress={() => router.back()}><ArrowLeft size={24} color="black" /></Pressable>
        <Text className="text-xl font-serif font-bold">New Recipe</Text>
        <Pressable className="bg-primary px-4 py-2 rounded-full"><Text className="text-white font-bold">Save</Text></Pressable>
      </View>
      <ScrollView className="p-6">
        <TextInput placeholder="Recipe Title" value={title} onChangeText={setTitle} className="text-3xl font-serif font-bold border-b border-muted pb-2 mb-8" />
        <Text className="text-xl font-serif font-bold mb-4">Ingredients</Text>
        {ingredients.map((ing, i) => (
          <View key={i} className="flex-row gap-2 mb-2">
            <TextInput placeholder="Qty" value={ing.quantity} className="bg-muted p-3 rounded-xl w-16" />
            <TextInput placeholder="Ingredient name" value={ing.name} className="bg-muted p-3 rounded-xl flex-1" />
          </View>
        ))}
        <Pressable onPress={() => setIngredients([...ingredients, { name: "", quantity: "" }])} className="p-4 bg-muted/30 rounded-2xl border border-dashed border-muted items-center mt-2">
          <Text className="text-muted-foreground font-bold">+ Add Ingredient</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
