import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Article } from "@shared/schema";

interface UseSearchReturn {
  results: Article[];
  isLoading: boolean;
  search: (query: string) => void;
  clearResults: () => void;
}

export function useSearch(): UseSearchReturn {
  const [currentQuery, setCurrentQuery] = useState<string>("");
  
  const { data: results = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles/search", { q: currentQuery }],
    enabled: currentQuery.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
  });

  const search = useCallback((query: string) => {
    setCurrentQuery(query.trim());
  }, []);

  const clearResults = useCallback(() => {
    setCurrentQuery("");
  }, []);

  return {
    results,
    isLoading,
    search,
    clearResults
  };
}

// Hook for client-side search using Fuse.js (for enhanced search when available)
export function useFuseSearch(articles: Article[] = []): UseSearchReturn {
  const [results, setResults] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const search = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Import Fuse.js dynamically
      const Fuse = (await import("fuse.js")).default;
      
      const fuse = new Fuse(articles, {
        keys: [
          { name: "title", weight: 0.4 },
          { name: "excerpt", weight: 0.3 },
          { name: "content", weight: 0.2 },
          { name: "tags", weight: 0.1 }
        ],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 2
      });

      const searchResults = fuse.search(query);
      setResults(searchResults.map(result => result.item));
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [articles]);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return {
    results,
    isLoading,
    search,
    clearResults
  };
}
