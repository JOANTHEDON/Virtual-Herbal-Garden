import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Leaf, Menu, Bookmark } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Plants" },
    { href: "/tours", label: "Virtual Tours" },
    { href: "/gallery", label: "3D Gallery" },
    { href: "/garden", label: "My Garden" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-fresh-green rounded-full flex items-center justify-center">
                <Leaf className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-poppins font-semibold text-forest">Virtual Herbal Garden</h1>
                <p className="text-xs text-gray-500">AYUSH Medicine Platform</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span className={`transition-colors cursor-pointer ${
                  location === item.href 
                    ? "text-forest font-medium" 
                    : "text-gray-600 hover:text-forest"
                }`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <Button size="icon" variant="ghost" className="text-gray-600 hover:text-forest">
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button className="bg-fresh-green text-white hover:bg-forest transition-colors">
              Sign In
            </Button>

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <span 
                        className={`block py-2 px-4 rounded-lg transition-colors cursor-pointer ${
                          location === item.href 
                            ? "bg-fresh-green text-white" 
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
