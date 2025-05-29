import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Article } from "@shared/schema";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const getCategoryClass = (category: string) => {
    const classes = {
      politics: "category-politics",
      education: "category-education", 
      entertainment: "category-entertainment",
      gossip: "category-gossip",
      football: "category-football"
    };
    return classes[category as keyof typeof classes] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="md:flex">
        <div className="md:w-1/3">
          {article.featuredImage && (
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>
        <CardContent className="md:w-2/3 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Badge className={getCategoryClass(article.category)}>
              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(article.createdAt))} ago
            </span>
          </div>
          
          <Link href={`/article/${article.slug}`}>
            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-red-600 transition-colors cursor-pointer line-clamp-2">
              {article.title}
            </h3>
          </Link>
          
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{article.readTime} min read</span>
              <span>•</span>
              <User className="h-3 w-3" />
              <span>By {article.author}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
