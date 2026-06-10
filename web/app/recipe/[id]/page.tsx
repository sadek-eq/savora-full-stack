"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Clock, Users, Flame, ChevronRight, PlayCircle } from "lucide-react";
import ColorThief from "colorthief";
import Link from "next/link";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [dominantColor, setDominantColor] = useState("rgb(232, 150, 12)");
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    fetch(`/api/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => setRecipe(data));
  }, [id]);

  const handleImageLoad = () => {
    const colorThief = new ColorThief();
    const img = imgRef.current;
    if (img && img.complete) {
      const color = colorThief.getColor(img);
      setDominantColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
    }
  };

  if (!recipe) return <div className="container py-20 text-center">Loading...</div>;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-[50vh] flex items-end p-8"
        style={{ backgroundColor: dominantColor }}
      >
        <Image
          ref={imgRef}
          src={recipe.mainImageUrl}
          alt={recipe.title}
          fill
          className="object-cover opacity-60 mix-blend-multiply"
          onLoad={handleImageLoad}
          crossOrigin="anonymous"
        />
        <div className="container relative z-10 text-white">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{recipe.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm font-medium">
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {recipe.servings} servings
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center">
              <Flame className="h-4 w-4 mr-2" />
              {recipe.calories} kcal
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Ingredients */}
          <section>
            <h2 className="text-2xl font-serif font-bold mb-6 flex items-center">
              Ingredients
              <span className="ml-4 h-px flex-1 bg-border" />
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipe.ingredients.map((ing: any) => (
                <li key={ing.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-xl">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium">{ing.quantity} {ing.unit}</span>
                  <span>{ing.name}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Steps */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold flex items-center flex-1">
                Instructions
                <span className="ml-4 h-px flex-1 bg-border" />
              </h2>
              <Link href={`/recipe/${id}/cook`}>
                <Button className="ml-4">
                  <PlayCircle className="mr-2 h-4 w-4" /> Start Cooking
                </Button>
              </Link>
            </div>
            <div className="space-y-8">
              {recipe.steps.map((step: any, index: number) => (
                <div key={step.id} className="flex gap-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="space-y-4">
                    <p className="text-lg leading-relaxed">{step.instruction}</p>
                    {step.imageUrl && (
                      <div className="relative aspect-video rounded-2xl overflow-hidden border">
                        <Image src={step.imageUrl} alt={`Step ${index + 1}`} fill className="object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="p-6 bg-card rounded-2xl shadow-sm border space-y-4">
            <h3 className="font-serif font-bold text-xl">About this dish</h3>
            <p className="text-muted-foreground">{recipe.description}</p>
            <div className="flex flex-wrap gap-2">
              {recipe.tags?.map((tag: string) => (
                <span key={tag} className="px-2 py-1 bg-muted rounded text-xs font-medium uppercase tracking-wider">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 bg-accent/10 rounded-2xl border border-accent/20 space-y-4">
            <h3 className="font-serif font-bold text-xl text-accent">Nutrition</h3>
            <div className="grid grid-cols-2 gap-4">
              <NutritionItem label="Protein" value={`${recipe.protein}g`} />
              <NutritionItem label="Carbs" value={`${recipe.carbs}g`} />
              <NutritionItem label="Fat" value={`${recipe.fat}g`} />
              <NutritionItem label="Fiber" value="5g" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NutritionItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-accent/10">
      <span className="text-sm font-medium">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
