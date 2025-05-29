import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Eye, Upload } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Article, InsertArticle } from "@shared/schema";

interface ArticleEditorProps {
  article?: Article | null;
  onCancel: () => void;
  onSave: () => void;
}

export function ArticleEditor({ article, onCancel, onSave }: ArticleEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<Partial<InsertArticle>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "politics",
    author: "",
    featuredImage: "",
    tags: [],
    status: "draft",
    readTime: 5
  });

  const [currentTag, setCurrentTag] = useState("");

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        author: article.author,
        featuredImage: article.featuredImage || "",
        tags: article.tags || [],
        status: article.status,
        readTime: article.readTime
      });
    }
  }, [article]);

  const createMutation = useMutation({
    mutationFn: (data: InsertArticle) => apiRequest("POST", "/api/articles", data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Article created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      onSave();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create article",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<InsertArticle>) => 
      apiRequest("PUT", `/api/articles/${article?.id}`, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Article updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      onSave();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update article",
        variant: "destructive",
      });
    }
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleInputChange = (field: keyof InsertArticle, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug from title
      if (field === "title") {
        updated.slug = generateSlug(value);
      }
      
      // Auto-calculate read time from content
      if (field === "content") {
        updated.readTime = estimateReadTime(value);
      }
      
      return updated;
    });
  };

  const handleAddTag = () => {
    if (currentTag && !formData.tags?.includes(currentTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), currentTag]
      }));
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSubmit = (status: "draft" | "published") => {
    const articleData = {
      ...formData,
      status
    } as InsertArticle;

    if (article) {
      updateMutation.mutate(articleData);
    } else {
      createMutation.mutate(articleData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {article ? "Edit Article" : "Create New Article"}
              </h1>
              <p className="text-muted-foreground">
                {article ? "Update your existing article" : "Write and publish a new article"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleSubmit("draft")}
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={() => handleSubmit("published")}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              <Eye className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="title">Article Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter a compelling title..."
                    className="text-lg"
                  />
                </div>
                
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="url-friendly-slug"
                  />
                </div>
                
                <div>
                  <Label htmlFor="excerpt">Article Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange("excerpt", e.target.value)}
                    placeholder="Brief description of the article..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Write your article content in Markdown..."
                  rows={20}
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  You can use Markdown formatting. Estimated read time: {formData.readTime} minutes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Article Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Article Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="politics">Politics</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="gossip">Celebrity Gossip</SelectItem>
                      <SelectItem value="football">Football</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleInputChange("author", e.target.value)}
                    placeholder="Author name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="readTime">Read Time (minutes)</Label>
                  <Input
                    id="readTime"
                    type="number"
                    value={formData.readTime}
                    onChange={(e) => handleInputChange("readTime", parseInt(e.target.value))}
                    min={1}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="featuredImage">Image URL</Label>
                  <Input
                    id="featuredImage"
                    value={formData.featuredImage}
                    onChange={(e) => handleInputChange("featuredImage", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                {formData.featuredImage && (
                  <div className="relative">
                    <img
                      src={formData.featuredImage}
                      alt="Featured image preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button onClick={handleAddTag} size="sm">Add</Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
