
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockApi } from "@/services/mockApi";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

const DocumentNew = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("pdf");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to upload documents");
      return;
    }

    if (!title.trim()) {
      toast.error("Document title is required");
      return;
    }

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setLoading(true);
    setUploadError(null);
    
    try {
      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size exceeds 10MB limit");
      }

      // In a real app, we would upload the file to a storage service
      const fileSize = file.size;

      await mockApi.documents.create({
        title,
        content,
        type,
        status,
        createdBy: user.id,
        size: fileSize,
      });

      toast.success("Document uploaded successfully");
      navigate("/documents");
    } catch (error) {
      console.error("Error creating document:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload document";
      setUploadError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size
      if (selectedFile.size > 10 * 1024 * 1024) {
        setUploadError("File size exceeds 10MB limit");
        toast.error("File size exceeds 10MB limit");
        return;
      }
      
      setFile(selectedFile);
      
      // Automatically set the document type based on file extension
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase() || '';
      if (fileExtension) {
        // Check if the file extension is in our supported types
        const supportedTypes = ["pdf", "docx", "xlsx", "pptx", "txt", "csv", "jpg", "png"];
        if (supportedTypes.includes(fileExtension)) {
          setType(fileExtension);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Upload Document</h2>
        <p className="text-muted-foreground">
          Add a new document to the system
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter document title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Document Description</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter document description or content"
                  rows={5}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Document Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">Word (DOCX)</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      <SelectItem value="pptx">PowerPoint (PPTX)</SelectItem>
                      <SelectItem value="txt">Text (TXT)</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="jpg">Image (JPG)</SelectItem>
                      <SelectItem value="png">Image (PNG)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={status}
                    onValueChange={(value) => setStatus(value as "draft" | "published")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Upload File</Label>
                <div className="mt-2 flex items-center justify-center rounded-lg border border-dashed border-input p-6 relative">
                  <label 
                    htmlFor="fileInput" 
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                  >
                    <div className="flex flex-col items-center space-y-2 text-center">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {file ? file.name : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Upload document files (10MB max)
                        </p>
                        {uploadError && (
                          <p className="text-xs text-destructive">
                            {uploadError}
                          </p>
                        )}
                      </div>
                    </div>
                    <Input
                      id="fileInput"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.docx,.xlsx,.pptx,.txt,.csv,.jpg,.png"
                    />
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/documents")}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading || !title || !file}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : (
              "Upload Document"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DocumentNew;
