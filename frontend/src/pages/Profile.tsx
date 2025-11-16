import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, Edit, ThumbsUp, MessageCircle, Save, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://streetup.onrender.com";

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const authUser = localStorage.getItem("authUser");
      const authToken = localStorage.getItem("authToken");

      if (!authUser || !authToken) {
        navigate("/auth");
        return;
      }

      const user = JSON.parse(authUser);
      
      // Fetch full profile data from backend
      const response = await fetch(`${baseUrl}/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
          navigate("/auth");
          return;
        }
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      
      // Set user profile with backend data + stats
      setUserProfile({
        name: data.name || user.name,
        email: data.email || user.email,
        location: data.location || "Not provided",
        joinedDate: data.joinedDate || "Recently",
        stats: {
          answers: data.stats?.answers || 0,
          questions: data.stats?.questions || 0,
          upvotes: data.stats?.upvotes || 0,
        },
      });

      setEditName(data.name || user.name);
      setEditLocation(data.location || "");

      // Fetch user's recent activity
      fetchRecentActivity();
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast({ title: "Error", description: "Failed to load profile", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");

      // Fetch user's questions
      const questionsResponse = await fetch(`${baseUrl}/user/questions`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // Fetch user's answers
      const answersResponse = await fetch(`${baseUrl}/user/answers`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (questionsResponse.ok && answersResponse.ok) {
        const questions = await questionsResponse.json();
        const answers = await answersResponse.json();

        // Combine and sort by date
        const activity = [
          ...questions.map((q: any) => ({
            id: q._id,
            type: "question",
            title: q.title,
            timestamp: new Date(q.createdAt).toLocaleDateString(),
            answers: q.answers,
          })),
          ...answers.map((a: any) => ({
            id: a._id,
            type: "answer",
            title: a.content?.substring(0, 50) + "...",
            timestamp: new Date(a.createdAt).toLocaleDateString(),
            upvotes: a.upvotes,
          })),
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

        setRecentActivity(activity);
      }
    } catch (err) {
      console.error("Error fetching activity:", err);
      // Fallback to mock data if endpoint not available
      setRecentActivity([]);
    }
  };

const handleSaveProfile = async () => {
  if (!editName.trim()) {
    toast({ title: "Error", description: "Name cannot be empty", variant: "destructive" });
    return;
  }

  try {
    setIsSaving(true);
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/auth");
      return;
    }

    const response = await fetch(`${baseUrl}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        name: editName.trim(),
        location: editLocation.trim(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update profile");
    }

    const data = await response.json();

    // Update state
    const updatedProfile = {
      ...userProfile,
      name: editName,
      location: editLocation,
    };
    setUserProfile(updatedProfile);

    // Update localStorage
    const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
    localStorage.setItem("authUser", JSON.stringify({ ...authUser, name: editName }));

    toast({ title: "Success!", description: "Profile updated successfully" });
    setIsEditing(false);
  } catch (err) {
    console.error("Error saving profile:", err);
    toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
  } finally {
    setIsSaving(false);
  }
};


  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    toast({ title: "Logged out", description: "You have been successfully logged out" });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Profile not found</p>
        </main>
        <Footer />
      </div>
    );
  }

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
                    {userProfile.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {!isEditing ? (
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{userProfile.name}</h1>
                        <p className="text-sm text-muted-foreground mb-3">{userProfile.email}</p>
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
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                        <Button variant="destructive" onClick={handleLogout}>
                          Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 space-y-4">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          placeholder="Your location"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveProfile} disabled={isSaving}>
                          <Save className="h-4 w-4 mr-2" />
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
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
                  {recentActivity.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No recent activity</p>
                  ) : (
                    recentActivity.map((activity) => (
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
                              <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                            </div>
                            <p className="font-medium">{activity.title}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {activity.type === "answer" ? (
                              <>
                                <ThumbsUp className="h-4 w-4" />
                                <span>{activity.upvotes || 0}</span>
                              </>
                            ) : (
                              <>
                                <MessageCircle className="h-4 w-4" />
                                <span>{activity.answers || 0}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
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
