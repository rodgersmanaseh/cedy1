import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ReadingProgress } from "@/components/ui/reading-progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, Share2, MessageCircle, Clock, User, Eye } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import ReactMarkdown from "react-markdown";
import { formatDistanceToNow } from "date-fns";

interface ArticleParams {
  slug: string;
}

export default function Article() {
  const { slug } = useParams<ArticleParams>();

  const { data: article, isLoading, error } = useQuery({
    queryKey: [`/api/articles/${slug}`],
    enabled: !!slug,
  });

  const shareArticle = (platform: string) => {
    const url = window.location.href;
    const title = article?.title || "Check out this article";
    
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-64 bg-muted rounded" />
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-muted rounded" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground">The article you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={`category-${article.category}`}>
                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(article.createdAt))} ago
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {article.viewCount} views
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {article.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>By {article.author}</span>
                <Separator orientation="vertical" className="h-4" />
                <Clock className="h-4 w-4" />
                <span>{article.readTime} min read</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4 mr-1" />
                  Like
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Comment
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="mb-8">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-[400px] object-cover rounded-xl"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="article-content">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>

          {/* Article Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Social Sharing */}
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="text-lg font-semibold mb-4">Share this article</h3>
            <div className="flex gap-3">
              <Button
                onClick={() => shareArticle("facebook")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <i className="fab fa-facebook-f mr-2" />
                Facebook
              </Button>
              <Button
                onClick={() => shareArticle("twitter")}
                className="bg-sky-500 hover:bg-sky-600"
              >
                <i className="fab fa-twitter mr-2" />
                Twitter
              </Button>
              <Button
                onClick={() => shareArticle("whatsapp")}
                className="bg-green-600 hover:bg-green-700"
              >
                <i className="fab fa-whatsapp mr-2" />
                WhatsApp
              </Button>
              <Button
                onClick={copyLink}
                variant="outline"
              >
                <i className="fas fa-link mr-2" />
                Copy Link
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-xl font-semibold mb-6">Comments</h3>
            <div className="bg-muted rounded-lg p-8 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Comments will be loaded here using Giscus (GitHub Discussions) integration
              </p>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
