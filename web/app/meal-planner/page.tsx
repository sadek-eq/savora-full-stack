"use client";
import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";

export default function MealPlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const mealTypes = ["breakfast", "lunch", "dinner", "snack"];

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-serif font-bold">Meal Planner</h1>
        <div className="flex items-center gap-4 bg-card border rounded-2xl p-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addDays(currentDate, -7))}><ChevronLeft/></Button>
          <span className="font-bold">{format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d")}</span>
          <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addDays(currentDate, 7))}><ChevronRight/></Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {days.map(day => (
          <div key={day.toString()} className="space-y-4">
            <div className={`p-4 rounded-2xl text-center border-2 ${isSameDay(day, new Date()) ? "bg-primary text-white border-primary" : "bg-card"}`}>
              <div className="text-xs uppercase font-bold">{format(day, "EEE")}</div>
              <div className="text-2xl font-serif font-bold">{format(day, "d")}</div>
            </div>
            {mealTypes.map(type => (
              <div key={type} className="bg-card border-2 border-dashed rounded-2xl p-4 text-center opacity-40 hover:opacity-100 cursor-pointer transition-opacity">
                <span className="text-[10px] font-bold uppercase">{type}</span>
                <Plus size={16} className="mx-auto mt-2"/>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
