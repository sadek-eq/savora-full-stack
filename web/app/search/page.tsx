"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Filter } from "lucide-react";
import RecipeGrid from "@/components/recipe-grid";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("all");

  const performSearch = async () => {
    setLoading(true);
    const url = new URL("/api/recipes", window.location.origin);
    if (query) url.searchParams.set("q", query);
    if (category !== "all") url.searchParams.set("category", category);
    const res = await fetch(url.toString());
    setRecipes(await res.json());
    setLoading(false);
  };

  useEffect(() => { performSearch(); }, [category]);

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="relative">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
          <Input
            className="h-16 pl-16 rounded-3xl shadow-lg text-xl"
            placeholder="Search recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && performSearch()}
          />
        </div>
        <div className="flex gap-2">
          {["all", "breakfast", "lunch", "dinner"].map(cat => (
            <Button key={cat} variant={category === cat ? "default" : "outline"} onClick={() => setCategory(cat)} className="capitalize rounded-full">
              {cat}
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-12">
        {loading ? <div className="text-center py-20">Loading...</div> : <RecipeGrid recipes={recipes} />}
      </div>
    </div>
  );
}
