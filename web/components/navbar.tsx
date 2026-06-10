import Link from "next/link";
import { UserButton, SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ChefHat, Search, PlusCircle, MessageSquare, UtensilsCrossed } from "lucide-react";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <ChefHat className="h-8 w-8 text-primary" />
          <span className="font-serif text-2xl font-bold tracking-tight">Savora</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/discover" className="hover:text-primary transition-colors">Discover</Link>
          <Link href="/ai-chef" className="hover:text-primary transition-colors">AI Chef</Link>
          <Link href="/pantry" className="hover:text-primary transition-colors">Pantry</Link>
          <Link href="/grocery-list" className="hover:text-primary transition-colors">Grocery</Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/search">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <SignedIn>
            <Link href="/create">
              <Button variant="ghost" size="icon">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>Get Started</Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
