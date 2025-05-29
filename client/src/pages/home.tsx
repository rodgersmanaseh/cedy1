import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Sidebar } from "@/components/layout/sidebar";
import { FeaturedArticle } from "@/components/article/featured-article";
import { ArticleCard } from "@/components/article/article-card";
import { CategoryTabs } from "@/components/ui/category-tabs";
import { ReadingProgress } from "@/components/ui/reading-progress";
import { useArticles } from "@/hooks/use-articles";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const [location, setLocation] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const categoryFromUrl = urlParams.get('category') || 'all';
  
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [page, setPage] = useState(1);
  const [allArticles, setAllArticles] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  
  const { data: articles = [], isLoading } = useArticles({
    category: selectedCategory,
    limit: 9,
    offset: (page - 1) * 9
  });

  const { data: featuredArticles = [] } = useArticles({
    featured: true,
    limit: 3
  });

  // Update URL when category changes
  useEffect(() => {
    if (selectedCategory !== categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      setPage(1);
    }
  }, [categoryFromUrl]);

  // Update articles when new data arrives
  useEffect(() => {
    if (articles) {
      if (page === 1) {
        setAllArticles(articles);
      } else {
        setAllArticles(prev => [...prev, ...articles]);
      }
      setHasMore(articles.length === 9); // If less than limit, no more pages
    }
  }, [articles, page]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
    setAllArticles([]);
    setHasMore(true);
    
    // Update URL
    const newUrl = category === 'all' ? '/' : `/?category=${category}`;
    setLocation(newUrl);
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <Header />
      
      {/* Breaking News Ticker */}
      <div className="bg-red-600 text-white py-2 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <span className="bg-white text-red-600 px-3 py-1 rounded-full text-sm font-bold mr-4 flex-shrink-0">
              BREAKING
            </span>
            <div className="overflow-hidden flex-1">
              <div className="animate-marquee whitespace-nowrap">
                <span>President Ruto announces new education reforms | County governments receive increased funding | Kenya qualifies for AFCON 2024 | New infrastructure projects launched in Mombasa</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Kenya's Voice in <span className="text-yellow-300">Global Media</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Stay informed with comprehensive coverage of politics, education, entertainment, and sports from Kenya and beyond.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-white/20 rounded-full text-sm">Breaking News</span>
              <span className="px-4 py-2 bg-white/20 rounded-full text-sm">Live Updates</span>
              <span className="px-4 py-2 bg-white/20 rounded-full text-sm">In-Depth Analysis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <CategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">Featured Stories</h2>
              <span className="text-sm text-muted-foreground">Editor's Pick</span>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <FeaturedArticle key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">Latest Articles</h2>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <i className="fas fa-th-large" />
                </Button>
                <Button variant="ghost" size="sm">
                  <i className="fas fa-list" />
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-card rounded-xl p-6 shadow-sm">
                      <div className="flex space-x-4">
                        <div className="w-32 h-24 bg-muted rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-muted rounded w-1/4" />
                          <div className="h-6 bg-muted rounded w-3/4" />
                          <div className="h-4 bg-muted rounded w-full" />
                          <div className="h-4 bg-muted rounded w-2/3" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>

                {articles.length === 9 && (
                  <div className="text-center mt-8">
                    <Button onClick={handleLoadMore} className="bg-red-600 hover:bg-red-700">
                      Load More Articles
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </main>

      <Footer />
    </div>
  );
}
