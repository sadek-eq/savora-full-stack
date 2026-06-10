"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, ChefHat, Clock, Users, Flame } from "lucide-react";
import { toast } from "sonner";

export default function CreateRecipePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    category: "dinner",
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    servings: 2,
    difficulty: "easy",
    calories: 500,
    protein: 20,
    carbs: 50,
    fat: 20,
  });

  const [ingredients, setIngredients] = useState([{ name: "", quantity: "", unit: "" }]);
  const [steps, setSteps] = useState([{ instruction: "", timerSeconds: 0 }]);

  const addIngredient = () => setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));

  const addStep = () => setSteps([...steps, { instruction: "", timerSeconds: 0 }]);
  const removeStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!recipe.title) return toast.error("Title is required");
    setLoading(true);

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        body: JSON.stringify({ recipe, ingredients, steps }),
      });
      const data = await res.json();
      if (data.id) {
        toast.success("Recipe created!");
        router.push(`/recipe/${data.id}`);
      }
    } catch (error) {
      toast.error("Failed to create recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12 max-w-4xl">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-4 bg-primary rounded-3xl">
          <ChefHat className="h-10 w-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-serif font-bold">Create New Recipe</h1>
          <p className="text-muted-foreground">Share your culinary masterpiece.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <section className="bg-card p-8 rounded-3xl border shadow-sm space-y-6">
            <div className="space-y-2">
              <Label>Recipe Title</Label>
              <Input
                placeholder="Grandma's Famous Lasagna"
                value={recipe.title}
                onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="The story behind this dish..."
                value={recipe.description}
                onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
              />
            </div>
          </section>

          <section className="bg-card p-8 rounded-3xl border shadow-sm space-y-6">
            <h2 className="text-2xl font-serif font-bold">Ingredients</h2>
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2">
                <Input placeholder="Qty" className="w-20" value={ing.quantity} onChange={(e) => {
                  const n = [...ingredients]; n[i].quantity = e.target.value; setIngredients(n);
                }} />
                <Input placeholder="Unit" className="w-24" value={ing.unit} onChange={(e) => {
                  const n = [...ingredients]; n[i].unit = e.target.value; setIngredients(n);
                }} />
                <Input placeholder="Name" className="flex-1" value={ing.name} onChange={(e) => {
                  const n = [...ingredients]; n[i].name = e.target.value; setIngredients(n);
                }} />
                <Button variant="ghost" size="icon" onClick={() => removeIngredient(i)}><Trash2 size={16}/></Button>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={addIngredient}><Plus size={16} className="mr-2"/> Add Ingredient</Button>
          </section>
        </div>

        <div className="space-y-8">
          <Button className="w-full py-8 text-xl rounded-2xl shadow-xl" disabled={loading} onClick={handleSubmit}>
            <Save className="mr-2 h-6 w-6" /> {loading ? "Publishing..." : "Publish Recipe"}
          </Button>
        </div>
      </div>
    </div>
  );
}
