import { NewsletterSignup } from "@/components/ui/newsletter-signup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Flame, TrendingUp, MessageCircle } from "lucide-react";

export function Sidebar() {
  const trendingTopics = [
    { tag: "#KenyaElections2024", count: "1.2k" },
    { tag: "#AFCON2024", count: "890" },
    { tag: "#TechKenya", count: "567" },
    { tag: "#Education", count: "432" },
    { tag: "#Entertainment", count: "321" },
  ];

  const recentComments = [
    {
      text: "Great analysis on the education reforms...",
      author: "Mary K.",
      article: "Politics"
    },
    {
      text: "Finally, some good news about football!",
      author: "John M.",
      article: "Sports"
    },
    {
      text: "The tech scene in Kenya is amazing.",
      author: "Grace W.",
      article: "Technology"
    }
  ];

  const weatherData = {
    temperature: "24°C",
    condition: "Partly Cloudy",
    high: "28°C",
    low: "18°C"
  };

  return (
    <div className="space-y-8">
      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Trending Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div key={topic.tag} className="flex items-center justify-between py-2 hover:text-red-600 transition-colors group cursor-pointer">
                <span className="text-foreground group-hover:text-red-600">{topic.tag}</span>
                <Badge variant="secondary" className="text-xs">
                  {topic.count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            Recent Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentComments.map((comment, index) => (
              <div key={index} className="border-l-2 border-red-600 pl-3">
                <p className="text-sm text-muted-foreground">"{comment.text}"</p>
                <p className="text-xs text-muted-foreground mt-1">
                  - {comment.author} on {comment.article}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weather Widget */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-cloud-sun" />
            Nairobi Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{weatherData.temperature}</p>
              <p className="text-blue-100">{weatherData.condition}</p>
            </div>
            <div className="text-right text-sm text-blue-100">
              <p>High: {weatherData.high}</p>
              <p>Low: {weatherData.low}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card>
        <CardHeader>
          <CardTitle>Follow Us</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="#"
              className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="fab fa-facebook-f mr-2" />
              Facebook
            </a>
            <a
              href="#"
              className="flex items-center justify-center p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              <i className="fab fa-twitter mr-2" />
              Twitter
            </a>
            <a
              href="#"
              className="flex items-center justify-center p-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              <i className="fab fa-instagram mr-2" />
              Instagram
            </a>
            <a
              href="#"
              className="flex items-center justify-center p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <i className="fab fa-youtube mr-2" />
              YouTube
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
