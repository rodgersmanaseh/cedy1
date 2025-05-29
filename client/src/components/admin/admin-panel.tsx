import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleEditor } from "./article-editor";
import { useArticles } from "@/hooks/use-articles";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageCircle, Users, FileText, TrendingUp, LogOut } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Article } from "@shared/schema";

interface AdminPanelProps {
  onLogout: () => void;
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const { data: articles = [], isLoading } = useArticles({
    status: "all",
    limit: 50
  });

  const stats = {
    totalArticles: articles.length,
    publishedToday: articles.filter(a => 
      new Date(a.createdAt).toDateString() === new Date().toDateString()
    ).length,
    totalViews: articles.reduce((sum, a) => sum + a.viewCount, 0),
    subscribers: 1200 // This would come from newsletter data
  };

  const handleEditArticle = (article: Article) => {
    setSelectedArticle(article);
    setShowEditor(true);
  };

  const handleNewArticle = () => {
    setSelectedArticle(null);
    setShowEditor(true);
  };

  if (showEditor) {
    return (
      <ArticleEditor
        article={selectedArticle}
        onCancel={() => setShowEditor(false)}
        onSave={() => {
          setShowEditor(false);
          setSelectedArticle(null);
        }}
      />
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your content and platform settings</p>
        </div>
        <Button variant="outline" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Articles</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalArticles}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Published Today</p>
                <p className="text-2xl font-bold text-foreground">{stats.publishedToday}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subscribers</p>
                <p className="text-2xl font-bold text-foreground">{stats.subscribers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Manage Articles</h2>
            <Button onClick={handleNewArticle} className="bg-red-600 hover:bg-red-700">
              <FileText className="h-4 w-4 mr-2" />
              New Article
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Title</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Views</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {articles.map((article) => (
                      <tr key={article.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <p className="font-medium text-foreground truncate">{article.title}</p>
                            <p className="text-sm text-muted-foreground">By {article.author}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={`category-${article.category}`}>
                            {article.category}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={article.status === "published" ? "default" : "secondary"}>
                            {article.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {article.viewCount}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(article.createdAt))} ago
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditArticle(article)}
                            >
                              <i className="fas fa-edit" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <i className="fas fa-trash" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comment Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Comment moderation features would be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="newsletter" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Newsletter management features would be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Site configuration options would be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
