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
  
  if (featured) {
    return useQuery<Article[]>({
      queryKey: ["/api/articles/featured", { limit }],
      staleTime: 5 * 60 * 1000,
    });
  }

  const queryParams = new URLSearchParams();
  queryParams.set("limit", limit.toString());
  queryParams.set("offset", offset.toString());
  queryParams.set("status", status);
  if (category && category !== "all") {
    queryParams.set("category", category);
  }

  const queryKey = [`/api/articles?${queryParams.toString()}`];

  return useQuery<Article[]>({
    queryKey,
    staleTime: 5 * 60 * 1000,
  });
}

export function useArticle(slug: string) {
  return useQuery<Article>({
    queryKey: [`/api/articles/${slug}`],
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
