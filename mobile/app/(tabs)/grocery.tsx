import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { ShoppingBasket, Plus, Trash2, CheckCircle2 } from "lucide-react-native";

export default function GroceryScreen() {
  const [items, setItems] = useState([{ id: "1", name: "Whole Milk", checked: false }]);
  const [input, setInput] = useState("");

  const addItem = () => {
    if (!input) return;
    setItems([{ id: Math.random().toString(), name: input, checked: false }, ...items]);
    setInput("");
  };

  return (
    <View className="flex-1 bg-background p-4">
      <View className="flex-row items-center mb-6">
        <TextInput placeholder="Add item..." value={input} onChangeText={setInput} className="flex-1 bg-card h-14 rounded-2xl px-4 border border-muted" />
        <Pressable onPress={addItem} className="bg-primary p-4 rounded-2xl ml-2"><Plus size={24} color="white" /></Pressable>
      </View>
      <ScrollView>
        {items.map(item => (
          <Pressable key={item.id} onPress={() => setItems(items.map(i => i.id === item.id ? {...i, checked: !i.checked} : i))} className="flex-row items-center p-4 bg-card mb-2 rounded-2xl border border-muted">
            {item.checked ? <CheckCircle2 color="#4A7C59" /> : <View className="w-6 h-6 border-2 border-muted rounded-full" />}
            <Text className={`ml-4 text-lg ${item.checked ? "line-through text-muted-foreground" : ""}`}>{item.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
