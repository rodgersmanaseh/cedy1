import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Tv } from "lucide-react";

export function Footer() {
  const categories = [
    { name: "Politics", href: "/?category=politics" },
    { name: "Education", href: "/?category=education" },
    { name: "Entertainment", href: "/?category=entertainment" },
    { name: "Celebrity Gossip", href: "/?category=gossip" },
    { name: "Football", href: "/?category=football" },
    { name: "Business", href: "/?category=business" },
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Advertise", href: "/advertise" },
    { name: "RSS Feed", href: "/rss" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: "fab fa-facebook-f", href: "#", color: "hover:text-blue-600" },
    { name: "Twitter", icon: "fab fa-twitter", href: "#", color: "hover:text-sky-500" },
    { name: "Instagram", icon: "fab fa-instagram", href: "#", color: "hover:text-pink-600" },
    { name: "YouTube", icon: "fab fa-youtube", href: "#", color: "hover:text-red-600" },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-green-600 rounded-lg flex items-center justify-center">
                <Tv className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Cedarmond TV</h3>
                <p className="text-gray-400 text-sm">Kenya's Premier News Platform</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Delivering accurate, timely, and comprehensive news coverage across Kenya and beyond.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center transition-colors ${social.color}`}
                >
                  <i className={`${social.icon} text-sm`} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link href={category.href}>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      {category.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-3">
                <i className="fas fa-map-marker-alt text-red-500" />
                <span className="text-sm">Nairobi, Kenya</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-envelope text-red-500" />
                <span className="text-sm">news@cedarmondtv.co.ke</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-phone text-red-500" />
                <span className="text-sm">+254 700 123 456</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Cedarmond TV. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Made with <i className="fas fa-heart text-red-500" /> in Kenya
          </p>
        </div>
      </div>
    </footer>
  );
}
