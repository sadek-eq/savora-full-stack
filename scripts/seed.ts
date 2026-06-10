import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../web/lib/db/schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: './web/.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const SAMPLE_RECIPES = [
  {
    title: "Golden Turmeric Roasted Cauliflower",
    description: "A vibrant, healthy side dish with a kick of spice and earthy turmeric.",
    category: "lunch",
    difficulty: "easy",
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    servings: 4,
    calories: 120,
    protein: 3,
    carbs: 12,
    fat: 7,
    mainImageUrl: "https://images.unsplash.com/photo-1541530239255-a6e5b426615b?auto=format&fit=crop&q=80&w=1000",
    tags: ["healthy", "vegan", "roasted"],
    dietaryTags: ["vegan", "gluten-free"],
    ingredients: [
      { name: "Cauliflower", quantity: "1", unit: "head" },
      { name: "Turmeric", quantity: "1", unit: "tsp" },
      { name: "Olive Oil", quantity: "2", unit: "tbsp" },
      { name: "Salt", quantity: "0.5", unit: "tsp" }
    ],
    steps: [
      { stepNumber: 1, instruction: "Preheat oven to 400°F (200°C).", timerSeconds: 0 },
      { stepNumber: 2, instruction: "Cut cauliflower into bite-sized florets.", timerSeconds: 0 },
      { stepNumber: 3, instruction: "Toss with oil, turmeric, and salt.", timerSeconds: 0 },
      { stepNumber: 4, instruction: "Roast for 25 minutes until golden and tender.", timerSeconds: 1500 }
    ]
  },
  // ... Adding more recipes would follow this pattern.
  // For the sake of the task, I'll generate a few more diverse ones.
  {
    title: "Classic Spaghetti Carbonara",
    description: "Authentic Roman carbonara with creamy egg sauce and crispy guanciale.",
    category: "dinner",
    difficulty: "medium",
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    servings: 2,
    calories: 650,
    protein: 25,
    carbs: 70,
    fat: 35,
    mainImageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=1000",
    tags: ["pasta", "italian", "classic"],
    dietaryTags: [],
    ingredients: [
      { name: "Spaghetti", quantity: "200", unit: "g" },
      { name: "Guanciale", quantity: "100", unit: "g" },
      { name: "Pecorino Romano", quantity: "50", unit: "g" },
      { name: "Eggs", quantity: "2", unit: "large" }
    ],
    steps: [
      { stepNumber: 1, instruction: "Boil spaghetti in salted water.", timerSeconds: 600 },
      { stepNumber: 2, instruction: "Fry guanciale until crispy.", timerSeconds: 300 },
      { stepNumber: 3, instruction: "Whisk eggs and cheese in a bowl.", timerSeconds: 0 },
      { stepNumber: 4, instruction: "Toss pasta with meat, then quickly with egg mixture.", timerSeconds: 0 }
    ]
  },
  {
    title: "Overnight Chia Pudding",
    description: "A nutritious breakfast prep that saves time in the morning.",
    category: "breakfast",
    difficulty: "easy",
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    servings: 1,
    calories: 250,
    protein: 8,
    carbs: 20,
    fat: 15,
    mainImageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1000",
    tags: ["breakfast", "mealprep", "healthy"],
    dietaryTags: ["vegetarian"],
    ingredients: [
      { name: "Chia Seeds", quantity: "3", unit: "tbsp" },
      { name: "Almond Milk", quantity: "1", unit: "cup" },
      { name: "Honey", quantity: "1", unit: "tsp" },
      { name: "Berries", quantity: "0.25", unit: "cup" }
    ],
    steps: [
      { stepNumber: 1, instruction: "Mix seeds, milk, and honey in a jar.", timerSeconds: 0 },
      { stepNumber: 2, instruction: "Shake well and refrigerate overnight.", timerSeconds: 28800 },
      { stepNumber: 3, instruction: "Top with fresh berries and enjoy.", timerSeconds: 0 }
    ]
  }
];

async function seed() {
  console.log('Seeding database...');

  // Create a mock user first
  const mockUserId = 'user_2N7X3pYV9a0Z1b2C3d4E5f6G7h8';
  await db.insert(schema.users).values({
    id: mockUserId,
    displayName: 'Chef Savora',
    avatarUrl: 'https://images.unsplash.com/photo-1577214495773-550614ffcc7c?auto=format&fit=crop&q=80&w=200',
    subscriptionTier: 'pro'
  }).onConflictDoNothing();

  for (const r of SAMPLE_RECIPES) {
    const { ingredients: ingData, steps: stepData, ...recipeData } = r;

    const [insertedRecipe] = await db.insert(schema.recipes).values({
      ...recipeData,
      userId: mockUserId,
    } as any).returning();

    await db.insert(schema.ingredients).values(
      ingData.map((ing, i) => ({ ...ing, recipeId: insertedRecipe.id, orderIndex: i }))
    );

    await db.insert(schema.steps).values(
      stepData.map((step) => ({ ...step, recipeId: insertedRecipe.id }))
    );
  }

  console.log('Seed completed successfully!');
}

seed().catch(console.error);
