import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/hooks/use-search";
import { Search, X, Clock } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const { results, isLoading, search } = useSearch();

  useEffect(() => {
    if (query.length >= 2) {
      const timeoutId = setTimeout(() => {
        search(query);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [query, search]);

  const handleClose = () => {
    setQuery("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden p-0">
        {/* Search Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search articles, topics, or authors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border-0 focus-visible:ring-0 text-lg"
              autoFocus
            />
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Results */}
        <div className="overflow-y-auto max-h-96">
          {query.length < 2 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start typing to search articles...</p>
            </div>
          ) : isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4" />
              <p className="text-muted-foreground">Searching...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No articles found for "{query}"</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {results.map((article) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <div
                    className="p-4 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    onClick={handleClose}
                  >
                    <div className="flex items-start space-x-4">
                      {article.featuredImage && (
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          className="w-16 h-12 object-cover rounded flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={`category-${article.category} text-xs`}>
                            {article.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDistanceToNow(new Date(article.createdAt))} ago
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center space-x-3 mt-2 text-xs text-muted-foreground">
                          <span>By {article.author}</span>
                          <span>•</span>
                          <span>{article.readTime} min read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Search Footer */}
        <div className="p-4 border-t border-border bg-muted/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Press Enter to search</span>
            <span>ESC to close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
