import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVirtualTours } from "@/hooks/use-plants";
import { Play, Clock, MapPin, Users, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function VirtualTours() {
  const { data: tours, isLoading } = useVirtualTours();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [, setLocation] = useLocation();

  const categories = ["all", "Immunity", "Skin Care", "Digestive", "Respiratory"];

  const filteredTours = tours?.filter(tour => 
    selectedCategory === "all" || tour.category === selectedCategory
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-forest mb-4">
            Virtual Garden Tours
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Embark on guided journeys through curated collections of medicinal plants. 
            Discover their healing properties, traditional uses, and cultural significance.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-6 py-2 rounded-full transition-all duration-200
                ${selectedCategory === category 
                  ? "bg-fresh-green text-white shadow-lg" 
                  : "text-forest hover:bg-fresh-green/10"
                }
              `}
            >
              {category === "all" ? "All Tours" : category}
            </Button>
          ))}
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours?.map((tour) => (
            <Card 
              key={tour.id} 
              className="group hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={tour.imageUrl}
                  alt={tour.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-fresh-green text-white">
                    {tour.category}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button className="w-full bg-white/90 text-forest hover:bg-white">
                    <Play className="mr-2 h-4 w-4" />
                    Start Tour
                  </Button>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-forest group-hover:text-fresh-green transition-colors">
                  {tour.title}
                </CardTitle>
                <CardDescription className="text-gray-600 line-clamp-2">
                  {tour.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {tour.plantCount} plants
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {tour.duration}
                  </div>
                </div>
                
                <Link href={`/tours/${tour.id}`}>
                  <Button className="w-full bg-fresh-green hover:bg-forest text-white">
                    <Play className="mr-2 h-4 w-4" />
                    Begin Journey
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Tour CTA */}
        <div className="mt-16 bg-gradient-to-r from-fresh-green to-forest rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Create Your Own Tour
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Combine your favorite medicinal plants into a personalized virtual tour. 
            Share your knowledge and create educational journeys for others.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-forest hover:bg-gray-100"
          >
            Start Creating
          </Button>
        </div>
      </div>
    </div>
  );
}