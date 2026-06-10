import { View, Text, ScrollView, Pressable, Platform } from "react-native";
import { useState, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Camera } from "expo-camera";
import { Image } from "expo-image";
import * as Speech from "expo-speech";
import { ChevronLeft, ChevronRight, Volume2, Timer, Camera as CameraIcon, X } from "lucide-react-native";

export default function CookingModeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const { data: recipe } = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const res = await fetch(`https://savora.vercel.app/api/recipes/${id}`);
      return res.json();
    },
  });

  if (!recipe) return null;
  const step = recipe.steps[currentStep];

  return (
    <View className="flex-1 bg-background">
      <View className="pt-14 px-6 pb-4 border-b border-muted bg-white flex-row justify-between items-center">
        <Pressable onPress={() => router.back()}><X size={24} /></Pressable>
        <Text className="font-bold">Step {currentStep + 1} of {recipe.steps.length}</Text>
        <View className="w-6" />
      </View>
      <ScrollView className="flex-1 p-6">
        {step.imageUrl && <Image source={{ uri: step.imageUrl }} className="w-full h-64 rounded-[2rem] mb-8" contentFit="cover" />}
        <Text className="text-3xl font-serif font-bold text-center leading-[44]">{step.instruction}</Text>
        <Pressable onPress={() => Speech.speak(step.instruction)} className="mt-8 bg-muted self-center px-6 py-3 rounded-full flex-row items-center">
          <Volume2 size={20} /><Text className="font-bold ml-2">Read Aloud</Text>
        </Pressable>
      </ScrollView>
      {isCameraOpen && (
        <View className="absolute inset-0 bg-black z-50">
          <Camera className="flex-1" />
          <Pressable onPress={() => setIsCameraOpen(false)} className="absolute top-14 right-6 bg-white/20 p-3 rounded-full"><X color="white" /></Pressable>
        </View>
      )}
      <View className="p-8 border-t border-muted bg-white flex-row justify-between items-center">
        <Pressable onPress={() => setCurrentStep(Math.max(0, currentStep - 1))} className={currentStep === 0 ? "opacity-20" : ""}><ChevronLeft size={32}/></Pressable>
        <Pressable onPress={() => setIsCameraOpen(true)} className="bg-secondary p-4 rounded-2xl"><CameraIcon size={28} color="white" /></Pressable>
        <Pressable onPress={() => {
          if (currentStep < recipe.steps.length - 1) setCurrentStep(currentStep + 1);
          else router.push(`/recipe/${id}/complete`);
        }}><ChevronRight size={32}/></Pressable>
      </View>
    </View>
  );
}
