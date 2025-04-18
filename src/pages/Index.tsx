
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Users, HelpCircle, ArrowRight, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-doc-blue" />
            <span className="font-semibold">DocManager</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/register">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted">
        <div className="container flex flex-col items-center gap-8 pb-20 pt-24 text-center md:pt-32">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-doc-blue/10">
            <FileText className="h-6 w-6 text-doc-blue" />
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Modern Document Management
          </h1>
          <p className="max-w-[42rem] text-lg text-muted-foreground sm:text-xl">
            A powerful platform for managing documents, collaboration, and knowledge sharing
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/register">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-doc-blue" />
            <span className="font-semibold">DocManager</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2025 DocManager. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="#" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
