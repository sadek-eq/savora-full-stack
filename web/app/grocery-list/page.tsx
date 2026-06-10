"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ShoppingBasket, CheckCircle2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function GroceryListPage() {
  const { user } = useUser();
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems([...items, { id: Math.random().toString(), name: newItem, checked: false }]);
    setNewItem("");
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="container py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-secondary rounded-2xl">
          <ShoppingBasket className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold">Grocery List</h1>
          <p className="text-muted-foreground">Keep track of what you need for your next meal</p>
        </div>
      </div>

      <div className="bg-card rounded-3xl border shadow-sm p-6 space-y-6">
        <div className="flex gap-2">
          <Input
            placeholder="Add an item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            className="rounded-xl"
          />
          <Button onClick={addItem} className="rounded-xl">
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                item.checked ? "bg-muted/50 border-transparent" : "bg-white border-border"
              }`}
            >
              <div
                className="flex items-center gap-3 cursor-pointer flex-1"
                onClick={() => toggleItem(item.id)}
              >
                {item.checked ? (
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                ) : (
                  <div className="h-6 w-6 rounded-full border-2 border-muted" />
                )}
                <span className={`text-lg ${item.checked ? "line-through text-muted-foreground" : "font-medium"}`}>
                  {item.name}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Your grocery list is empty. Start adding items!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
