import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Clock, User } from "lucide-react";

interface Question {
  _id: string;
  title: string;
  location: string;
  category: string;
  description: string;
  author?: string;
  createdAt: string;
}

interface Answer {
  _id: string;
  author: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [answerContent, setAnswerContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://streetup.onrender.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch question
        const questionRes = await fetch(`${baseUrl}/questions/${id}`);
        if (!questionRes.ok) {
          throw new Error("Failed to fetch question");
        }
        const questionData = await questionRes.json();
        setQuestion(questionData);

        // Fetch answers for this question
        const answersRes = await fetch(`${baseUrl}/answers/${id}`);
        if (!answersRes.ok) {
          throw new Error("Failed to fetch answers");
        }
        const answersData = await answersRes.json();
        setAnswers(answersData);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast({
          title: "Error",
          description: (err as Error).message || "Failed to load question",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, baseUrl, toast]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!answerContent.trim()) {
      toast({
        title: "Error",
        description: "Answer content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${baseUrl}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          question_id: id,
          content: answerContent,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit answer");
      }

      toast({
        title: "Success!",
        description: "Your answer has been posted!",
      });

      setAnswerContent("");

      // Refresh answers list
      const answersRes = await fetch(`${baseUrl}/answers/${id}`);
      if (answersRes.ok) {
        const answersData = await answersRes.json();
        setAnswers(answersData);
      }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading question...</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Question not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full py-8 px-4">
        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl mb-4">{question.title}</CardTitle>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{question.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{new Date(question.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {question.category}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{question.description}</p>
          </CardContent>
        </Card>

        {/* Answers Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">
            Answers ({answers.length})
          </h2>

          {answers.length === 0 ? (
            <p className="text-gray-500 mb-8">
              No answers yet. Be the first to share!
            </p>
          ) : (
            <div className="space-y-4 mb-8">
              {answers.map((answer) => (
                <Card key={answer._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <span className="font-semibold">{answer.author}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(answer.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{answer.content}</p>
                    <div className="flex gap-4">
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        👍 Upvote ({answer.upvotes})
                      </button>
                      <button className="text-sm text-red-600 hover:text-red-800">
                        👎 Downvote ({answer.downvotes})
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Answer Form */}
        <Card>
          <CardHeader>
            <CardTitle>Share Your Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <Textarea
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="Share your local food recommendation and experiences..."
                className="min-h-32"
              />
              <Button
                type="submit"
                disabled={isSubmitting || !answerContent.trim()}
                className="w-full"
              >
                {isSubmitting ? "Posting..." : "Post Answer"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default QuestionDetail;
