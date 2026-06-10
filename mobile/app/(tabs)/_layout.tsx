import { Tabs } from "expo-router";
import { ChefHat, Home, Search, ShoppingBasket, User } from "lucide-react-native";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#E8960C",
        tabBarStyle: {
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          backgroundColor: "#FFF8F0",
          borderTopWidth: 1,
          borderTopColor: "#F5EDE4",
        },
        headerStyle: {
          backgroundColor: "#FFF8F0",
        },
        headerTitleStyle: {
          fontFamily: "serif",
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Discover",
          tabBarIcon: ({ color }) => <Home size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <Search size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ai-chef"
        options={{
          title: "AI Chef",
          tabBarIcon: ({ color }) => (
            <View className="bg-primary p-3 rounded-2xl -mt-8 shadow-lg shadow-primary/40">
              <ChefHat size={32} color="white" />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="grocery"
        options={{
          title: "Grocery",
          tabBarIcon: ({ color }) => <ShoppingBasket size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
