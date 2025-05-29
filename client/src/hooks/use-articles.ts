import { useQuery } from "@tanstack/react-query";
import type { Article } from "@shared/schema";

interface UseArticlesOptions {
  category?: string;
  status?: string;
  limit?: number;
  offset?: number;
  featured?: boolean;
}

export function useArticles(options: UseArticlesOptions = {}) {
  const { category = "all", status = "published", limit = 20, offset = 0, featured = false } = options;
  
  const queryKey = featured 
    ? ["/api/articles/featured", { limit }]
    : ["/api/articles", { category, status, limit, offset }];

  return useQuery<Article[]>({
    queryKey,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useArticle(slug: string) {
  return useQuery<Article>({
    queryKey: [`/api/articles/${slug}`],
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
