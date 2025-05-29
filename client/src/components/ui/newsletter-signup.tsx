import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, CheckCircle } from "lucide-react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: (email: string) => 
      apiRequest("POST", "/api/newsletter/subscribe", { email }),
    onSuccess: () => {
      setIsSubscribed(true);
      setEmail("");
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && !subscribeMutation.isPending) {
      subscribeMutation.mutate(email);
    }
  };

  if (isSubscribed) {
    return (
      <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Successfully Subscribed!</h3>
          <p className="text-green-100">
            Thank you for subscribing to our newsletter. You'll receive the latest news in your inbox.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-red-600 to-green-600 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Stay Updated
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-100 mb-4 text-sm">
          Get the latest news and insights delivered to your inbox daily.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/20 border-white/30 text-white placeholder-white/70 focus:ring-white/50"
          />
          <Button
            type="submit"
            disabled={subscribeMutation.isPending}
            className="w-full bg-yellow-500 text-black hover:bg-yellow-600 font-medium"
          >
            {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        <p className="text-xs text-gray-200 mt-3">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </CardContent>
    </Card>
  );
}
