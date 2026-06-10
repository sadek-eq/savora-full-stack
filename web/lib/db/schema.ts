import { pgTable, text, timestamp, uuid, integer, boolean, real, primaryKey, unique, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table (synced with Clerk)
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  subscriptionTier: text("subscription_tier", { enum: ["free", "pro"] }).default("free").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Recipes table
export const recipes = pgTable("recipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  mainImageUrl: text("main_image_url"),
  category: text("category"),
  tags: text("tags").array(),
  prepTimeMinutes: integer("prep_time_minutes"),
  cookTimeMinutes: integer("cook_time_minutes"),
  servings: integer("servings"),
  difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] }),
  calories: integer("calories"),
  protein: integer("protein"),
  carbs: integer("carbs"),
  fat: integer("fat"),
  dietaryTags: text("dietary_tags").array(),
  isPublic: boolean("is_public").default(true).notNull(),
  isAiGenerated: boolean("is_ai_generated").default(false).notNull(),
  sourceType: text("source_type", { enum: ["manual", "video", "name", "photo"] }),
  sourceUrl: text("source_url"),
  averageRating: real("average_rating").default(0).notNull(),
  ratingCount: integer("rating_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Ingredients table
export const ingredients = pgTable("ingredients", {
  id: uuid("id").primaryKey().defaultRandom(),
  recipeId: uuid("recipe_id").references(() => recipes.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  quantity: text("quantity"),
  unit: text("unit"),
  orderIndex: integer("order_index"),
});

// Steps table
export const steps = pgTable("steps", {
  id: uuid("id").primaryKey().defaultRandom(),
  recipeId: uuid("recipe_id").references(() => recipes.id, { onDelete: "cascade" }).notNull(),
  stepNumber: integer("step_number").notNull(),
  instruction: text("instruction").notNull(),
  imageUrl: text("image_url"),
  timerSeconds: integer("timer_seconds"),
});

// Ratings table
export const ratings = pgTable("ratings", {
  id: uuid("id").primaryKey().defaultRandom(),
  recipeId: uuid("recipe_id").references(() => recipes.id, { onDelete: "cascade" }).notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  score: integer("score").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Saved recipes table
export const savedRecipes = pgTable("saved_recipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id).notNull(),
  recipeId: uuid("recipe_id").references(() => recipes.id, { onDelete: "cascade" }).notNull(),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
});

// AI usage tracking
export const aiUsage = pgTable("ai_usage", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id).notNull(),
  monthYear: text("month_year").notNull(), // e.g., "2024-06"
  generationCount: integer("generation_count").default(0).notNull(),
}, (table) => ({
  unq: unique().on(table.userId, table.monthYear),
}));

// Grocery list items
export const groceryItems = pgTable("grocery_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  quantity: text("quantity"),
  unit: text("unit"),
  category: text("category"),
  checked: boolean("checked").default(false).notNull(),
  fromRecipeId: uuid("from_recipe_id").references(() => recipes.id),
});

// Meal plan entries
export const mealPlanEntries = pgTable("meal_plan_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id).notNull(),
  weekStart: date("week_start").notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6
  mealType: text("meal_type", { enum: ["breakfast", "lunch", "dinner", "snack"] }).notNull(),
  recipeId: uuid("recipe_id").references(() => recipes.id).notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  recipes: many(recipes),
  ratings: many(ratings),
  savedRecipes: many(savedRecipes),
  aiUsage: many(aiUsage),
  groceryItems: many(groceryItems),
  mealPlanEntries: many(mealPlanEntries),
}));

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  user: one(users, { fields: [recipes.userId], references: [users.id] }),
  ingredients: many(ingredients),
  steps: many(steps),
  ratings: many(ratings),
  savedBy: many(savedRecipes),
  mealPlanEntries: many(mealPlanEntries),
}));

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
  recipe: one(recipes, { fields: [ingredients.recipeId], references: [recipes.id] }),
}));

export const stepsRelations = relations(steps, ({ one }) => ({
  recipe: one(recipes, { fields: [steps.recipeId], references: [recipes.id] }),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  recipe: one(recipes, { fields: [ratings.recipeId], references: [recipes.id] }),
  user: one(users, { fields: [ratings.userId], references: [users.id] }),
}));

export const savedRecipesRelations = relations(savedRecipes, ({ one }) => ({
  recipe: one(recipes, { fields: [savedRecipes.recipeId], references: [recipes.id] }),
  user: one(users, { fields: [savedRecipes.userId], references: [users.id] }),
}));

export const groceryItemsRelations = relations(groceryItems, ({ one }) => ({
  user: one(users, { fields: [groceryItems.userId], references: [users.id] }),
  recipe: one(recipes, { fields: [groceryItems.fromRecipeId], references: [recipes.id] }),
}));

export const mealPlanEntriesRelations = relations(mealPlanEntries, ({ one }) => ({
  user: one(users, { fields: [mealPlanEntries.userId], references: [users.id] }),
  recipe: one(recipes, { fields: [mealPlanEntries.recipeId], references: [recipes.id] }),
}));
