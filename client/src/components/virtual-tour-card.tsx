import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Leaf, CircuitBoard, Clock, Users } from "lucide-react";
import type { VirtualTour } from "@shared/schema";

interface VirtualTourCardProps {
  tour: VirtualTour;
}

export default function VirtualTourCard({ tour }: VirtualTourCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "immunity":
        return Shield;
      case "skin care":
        return Leaf;
      case "digestion":
        return CircuitBoard;
      default:
        return Leaf;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "immunity": "text-blue-600",
      "skin care": "text-green-600",
      "digestion": "text-orange-600"
    };
    return colors[category.toLowerCase()] || "text-gray-600";
  };

  const Icon = getCategoryIcon(tour.category);

  const handleStartTour = () => {
    // TODO: Implement virtual tour navigation
    console.log("Starting tour:", tour.title);
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
      <div className="relative">
        <img
          src={tour.imageUrl}
          alt={tour.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-gray-700">
            <Clock className="h-3 w-3 mr-1" />
            {tour.duration}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <Icon className={`h-5 w-5 mr-3 ${getCategoryColor(tour.category)}`} />
          <h3 className="text-xl font-poppins font-semibold text-forest">
            {tour.title}
          </h3>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {tour.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span>{tour.plantCount} plants</span>
          </div>
          <Button
            onClick={handleStartTour}
            className="bg-fresh-green text-white hover:bg-forest transition-colors"
          >
            Start Tour
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
