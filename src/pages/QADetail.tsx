
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockApi, Question, User } from "@/services/mockApi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Loader2, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const QADetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<{ [key: string]: User }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        
        const questionData = await mockApi.questions.getById(id);
        setQuestion(questionData);
        
        // Get all users involved in the question and answers
        const userIds = new Set([
          questionData.askedBy,
          ...questionData.answers.map(answer => answer.answeredBy)
        ]);
        
        const userData: { [key: string]: User } = {};
        for (const userId of userIds) {
          const user = await mockApi.users.getById(userId);
          userData[userId] = user;
        }
        
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching question:", error);
        navigate("/qa");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !user || !answerContent.trim()) return;
    
    setSubmitting(true);
    try {
      const updatedQuestion = await mockApi.questions.addAnswer(id, answerContent);
      
      // Get the user of the new answer
      const answerId = updatedQuestion.answers[updatedQuestion.answers.length - 1].id;
      const answeredBy = updatedQuestion.answers.find(a => a.id === answerId)?.answeredBy || '';
      
      if (!users[answeredBy] && answeredBy) {
        const userData = await mockApi.users.getById(answeredBy);
        setUsers(prev => ({...prev, [answeredBy]: userData}));
      }
      
      setQuestion(updatedQuestion);
      setAnswerContent("");
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold">Question not found</h2>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/qa")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Questions
        </Button>
      </div>
    );
  }

  const asker = users[question.askedBy];
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="mb-4 -ml-4"
        onClick={() => navigate("/qa")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Questions
      </Button>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{question.title}</CardTitle>
            <span className="rounded-full bg-muted px-2 py-1 text-xs">
              {question.status}
            </span>
          </div>
          <CardDescription className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={asker?.avatar} />
              <AvatarFallback>
                {asker?.name.substring(0, 2).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <span>
              Asked by {asker?.name || "Unknown"} on{" "}
              {formatDate(question.askedAt)}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{question.content}</p>
        </CardContent>
      </Card>

      {/* Answers */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <h2 className="text-lg font-semibold">
            {question.answers.length}{" "}
            {question.answers.length === 1 ? "Answer" : "Answers"}
          </h2>
        </div>

        {question.answers.length > 0 ? (
          <div className="space-y-4">
            {question.answers.map((answer) => {
              const answerer = users[answer.answeredBy];
              return (
                <Card key={answer.id}>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={answerer?.avatar} />
                        <AvatarFallback>
                          {answerer?.name.substring(0, 2).toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {answerer?.name || "Unknown"} answered on{" "}
                        {formatDate(answer.answeredAt)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{answer.content}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                No answers yet. Be the first to answer this question!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* New Answer Form */}
      <div className="space-y-4">
        <Separator />
        <h2 className="text-lg font-semibold">Your Answer</h2>
        <form onSubmit={handleSubmitAnswer}>
          <div className="space-y-4">
            <Textarea
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              className="min-h-[150px]"
              placeholder="Write your answer here..."
              required
            />
            <Button
              type="submit"
              disabled={!answerContent.trim() || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Answer"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QADetail;
