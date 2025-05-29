import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "all", label: "All Stories", color: "bg-red-600 hover:bg-red-700" },
  { id: "politics", label: "Politics", color: "hover:bg-red-600" },
  { id: "education", label: "Education", color: "hover:bg-blue-600" },
  { id: "entertainment", label: "Entertainment", color: "hover:bg-purple-600" },
  { id: "gossip", label: "Celebrity Gossip", color: "hover:bg-pink-600" },
  { id: "football", label: "Football", color: "hover:bg-green-600" },
  { id: "trending", label: "Trending", color: "bg-orange-500 hover:bg-orange-600", icon: Flame },
];

export function CategoryTabs({ selectedCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <section className="bg-background sticky top-16 z-40 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto py-4 space-x-4 scrollbar-hide">
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;
            const Icon = category.icon;
            
            return (
              <Button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                variant={isActive ? "default" : "ghost"}
                className={`whitespace-nowrap ${
                  isActive 
                    ? category.color || "bg-red-600 text-white" 
                    : `bg-muted text-muted-foreground ${category.color} hover:text-white`
                } transition-colors`}
              >
                {Icon && <Icon className="h-4 w-4 mr-2" />}
                {category.label}
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
