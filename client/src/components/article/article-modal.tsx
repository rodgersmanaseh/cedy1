import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, Share2, MessageCircle, Clock, User, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";
import type { Article } from "@shared/schema";

interface ArticleModalProps {
  article: Article | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArticleModal({ article, open, onOpenChange }: ArticleModalProps) {
  if (!article) return null;

  const shareArticle = (platform: string) => {
    const url = `${window.location.origin}/article/${article.slug}`;
    const title = article.title;
    
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-border pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
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
          </div>
          
          <DialogTitle className="text-3xl font-bold leading-tight mb-4">
            {article.title}
          </DialogTitle>
          
          <p className="text-xl text-muted-foreground mb-6">
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
        </DialogHeader>

        <div className="py-6">
          {/* Featured Image */}
          {article.featuredImage && (
            <div className="mb-8">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-64 object-cover rounded-xl"
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
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
