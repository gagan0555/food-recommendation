import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Award, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-food.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 -z-10" />
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Discover authentic{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  local food
                </span>{" "}
                from real people
              </h1>
              <p className="text-xl text-muted-foreground">
                Join StreetUp - where newcomers find the best local eats through authentic community recommendations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="text-lg">
                  <Link to="/explore">Explore Food</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg">
                  <Link to="/ask">Ask a Question</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl blur-3xl -z-10" />
              <img
                src={heroImage}
                alt="Delicious street food"
                className="rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How StreetUp Works</h2>
            <p className="text-muted-foreground text-lg">Simple, authentic, community-driven</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center space-y-3 p-6 rounded-xl bg-card hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Search</h3>
              <p className="text-sm text-muted-foreground">Browse food recommendations by location and category</p>
            </div>
            
            <div className="text-center space-y-3 p-6 rounded-xl bg-card hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-full flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg">Ask</h3>
              <p className="text-sm text-muted-foreground">Post your food queries and get local insights</p>
            </div>
            
            <div className="text-center space-y-3 p-6 rounded-xl bg-card hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg">Contribute</h3>
              <p className="text-sm text-muted-foreground">Share your local food knowledge with the community</p>
            </div>
            
            <div className="text-center space-y-3 p-6 rounded-xl bg-card hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Vote</h3>
              <p className="text-sm text-muted-foreground">Upvote the best answers to help others</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary via-accent to-secondary p-1 rounded-3xl">
            <div className="bg-card rounded-3xl p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to discover amazing local food?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Join thousands of food lovers sharing authentic recommendations in their communities.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/explore">Explore Food</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Landing;