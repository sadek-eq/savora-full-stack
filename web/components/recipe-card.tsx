import Link from "next/link";
import Image from "next/image";
import { Clock, Star, User } from "lucide-react";

export default function RecipeCard({ recipe }: { recipe: any }) {
  return (
    <Link href={`/recipe/${recipe.id}`}>
      <div className="bg-card rounded-2xl overflow-hidden shadow-sm border hover:scale-[1.02] transition-transform cursor-pointer">
        <div className="relative aspect-[4/5]">
          <Image
            src={recipe.mainImageUrl || "/placeholder-food.jpg"}
            alt={recipe.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-lg text-xs flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {recipe.cookTimeMinutes + (recipe.prepTimeMinutes || 0)}m
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-serif font-bold text-lg mb-1 line-clamp-1">{recipe.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-muted-foreground">
              <User className="h-3 w-3 mr-1" />
              {recipe.user?.displayName || "Chef"}
            </div>
            <div className="flex items-center text-xs font-bold text-primary">
              <Star className="h-3 w-3 mr-1 fill-primary" />
              {recipe.averageRating.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
