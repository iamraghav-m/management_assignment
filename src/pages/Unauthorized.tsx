
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center space-y-6 text-center">
        <ShieldAlert className="h-24 w-24 text-doc-red" />
        <h1 className="text-4xl font-bold">Unauthorized Access</h1>
        <p className="max-w-md text-lg text-muted-foreground">
          You don&apos;t have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <Button asChild>
          <Link to="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
