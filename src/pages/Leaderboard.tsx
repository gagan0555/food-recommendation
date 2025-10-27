import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Award, Star, TrendingUp } from "lucide-react";

const leaderboardData = [
  {
    rank: 1,
    name: "Carlos Rodriguez",
    points: 2850,
    answers: 142,
    verified: 89,
    badge: "Food Legend",
    badgeColor: "bg-gradient-to-r from-yellow-400 to-orange-500",
  },
  {
    rank: 2,
    name: "Sarah Mitchell",
    points: 2340,
    answers: 118,
    verified: 76,
    badge: "Local Expert",
    badgeColor: "bg-gradient-to-r from-blue-400 to-cyan-500",
  },
  {
    rank: 3,
    name: "Mike Chen",
    points: 1920,
    answers: 95,
    verified: 61,
    badge: "Foodie Guide",
    badgeColor: "bg-gradient-to-r from-green-400 to-emerald-500",
  },
  {
    rank: 4,
    name: "Jessica Lopez",
    points: 1675,
    answers: 84,
    verified: 52,
    badge: "Taste Maker",
    badgeColor: "bg-gradient-to-r from-purple-400 to-pink-500",
  },
  {
    rank: 5,
    name: "David Kim",
    points: 1450,
    answers: 72,
    verified: 45,
    badge: "Food Scout",
    badgeColor: "bg-gradient-to-r from-red-400 to-rose-500",
  },
];

const Leaderboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Community Leaderboard</h1>
            <p className="text-muted-foreground text-lg">
              Celebrating our top contributors who help others discover amazing food
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="pt-6 text-center space-y-2">
                <Star className="h-8 w-8 text-primary mx-auto" />
                <p className="text-3xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground">Total Contributors</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5">
              <CardContent className="pt-6 text-center space-y-2">
                <Award className="h-8 w-8 text-secondary mx-auto" />
                <p className="text-3xl font-bold">8,543</p>
                <p className="text-sm text-muted-foreground">Verified Answers</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
              <CardContent className="pt-6 text-center space-y-2">
                <TrendingUp className="h-8 w-8 text-accent mx-auto" />
                <p className="text-3xl font-bold">15,892</p>
                <p className="text-sm text-muted-foreground">Community Upvotes</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Leaderboard */}
          <div className="space-y-4">
            {leaderboardData.map((user) => (
              <Card
                key={user.rank}
                className={`hover:shadow-lg transition-all duration-300 ${
                  user.rank <= 3 ? "border-2 border-primary/20" : ""
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-6">
                    {/* Rank */}
                    <div className="text-center min-w-[60px]">
                      {user.rank <= 3 ? (
                        <div className={`text-4xl font-bold ${
                          user.rank === 1 ? "text-yellow-500" :
                          user.rank === 2 ? "text-gray-400" :
                          "text-amber-600"
                        }`}>
                          #{user.rank}
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-muted-foreground">
                          #{user.rank}
                        </div>
                      )}
                    </div>
                    
                    {/* Avatar */}
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg font-semibold">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold truncate">{user.name}</h3>
                        <Badge className={`${user.badgeColor} text-white border-0`}>
                          {user.badge}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>{user.answers} answers</span>
                        <span className="text-secondary font-medium">
                          {user.verified} verified
                        </span>
                      </div>
                    </div>
                    
                    {/* Points */}
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        {user.points.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">points</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* How to Earn Points */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">How to Earn Points</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-xs">+5</span>
                  </div>
                  <div>
                    <p className="font-medium">Post an answer</p>
                    <p className="text-muted-foreground">Help others with your knowledge</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-xs">+10</span>
                  </div>
                  <div>
                    <p className="font-medium">Get an upvote</p>
                    <p className="text-muted-foreground">Quality answers get rewarded</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-secondary font-bold text-xs">+25</span>
                  </div>
                  <div>
                    <p className="font-medium">Get verified</p>
                    <p className="text-muted-foreground">Earn verified badge on answers</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-accent font-bold text-xs">+50</span>
                  </div>
                  <div>
                    <p className="font-medium">Best answer</p>
                    <p className="text-muted-foreground">Selected as the best answer</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
