import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FoodCard from "@/components/FoodCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockQuestions = [
  {
    id: "1",
    title: "Best tacos in downtown Austin?",
    location: "Austin, TX",
    category: "Mexican",
    description: "Looking for authentic street tacos, preferably near 6th street. Any recommendations?",
    upvotes: 24,
    answers: 8,
    verified: true,
  },
  {
    id: "2",
    title: "Authentic ramen spots in Brooklyn",
    location: "Brooklyn, NY",
    category: "Japanese",
    description: "New to the area and craving some good ramen. What are the locals' favorites?",
    upvotes: 18,
    answers: 12,
  },
  {
    id: "3",
    title: "Where to find the best pizza in Chicago?",
    location: "Chicago, IL",
    category: "Italian",
    description: "Not talking about deep dish. Looking for thin crust, New York style pizza.",
    upvotes: 31,
    answers: 15,
    verified: true,
  },
  {
    id: "4",
    title: "Late night food trucks in Portland",
    location: "Portland, OR",
    category: "Street Food",
    description: "What are the best food trucks that stay open past midnight?",
    upvotes: 12,
    answers: 5,
  },
  {
    id: "5",
    title: "Vegan burger joints in San Francisco",
    location: "San Francisco, CA",
    category: "Vegan",
    description: "Looking for plant-based burgers that actually taste good!",
    upvotes: 27,
    answers: 9,
    verified: true,
  },
  {
    id: "6",
    title: "Best dim sum in Seattle?",
    location: "Seattle, WA",
    category: "Chinese",
    description: "Visiting this weekend, would love authentic dim sum recommendations.",
    upvotes: 15,
    answers: 6,
  },
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Explore Food Recommendations</h1>
            <p className="text-muted-foreground text-lg">
              Discover authentic local food recommendations from your community
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for food, location, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="mexican">Mexican</SelectItem>
                <SelectItem value="japanese">Japanese</SelectItem>
                <SelectItem value="italian">Italian</SelectItem>
                <SelectItem value="street-food">Street Food</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
              </SelectContent>
            </Select>
            
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
            
            <Button variant="outline" size="icon">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Food Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockQuestions.map((question) => (
              <FoodCard key={question.id} {...question} />
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Explore;
