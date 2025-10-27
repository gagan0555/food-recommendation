import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp, ThumbsDown, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const QuestionDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [answer, setAnswer] = useState("");
  
  const question = {
    title: "Best vada pav in Dadar?",
    location: "Mumbai, Maharashtra",
    category: "Street Food",
    description: "Looking for authentic vada pav near Dadar station. I'm new to Mumbai and want to try the real local favorites. Any recommendations? Prefer places that are hygienic and affordable!",
    author: "Rahul K.",
    createdAt: "2 hours ago",
    upvotes: 24,
  };
  
  const answers = [
    {
      id: "1",
      author: "Priya S.",
      content: "You must try Aaswad near Dadar station! Their vada pav is legendary and super fresh. The chutney is amazing. Usually crowded but worth the wait. Very affordable at ₹20.",
      upvotes: 15,
      verified: true,
      createdAt: "1 hour ago",
    },
    {
      id: "2",
      author: "Amit P.",
      content: "Kirti College vada pav is a must-try! The stall right outside is famous. They make it fresh and the masala is perfect. Only ₹15 and really good quality.",
      upvotes: 8,
      verified: false,
      createdAt: "45 minutes ago",
    },
    {
      id: "3",
      author: "Sneha M.",
      content: "There's a small stall near Shivaji Park that makes excellent vada pav. Very hygienic and the taste is authentic. Usually has a line but moves fast!",
      upvotes: 12,
      verified: true,
      createdAt: "30 minutes ago",
    },
  ];
  
  const handleVote = (type: "up" | "down") => {
    toast({
      title: type === "up" ? "Upvoted!" : "Downvoted",
      description: "Thanks for your feedback!",
    });
  };
  
  const handleSubmitAnswer = () => {
    if (!answer.trim()) return;
    
    toast({
      title: "Answer posted!",
      description: "Your recommendation has been shared.",
    });
    setAnswer("");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Question Card */}
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <h1 className="text-3xl font-bold">{question.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{question.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{question.createdAt}</span>
                    </div>
                    <span>by {question.author}</span>
                  </div>
                  <Badge variant="outline">{question.category}</Badge>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleVote("up")}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <span className="font-semibold">{question.upvotes}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleVote("down")}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{question.description}</p>
            </CardContent>
          </Card>
          
          {/* Answers Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{answers.length} Answers</h2>
              <Button variant="outline">Sort by Upvotes</Button>
            </div>
            
            {answers.map((answer) => (
              <Card key={answer.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleVote("up")}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold">{answer.upvotes}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleVote("down")}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{answer.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{answer.author}</span>
                          {answer.verified && (
                            <Badge variant="secondary" className="text-xs">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground ml-auto">
                          {answer.createdAt}
                        </span>
                      </div>
                      <p className="text-foreground">{answer.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Add Answer */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Your Answer</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Share your recommendation... Be specific and helpful!"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={4}
              />
              <Button onClick={handleSubmitAnswer} disabled={!answer.trim()}>
                Post Answer
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default QuestionDetail;
