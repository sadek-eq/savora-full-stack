"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Volume2, Timer, Camera, X } from "lucide-react";
import Image from "next/image";

export default function CookingModePage() {
  const { id } = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch(`/api/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => setRecipe(data));
  }, [id]);

  useEffect(() => {
    if (recipe?.steps[currentStep]?.timerSeconds) {
      setTimeLeft(recipe.steps[currentStep].timerSeconds);
    } else {
      setTimeLeft(null);
    }
  }, [currentStep, recipe]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((prev) => (prev ? prev - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  const analyzeProgress = async () => {
    if (!canvasRef.current || !videoRef.current) return;
    const context = canvasRef.current.getContext("2d");
    context?.drawImage(videoRef.current, 0, 0, 640, 480);
    const image = canvasRef.current.toDataURL("image/jpeg").split(",")[1];

    setFeedback("Chef is looking...");
    const res = await fetch("/api/ai/analyze-food-camera", {
      method: "POST",
      body: JSON.stringify({
        image,
        recipeName: recipe.title,
        stepInstruction: recipe.steps[currentStep].instruction,
      }),
    });
    const data = await res.json();
    setFeedback(data.feedback);
  };

  if (!recipe) return null;

  const progress = ((currentStep + 1) / recipe.steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-background z-[100] flex flex-col">
      <div className="p-4 border-b flex items-center justify-between bg-white">
        <Button variant="ghost" onClick={() => router.back()}>
          <X className="h-6 w-6" />
        </Button>
        <div className="flex-1 px-8">
          <Progress value={progress} className="h-2" />
        </div>
        <div className="font-serif font-bold">
          Step {currentStep + 1} of {recipe.steps.length}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
        <div className="max-w-3xl w-full space-y-8">
          {recipe.steps[currentStep].imageUrl && (
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <Image src={recipe.steps[currentStep].imageUrl} alt="Step" fill className="object-cover" />
            </div>
          )}

          <div className="space-y-4 text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
              {recipe.steps[currentStep].instruction}
            </h2>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="lg" onClick={() => speak(recipe.steps[currentStep].instruction)}>
                <Volume2 className="mr-2 h-5 w-5" /> Read Aloud
              </Button>
              {timeLeft !== null && (
                <div className="flex items-center px-6 py-2 bg-primary/10 text-primary rounded-full font-bold text-xl">
                  <Timer className="mr-2 h-6 w-6" />
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isCameraOpen && (
        <div className="fixed inset-0 bg-black/90 z-[110] flex flex-col items-center justify-center p-8">
          <div className="relative w-full max-w-2xl aspect-video rounded-3xl overflow-hidden border-4 border-white/20">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <canvas ref={canvasRef} width="640" height="480" className="hidden" />
            {feedback && (
              <div className="absolute bottom-4 left-4 right-4 bg-primary text-white p-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom">
                <p className="font-medium text-lg text-center">{feedback}</p>
              </div>
            )}
          </div>
          <div className="mt-8 flex gap-4">
            <Button size="lg" variant="secondary" onClick={analyzeProgress}>
              <Camera className="mr-2 h-5 w-5" /> Analyze Progress
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" onClick={() => setIsCameraOpen(false)}>
              Close Camera
            </Button>
          </div>
        </div>
      )}

      <div className="p-8 border-t bg-white flex justify-between items-center">
        <Button
          variant="outline"
          size="xl"
          className="h-16 px-8 text-xl"
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(currentStep - 1)}
        >
          <ChevronLeft className="mr-2 h-8 w-8" /> Previous
        </Button>

        <Button
          variant="secondary"
          size="xl"
          className="h-16 px-8 text-xl"
          onClick={startCamera}
        >
          <Camera className="mr-2 h-8 w-8" /> Live AI Assistant
        </Button>

        <Button
          size="xl"
          className="h-16 px-8 text-xl"
          onClick={() => {
            if (currentStep < recipe.steps.length - 1) {
              setCurrentStep(currentStep + 1);
            } else {
              router.push(`/recipe/${id}/complete`);
            }
          }}
        >
          {currentStep === recipe.steps.length - 1 ? "Finish" : "Next"} <ChevronRight className="ml-2 h-8 w-8" />
        </Button>
      </div>
    </div>
  );
}
