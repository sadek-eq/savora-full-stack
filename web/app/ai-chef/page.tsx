"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChefHat, Send, Video, Image as ImageIcon, Sparkles, Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import RecipeCard from "@/components/recipe-card";

export default function AIChefPage() {
  const [messages, setMessages] = useState<any[]>([
    { role: "assistant", text: "Hello! I'm your Savora AI Chef. How can I help you today? You can ask for a recipe, paste a cooking video URL, or upload a food photo!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Check if it's a video URL
      if (input.includes("youtube.com") || input.includes("tiktok.com")) {
        const res = await fetch("/api/ai/generate-from-video", {
          method: "POST",
          body: JSON.stringify({ videoUrl: input }),
        });
        const recipe = await res.json();
        setMessages(prev => [...prev, { role: "assistant", text: "I've extracted this recipe for you!", recipe }]);
      } else {
        const res = await fetch("/api/ai/chef-chat", {
          method: "POST",
          body: JSON.stringify({
            message: input,
            history: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
          }),
        });
        const data = await res.json();
        setMessages(prev => [...prev, { role: "assistant", text: data.text }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary rounded-2xl">
          <ChefHat className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold">AI Chef Chat</h1>
          <p className="text-muted-foreground">Your personal culinary expert powered by Gemini</p>
        </div>
      </div>

      <div className="flex-1 bg-card rounded-3xl border shadow-sm flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  m.role === "user" ? "bg-primary text-white" : "bg-muted"
                }`}>
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  {m.recipe && (
                    <div className="mt-4 w-64">
                      <RecipeCard recipe={m.recipe} />
                      <Button variant="secondary" className="w-full mt-2" size="sm">
                        <Save className="mr-2 h-4 w-4" /> Save to My Cookbook
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted p-4 rounded-2xl animate-pulse">
                  Chef is thinking...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-muted/50">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full flex-shrink-0">
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Ask anything or paste a video URL..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="rounded-full px-6"
            />
            <Button onClick={handleSend} className="rounded-full px-6" disabled={loading}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex gap-2 mt-2 px-2">
            <QuickAction label="Generate from name" icon={<Sparkles className="h-3 w-3" />} />
            <QuickAction label="Extract from video" icon={<Video className="h-3 w-3" />} />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ label, icon }: { label: string, icon: React.ReactNode }) {
  return (
    <button className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
      {icon} {label}
    </button>
  );
}
