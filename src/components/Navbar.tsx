import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Utensils, Search, User } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Utensils className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              StreetUp
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/explore"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/explore") ? "text-primary" : "text-foreground"
              }`}
            >
              Explore
            </Link>
            <Link
              to="/ask"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/ask") ? "text-primary" : "text-foreground"
              }`}
            >
              Ask Question
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/explore">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/profile">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
