import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FoodCard from "@/components/FoodCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Explore = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Fetch questions on component mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Filter and sort questions
  useEffect(() => {
    let filtered = [...questions];

    // Search filter (search across title, location, and description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.title?.toLowerCase().includes(query) ||
          q.location?.toLowerCase().includes(query) ||
          q.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (category !== "all") {
      filtered = filtered.filter((q) => q.category?.toLowerCase() === category.toLowerCase());
    }

    // Sort
    if (sortBy === "trending") {
      filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    } else if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (sortBy === "upvotes") {
      filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    } else if (sortBy === "answers") {
      filtered.sort((a, b) => (b.answers || 0) - (a.answers || 0));
    }

    setFilteredQuestions(filtered);
  }, [searchQuery, category, sortBy, questions]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${baseUrl}/questions`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      
      const data = await response.json();
      setQuestions(data || []);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to load recommendations. Please try again.");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Explore Food Recommendations</h1>
            <p className="text-muted-foreground text-lg">
              Discover authentic local food recommendations from your community
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for food, location, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Category Filter */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="street food">Street Food</SelectItem>
                <SelectItem value="south indian">South Indian</SelectItem>
                <SelectItem value="north indian">North Indian</SelectItem>
                <SelectItem value="biryani">Biryani</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
                <SelectItem value="desserts">Desserts</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="upvotes">Most Upvoted</SelectItem>
                <SelectItem value="answers">Most Answers</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Filter Button */}
            <Button variant="outline" size="icon" onClick={fetchQuestions}>
              <Filter className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading recommendations...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
              <p>{error}</p>
              <Button variant="outline" size="sm" onClick={fetchQuestions} className="mt-2">
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredQuestions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-lg">No recommendations found</p>
              <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
            </div>
          )}
          
          {/* Food Cards Grid */}
          {!loading && filteredQuestions.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuestions.map((question) => (
                <FoodCard 
                  key={question._id || question.id} 
                  question={question}
                  id={question._id || question.id}
                  title={question.title}
                  location={question.location}
                  category={question.category}
                  description={question.description}
                  upvotes={question.upvotes || 0}
                  answers={question.answers || 0}
                  verified={question.verified || false}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Explore;
