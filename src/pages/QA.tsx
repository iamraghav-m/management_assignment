
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { mockApi, Question } from "@/services/mockApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { HelpCircle, Search, MessageCircle, Loader2, ChevronRight } from "lucide-react";

const QA = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await mockApi.questions.getAll();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const newQuestionData = await mockApi.questions.create({
        title: newQuestion.title,
        content: newQuestion.content,
        askedBy: user.id,
      });

      setQuestions([newQuestionData, ...questions]);
      setNewQuestion({ title: "", content: "" });
    } catch (error) {
      console.error("Error submitting question:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredQuestions = questions.filter(
    (question) =>
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unansweredQuestions = filteredQuestions.filter(
    (q) => q.status === "unanswered"
  );
  
  const answeredQuestions = filteredQuestions.filter(
    (q) => q.status === "answered"
  );

  // Function to switch to "ask" tab
  const switchToAskTab = () => {
    const askTab = document.querySelector('[data-value="ask"]') as HTMLElement;
    if (askTab) {
      askTab.click();
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Questions & Answers</h2>
        <p className="text-muted-foreground">
          Ask questions and get answers from our team
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search questions..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Questions</TabsTrigger>
          <TabsTrigger value="ask">Ask a Question</TabsTrigger>
        </TabsList>
        <TabsContent value="browse" className="space-y-6 pt-4">
          <Tabs defaultValue="unanswered">
            <TabsList>
              <TabsTrigger value="unanswered">
                Unanswered ({unansweredQuestions.length})
              </TabsTrigger>
              <TabsTrigger value="answered">
                Answered ({answeredQuestions.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="unanswered" className="pt-4">
              {unansweredQuestions.length > 0 ? (
                <div className="space-y-4">
                  {unansweredQuestions.map((question) => (
                    <Card key={question.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          {question.title}
                        </CardTitle>
                        <CardDescription>
                          Asked on{" "}
                          {new Date(question.askedAt).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {question.content}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                          <Link to={`/qa/${question.id}`}>
                            Answer Question
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-input p-12 text-center">
                  <HelpCircle className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No unanswered questions
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    All questions have been answered. You can ask a new question.
                  </p>
                  <Button className="mt-4" variant="outline" onClick={switchToAskTab}>
                    Ask a Question
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="answered" className="pt-4">
              {answeredQuestions.length > 0 ? (
                <div className="space-y-4">
                  {answeredQuestions.map((question) => (
                    <Card key={question.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          {question.title}
                        </CardTitle>
                        <CardDescription>
                          Asked on{" "}
                          {new Date(question.askedAt).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {question.content}
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {question.answers.length}{" "}
                            {question.answers.length === 1
                              ? "answer"
                              : "answers"}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                          <Link to={`/qa/${question.id}`}>
                            View Answers
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-input p-12 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No answered questions
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No questions have been answered yet.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>
        <TabsContent value="ask" className="pt-4">
          <Card>
            <form onSubmit={handleSubmitQuestion}>
              <CardHeader>
                <CardTitle>Ask a New Question</CardTitle>
                <CardDescription>
                  Ask about documents, processes, or get help with the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="question-title"
                    className="text-sm font-medium"
                  >
                    Question Title
                  </label>
                  <Input
                    id="question-title"
                    placeholder="Enter a concise title for your question"
                    value={newQuestion.title}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="question-content"
                    className="text-sm font-medium"
                  >
                    Details
                  </label>
                  <Textarea
                    id="question-content"
                    placeholder="Provide as much detail as possible to get the best answer"
                    rows={6}
                    value={newQuestion.content}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        content: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  disabled={submitting || !newQuestion.title || !newQuestion.content}
                  className="w-full"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Question"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QA;
