"use client";
import Masonry from "react-masonry-css";
import RecipeCard from "./recipe-card";

export default function RecipeGrid({ recipes }: { recipes: any[] }) {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex -ml-4 w-auto"
      columnClassName="pl-4 bg-clip-padding"
    >
      {recipes?.map((recipe: any) => (
        <div key={recipe.id} className="mb-4">
          <RecipeCard recipe={recipe} />
        </div>
      ))}
    </Masonry>
  );
}
