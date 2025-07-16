import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Box, Eye } from "lucide-react";
import Plant3DModal from "@/components/plant-3d-modal";
import type { Plant } from "@shared/schema";

interface PlantCardProps {
  plant: Plant;
  viewMode?: "grid" | "list";
}

export default function PlantCard({ plant, viewMode = "grid" }: PlantCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Anti-inflammatory": "bg-orange-100 text-orange-600",
      "Antibacterial": "bg-green-100 text-green-600",
      "Adaptogen": "bg-purple-100 text-purple-600",
      "Digestive": "bg-blue-100 text-blue-600",
      "Healing": "bg-pink-100 text-pink-600",
      "Brain Health": "bg-indigo-100 text-indigo-600",
      "Sacred": "bg-emerald-100 text-emerald-600",
      "Vitamin C": "bg-yellow-100 text-yellow-600"
    };
    return colors[category] || "bg-gray-100 text-gray-600";
  };

  // Load bookmark status from localStorage
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem("plantBookmarks") || "[]");
    setIsBookmarked(bookmarks.includes(plant.id));
  }, [plant.id]);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const bookmarks = JSON.parse(localStorage.getItem("plantBookmarks") || "[]");
    let newBookmarks;
    
    if (isBookmarked) {
      newBookmarks = bookmarks.filter((id: number) => id !== plant.id);
    } else {
      newBookmarks = [...bookmarks, plant.id];
    }
    
    localStorage.setItem("plantBookmarks", JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  if (viewMode === "list") {
    return (
      <Link href={`/plants/${plant.id}`}>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <img
                src={plant.imageUrl}
                alt={plant.commonName}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getCategoryColor(plant.category)}>
                    {plant.category}
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleBookmark}
                    className={isBookmarked ? "text-red-500" : "text-gray-400 hover:text-red-500"}
                  >
                    <Heart className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                  </Button>
                </div>
                <h3 className="text-lg font-poppins font-semibold text-forest mb-1">
                  {plant.commonName}
                </h3>
                <p className="text-sm text-gray-500 italic mb-2">{plant.botanicalName}</p>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{plant.primaryUse}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{plant.region}</span>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Plant3DModal 
                      plant={plant} 
                      buttonText="View 3D" 
                      buttonSize="sm"
                      buttonVariant="default"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/plants/${plant.id}`}>
      <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 group overflow-hidden">
        <div className="relative">
          <img
            src={plant.imageUrl}
            alt={plant.commonName}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <Badge className={getCategoryColor(plant.category)}>
              {plant.category}
            </Badge>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleBookmark}
              className={`${isBookmarked ? "text-red-500" : "text-gray-400 hover:text-red-500"} transition-colors`}
            >
              <Heart className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>
          </div>
          
          <h3 className="text-lg font-poppins font-semibold text-forest mb-1">
            {plant.commonName}
          </h3>
          <p className="text-sm text-gray-500 mb-2 italic">{plant.botanicalName}</p>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{plant.primaryUse}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{plant.region}</span>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <Plant3DModal 
                plant={plant} 
                buttonText="View 3D" 
                buttonSize="sm"
                buttonVariant="default"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
