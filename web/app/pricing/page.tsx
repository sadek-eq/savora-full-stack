"use client";
import { Button } from "@/components/ui/button";
import { Check, Crown, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="container py-24 flex flex-col items-center">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">Simple Pricing</h1>
        <p className="text-xl text-muted-foreground">Unlock the full power of Savora AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Free Plan */}
        <div className="bg-card rounded-3xl border p-8 space-y-8 flex flex-col">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-muted-foreground">Free</h2>
            <div className="text-5xl font-bold font-serif">$0</div>
            <p className="text-muted-foreground">Start your cooking journey.</p>
          </div>

          <div className="space-y-4 flex-1">
            <FeatureItem label="5 AI Generations per month" />
            <FeatureItem label="Browse community recipes" />
            <FeatureItem label="Unlimited manual entry" />
            <FeatureItem label="Basic cooking mode" />
          </div>

          <Button variant="outline" className="w-full rounded-xl" asChild>
            <Link href="/discover">Current Plan</Link>
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="bg-card rounded-3xl border-4 border-primary p-8 space-y-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 rounded-bl-xl text-xs font-bold uppercase tracking-widest">
            Best Value
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-primary flex items-center">
              Pro Chef <Crown className="ml-2 h-5 w-5" />
            </h2>
            <div className="flex items-baseline">
              <span className="text-5xl font-bold font-serif">$4.99</span>
              <span className="text-muted-foreground ml-2">/month</span>
            </div>
            <p className="text-muted-foreground">Master your kitchen like a professional.</p>
          </div>

          <div className="space-y-4 flex-1">
            <FeatureItem label="Unlimited AI Generations" highlight />
            <FeatureItem label="Live Camera Cooking Feedback" highlight />
            <FeatureItem label="Weekly Meal Planner" highlight />
            <FeatureItem label="PDF Cookbook Export" highlight />
            <FeatureItem label="Ad-free Experience" highlight />
          </div>

          <Button className="w-full rounded-xl bg-primary text-white hover:bg-primary/90">
            Upgrade to Pro Chef
          </Button>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ label, highlight }: { label: string, highlight?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${highlight ? "bg-primary/20" : "bg-muted"}`}>
        <Check className={`h-4 w-4 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <span className={highlight ? "font-medium" : "text-muted-foreground"}>{label}</span>
    </div>
  );
}
