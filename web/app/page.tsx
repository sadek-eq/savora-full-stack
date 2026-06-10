import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChefHat, Sparkles, Smartphone, Camera } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-serif font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Cook Smarter, <span className="text-primary">Savor More</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                The AI-powered recipe platform that turns your kitchen into a 5-star experience.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/discover">
                <Button size="lg" className="px-8">Get Started Free</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="px-8">View Pro Chef</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Sparkles className="h-10 w-10 text-primary" />}
            title="AI Recipe Generation"
            description="Extract recipes from videos, photos, or just a name in seconds."
          />
          <FeatureCard
            icon={<ChefHat className="h-10 w-10 text-secondary" />}
            title="Smart Cooking Mode"
            description="Voice-guided steps with built-in timers for a hands-free experience."
          />
          <FeatureCard
            icon={<Camera className="h-10 w-10 text-accent" />}
            title="Live Camera AI"
            description="Get real-time feedback on your cooking progress via your camera."
          />
          <FeatureCard
            icon={<Smartphone className="h-10 w-10 text-primary" />}
            title="Pinterest Discovery"
            description="Browse a beautiful, infinite feed of community recipes."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center p-6 bg-card rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-serif font-bold mb-2">{title}</h3>
      <p className="text-center text-muted-foreground">{description}</p>
    </div>
  );
}
