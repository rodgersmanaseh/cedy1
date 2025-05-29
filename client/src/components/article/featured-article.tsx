import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Article } from "@shared/schema";

interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const getCategoryClass = (category: string) => {
    const classes = {
      politics: "bg-red-600 text-white",
      education: "bg-blue-600 text-white", 
      entertainment: "bg-purple-600 text-white",
      gossip: "bg-pink-600 text-white",
      football: "bg-green-600 text-white"
    };
    return classes[category as keyof typeof classes] || "bg-gray-600 text-white";
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
      <div className="relative">
        {article.featuredImage && (
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute top-4 left-4">
          <Badge className={getCategoryClass(article.category)}>
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-yellow-500 text-black">
            Featured
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <Link href={`/article/${article.slug}`}>
          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{article.readTime} min read</span>
          </div>
          <span>{formatDistanceToNow(new Date(article.createdAt))} ago</span>
        </div>
      </CardContent>
    </Card>
  );
}
