import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState(() => {
    // Load location from localStorage on mount
    return localStorage.getItem("userLocation") || "";
  });
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://streetup.onrender.com";

  // Save location to localStorage whenever it changes
  useEffect(() => {
    if (location) {
      localStorage.setItem("userLocation", location);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !location || !category || !description) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${baseUrl}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ title, location, category, description }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to post question");
      }

      const data = await response.json();

      toast({
        title: "Success!",
        description:
          "Your question has been posted. The community will help you find the best recommendations!",
      });

      // Reset form
      setTitle("");
      setCategory("");
      setDescription("");
      // Keep location in localStorage for next question

      // Redirect to explore page after 2 seconds
      setTimeout(() => navigate("/explore"), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Ask the Community</CardTitle>
            <CardDescription className="text-base mt-2">
              Get authentic local food recommendations from people who know best
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold">
                  What are you looking for?
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Best vegetarian restaurant near work"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-base"
                />
              </div>

              {/* Location Field */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-base font-semibold flex items-center gap-2">
                  <MapPin size={18} />
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Bangalore, Indiranagar"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="text-base"
                />
                <p className="text-xs text-gray-500">
                  Your location will be saved for future questions
                </p>
              </div>

              {/* Category Field */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-semibold flex items-center gap-2">
                  <HelpCircle size={18} />
                  Food Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                    <SelectItem value="bakery">Bakery</SelectItem>
                    <SelectItem value="cafe">Cafe</SelectItem>
                    <SelectItem value="fast-food">Fast Food</SelectItem>
                    <SelectItem value="street-food">Street Food</SelectItem>
                    <SelectItem value="desserts">Desserts</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold">
                  Tell us more (optional but recommended)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Share details like: budget, dietary preferences, ambiance, timing, or any specific requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-32 text-base"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-base py-6"
              >
                {isSubmitting ? "Posting your question..." : "Post Question"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AskQuestion;
