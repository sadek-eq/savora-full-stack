"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CookingCompletePage() {
  return (
    <div className="container py-24 text-center">
      <h1 className="text-5xl font-serif font-bold">Chef's Kiss!</h1>
      <Button asChild className="mt-8">
        <Link href="/discover">Back to Discovery</Link>
      </Button>
    </div>
  );
}
