import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Award, MapPin, Calendar, Edit, ThumbsUp, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const userProfile = {
    name: "Sarah Mitchell",
    location: "Brooklyn, NY",
    joinedDate: "January 2024",
    points: 2340,
    rank: 2,
    badge: "Local Expert",
    stats: {
      answers: 118,
      verified: 76,
      upvotes: 892,
      questions: 23,
    },
    badges: [
      { name: "First Answer", icon: "🎯", earned: true },
      { name: "10 Upvotes", icon: "⭐", earned: true },
      { name: "Verified Expert", icon: "✓", earned: true },
      { name: "Top Contributor", icon: "🏆", earned: false },
      { name: "100 Answers", icon: "💯", earned: false },
      { name: "Community Hero", icon: "🦸", earned: false },
    ],
  };
  
  const recentActivity = [
    {
      id: "1",
      type: "answer",
      title: "Best tacos in downtown Austin?",
      timestamp: "2 hours ago",
      upvotes: 15,
    },
    {
      id: "2",
      type: "question",
      title: "Late night pizza delivery in Brooklyn?",
      timestamp: "1 day ago",
      answers: 8,
    },
    {
      id: "3",
      type: "answer",
      title: "Vegan options in Manhattan?",
      timestamp: "2 days ago",
      upvotes: 23,
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="h-32 w-32">
                  <AvatarFallback className="text-4xl font-bold">
                    {userProfile.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{userProfile.name}</h1>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{userProfile.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Joined {userProfile.joinedDate}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white border-0">
                      <Award className="h-3 w-3 mr-1" />
                      {userProfile.badge}
                    </Badge>
                    <Badge variant="secondary">
                      Rank #{userProfile.rank}
                    </Badge>
                    <Badge variant="outline" className="text-primary border-primary">
                      {userProfile.points.toLocaleString()} points
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Stats */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center space-y-1">
                    <p className="text-3xl font-bold text-primary">{userProfile.stats.answers}</p>
                    <p className="text-sm text-muted-foreground">Answers</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 text-center space-y-1">
                    <p className="text-3xl font-bold text-secondary">{userProfile.stats.verified}</p>
                    <p className="text-sm text-muted-foreground">Verified</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 text-center space-y-1">
                    <p className="text-3xl font-bold text-accent">{userProfile.stats.upvotes}</p>
                    <p className="text-sm text-muted-foreground">Upvotes</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 text-center space-y-1">
                    <p className="text-3xl font-bold">{userProfile.stats.questions}</p>
                    <p className="text-sm text-muted-foreground">Questions</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity) => (
                    <Link
                      key={activity.id}
                      to={`/question/${activity.id}`}
                      className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {activity.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {activity.timestamp}
                            </span>
                          </div>
                          <p className="font-medium">{activity.title}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {activity.type === "answer" ? (
                            <>
                              <ThumbsUp className="h-4 w-4" />
                              <span>{activity.upvotes}</span>
                            </>
                          ) : (
                            <>
                              <MessageCircle className="h-4 w-4" />
                              <span>{activity.answers}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            {/* Badges */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {userProfile.badges.map((badge) => (
                      <div
                        key={badge.name}
                        className={`text-center space-y-2 p-3 rounded-lg ${
                          badge.earned
                            ? "bg-primary/10"
                            : "bg-muted/50 opacity-50"
                        }`}
                      >
                        <div className="text-3xl">{badge.icon}</div>
                        <p className="text-xs font-medium leading-tight">
                          {badge.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
