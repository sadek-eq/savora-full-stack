"use client";
import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import RecipeCard from "@/components/recipe-card";

export default function DiscoverPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-serif font-bold mb-8 text-center">Discover New Flavors</h1>

      {loading ? (
        <div className="flex justify-center py-20">Loading...</div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {recipes.map((recipe: any) => (
            <div key={recipe.id} className="mb-4">
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </Masonry>
      )}
    </div>
  );
}
