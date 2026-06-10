"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChefHat, Sparkles, Plus, ArrowRight } from "lucide-react";

export default function PantryPage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addIngredient = () => {
    if (current.trim()) {
      setIngredients([...ingredients, current.trim()]);
      setCurrent("");
    }
  };

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/pantry-suggest", {
        method: "POST",
        body: JSON.stringify({ ingredients }),
      });
      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-accent rounded-2xl">
          <ChefHat className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold">Pantry Mode</h1>
          <p className="text-muted-foreground">What's in your kitchen? I'll suggest recipes you can make.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-card rounded-3xl border shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-serif font-bold">Your Ingredients</h2>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-muted border-none rounded-xl px-4 py-2"
                placeholder="Egg, flour, milk..."
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addIngredient()}
              />
              <Button size="icon" onClick={addIngredient} className="rounded-xl">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ing, i) => (
                <span key={i} className="px-3 py-1 bg-muted rounded-full text-sm font-medium">
                  {ing}
                </span>
              ))}
            </div>
            <Button
              className="w-full rounded-xl"
              disabled={ingredients.length < 2 || loading}
              onClick={getSuggestions}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Chef is thinking..." : "Suggest Recipes"}
            </Button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-serif font-bold">AI Suggestions</h2>
          {suggestions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestions.map((s, i) => (
                <div key={i} className="bg-card rounded-3xl border shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-serif font-bold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{s.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-accent">{s.cookTimeMinutes}m • {s.difficulty}</span>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                      View <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed text-muted-foreground">
              Add at least 2 ingredients to see suggestions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
