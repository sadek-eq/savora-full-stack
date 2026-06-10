"use client";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default function ProfilePage() {
  const { user } = useUser();
  if (!user) return null;
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-serif font-bold">{user.fullName}</h1>
    </div>
  );
}
