"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
        toast.success("Recipe created successfully!");
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
          <p className="text-muted-foreground">Share your culinary masterpiece with the world.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <section className="bg-card p-8 rounded-3xl border shadow-sm space-y-6">
            <div className="space-y-2">
              <Label>Recipe Title</Label>
              <Input
                placeholder="e.g. Grandma's Famous Lasagna"
                className="text-xl font-bold py-6 rounded-xl"
                value={recipe.title}
                onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Tell us the story behind this dish..."
                className="min-h-[120px] rounded-xl"
                value={recipe.description}
                onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  className="w-full bg-muted border-none rounded-xl px-4 py-2"
                  value={recipe.category}
                  onChange={(e) => setRecipe({ ...recipe, category: e.target.value })}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-card p-8 rounded-3xl border shadow-sm space-y-6">
            <h2 className="text-2xl font-serif font-bold">Ingredients</h2>
            <div className="space-y-4">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder="Qty"
                    className="w-20 rounded-xl"
                    value={ing.quantity}
                    onChange={(e) => {
                      const newIngs = [...ingredients];
                      newIngs[i].quantity = e.target.value;
                      setIngredients(newIngs);
                    }}
                  />
                  <Input
                    placeholder="Unit"
                    className="w-24 rounded-xl"
                    value={ing.unit}
                    onChange={(e) => {
                      const newIngs = [...ingredients];
                      newIngs[i].unit = e.target.value;
                      setIngredients(newIngs);
                    }}
                  />
                  <Input
                    placeholder="Ingredient name"
                    className="flex-1 rounded-xl"
                    value={ing.name}
                    onChange={(e) => {
                      const newIngs = [...ingredients];
                      newIngs[i].name = e.target.value;
                      setIngredients(newIngs);
                    }}
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeIngredient(i)} className="text-muted-foreground">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full rounded-xl" onClick={addIngredient}>
                <Plus className="mr-2 h-4 w-4" /> Add Ingredient
              </Button>
            </div>
          </section>

          <section className="bg-card p-8 rounded-3xl border shadow-sm space-y-6">
            <h2 className="text-2xl font-serif font-bold">Instructions</h2>
            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={i} className="space-y-4 p-4 bg-muted/30 rounded-2xl relative">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">Step {i + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeStep(i)} className="text-muted-foreground">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Explain this step..."
                    className="rounded-xl"
                    value={step.instruction}
                    onChange={(e) => {
                      const newSteps = [...steps];
                      newSteps[i].instruction = e.target.value;
                      setSteps(newSteps);
                    }}
                  />
                </div>
              ))}
              <Button variant="outline" className="w-full rounded-xl" onClick={addStep}>
                <Plus className="mr-2 h-4 w-4" /> Add Step
              </Button>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <Button className="w-full py-8 text-xl rounded-2xl shadow-xl shadow-primary/20" disabled={loading} onClick={handleSubmit}>
            <Save className="mr-2 h-6 w-6" /> {loading ? "Publishing..." : "Publish Recipe"}
          </Button>
        </div>
      </div>
    </div>
  );
}
