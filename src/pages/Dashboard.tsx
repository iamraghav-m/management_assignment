
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockApi, Document as DocType, Question } from "@/services/mockApi";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, HelpCircle, Loader2, Users, FileUp } from "lucide-react";

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docs, qs] = await Promise.all([
          mockApi.documents.getAll(),
          mockApi.questions.getAll()
        ]);
        
        setDocuments(docs);
        setQuestions(qs);
        
        if (hasRole("admin")) {
          const users = await mockApi.users.getAll();
          setUserCount(users.length);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hasRole]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const recentDocuments = documents.slice(0, 3);
  const unansweredQuestions = questions.filter(q => q.status === "unanswered");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h2>
        <p className="text-muted-foreground">
          Here's an overview of your document management dashboard
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{documents.length}</p>
                <p className="text-xs text-muted-foreground">
                  Total documents in the system
                </p>
              </div>
              <FileText className="h-10 w-10 text-doc-blue/50" />
            </div>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link to="/documents">
                View Documents
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{unansweredQuestions.length}</p>
                <p className="text-xs text-muted-foreground">
                  Unanswered questions
                </p>
              </div>
              <HelpCircle className="h-10 w-10 text-doc-yellow/50" />
            </div>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link to="/qa">
                Answer Questions
              </Link>
            </Button>
          </CardContent>
        </Card>

        {hasRole("admin") ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{userCount}</p>
                  <p className="text-xs text-muted-foreground">
                    Registered users
                  </p>
                </div>
                <Users className="h-10 w-10 text-doc-green/50" />
              </div>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link to="/users">
                  Manage Users
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Upload Document
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold">Add New</p>
                  <p className="text-xs text-muted-foreground">
                    Upload and manage documents
                  </p>
                </div>
                <FileUp className="h-10 w-10 text-doc-indigo/50" />
              </div>
              <Button asChild className="mt-4 w-full">
                <Link to="/documents/new">
                  Upload Document
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>
              Latest documents uploaded to the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentDocuments.length > 0 ? (
              recentDocuments.map((doc) => (
                <Link
                  key={doc.id}
                  to={`/documents/${doc.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-doc-blue" />
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(doc.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                    {doc.status}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No documents available</p>
            )}
            <Button asChild variant="link" className="w-full">
              <Link to="/documents">View All Documents</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Questions</CardTitle>
            <CardDescription>
              Questions that need your attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.length > 0 ? (
              questions.slice(0, 3).map((question) => (
                <Link
                  key={question.id}
                  to={`/qa/${question.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-doc-yellow" />
                    <div>
                      <p className="font-medium">{question.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(question.askedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      question.status === "unanswered"
                        ? "bg-doc-yellow/20 text-doc-yellow"
                        : "bg-doc-green/20 text-doc-green"
                    }`}
                  >
                    {question.status}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No questions available</p>
            )}
            <Button asChild variant="link" className="w-full">
              <Link to="/qa">View All Questions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
