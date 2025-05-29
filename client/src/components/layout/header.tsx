import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchModal } from "@/components/ui/search-modal";
import { useTheme } from "@/hooks/use-theme";
import { Menu, Search, Moon, Sun, Tv, X } from "lucide-react";

export function Header() {
  const [, setLocation] = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Politics", href: "/?category=politics" },
    { name: "Education", href: "/?category=education" },
    { name: "Entertainment", href: "/?category=entertainment" },
    { name: "Football", href: "/?category=football" },
    { name: "Gossip", href: "/?category=gossip" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-2 border-b border-border text-sm">
            <div className="flex items-center space-x-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <i className="fas fa-map-marker-alt text-red-600" />
                Nairobi, Kenya
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <i className="fas fa-clock" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-8 w-8 p-0"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  <i className="fas fa-user-shield mr-1" />
                  Admin
                </Button>
              </Link>
            </div>
          </div>

          {/* Main Header */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              <Link href="/">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-green-600 rounded-lg flex items-center justify-center">
                    <Tv className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Cedarmond TV</h1>
                    <p className="text-xs text-muted-foreground">Kenya's Premier News Platform</p>
                  </div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <span className="text-foreground hover:text-red-600 font-medium transition-colors cursor-pointer">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(true)}
                className="hidden md:flex"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(true)}
                className="md:hidden h-8 w-8 p-0"
              >
                <Search className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden h-8 w-8 p-0"
              >
                {showMobileMenu ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="lg:hidden bg-background border-t border-border">
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-3">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <div
                      className="block py-2 text-foreground hover:text-red-600 transition-colors cursor-pointer"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {item.name}
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>

      <SearchModal open={showSearch} onOpenChange={setShowSearch} />
    </>
  );
}
