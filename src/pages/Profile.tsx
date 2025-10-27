import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Calendar, Edit, ThumbsUp, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const userProfile = {
    name: "Shivam",
    location: "Mumbai, Maharashtra",
    joinedDate: "January 2024",
    stats: {
      answers: 42,
      questions: 15,
      upvotes: 238,
    },
  };
  
  const recentActivity = [
    {
      id: "1",
      type: "answer",
      title: "Best vada pav in Dadar?",
      timestamp: "2 hours ago",
      upvotes: 12,
    },
    {
      id: "2",
      type: "question",
      title: "Late night biryani in Bandra?",
      timestamp: "1 day ago",
      answers: 8,
    },
    {
      id: "3",
      type: "answer",
      title: "South Indian breakfast in Andheri?",
      timestamp: "2 days ago",
      upvotes: 18,
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
                    {userProfile.name[0]}
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
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Stats */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center space-y-1">
                    <p className="text-3xl font-bold text-primary">{userProfile.stats.answers}</p>
                    <p className="text-sm text-muted-foreground">Answers</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 text-center space-y-1">
                    <p className="text-3xl font-bold text-secondary">{userProfile.stats.questions}</p>
                    <p className="text-sm text-muted-foreground">Questions</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 text-center space-y-1">
                    <p className="text-3xl font-bold text-accent">{userProfile.stats.upvotes}</p>
                    <p className="text-sm text-muted-foreground">Upvotes</p>
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
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
