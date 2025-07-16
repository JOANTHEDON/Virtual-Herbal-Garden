import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { usePlants } from "@/hooks/use-plants";
import Plant3DViewer from "@/components/plant-3d-viewer";
import Plant3DModal from "@/components/plant-3d-modal";
import { Search, Grid3X3, List, Eye, Maximize2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Gallery3D() {
  const { data: plants, isLoading } = usePlants();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPlant, setSelectedPlant] = useState<number | null>(null);

  const categories = ["all", "Anti-inflammatory", "Antibacterial", "Adaptogen", "Digestive", "Healing", "Brain Health", "Sacred", "Vitamin C"];

  const filteredPlants = plants?.filter(plant => {
    const matchesSearch = plant.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plant.botanicalName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || plant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
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
            3D Plant Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore interactive 3D models of medicinal plants. Rotate, zoom, and examine 
            each plant in stunning detail to understand their unique characteristics.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search plants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 focus:border-fresh-green"
              />
            </div>

            {/* View Mode */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-fresh-green text-white" : ""}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-fresh-green text-white" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-1 rounded-full text-xs transition-all duration-200
                  ${selectedCategory === category 
                    ? "bg-fresh-green text-white" 
                    : "text-forest hover:bg-fresh-green/10"
                  }
                `}
              >
                {category === "all" ? "All Plants" : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className={`grid gap-6 ${viewMode === "grid" 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
          : "grid-cols-1"
        }`}>
          {filteredPlants?.map((plant) => (
            <Card 
              key={plant.id} 
              className="group hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="relative">
                  {/* 3D Viewer */}
                  <div className="h-64 bg-gray-100 rounded-t-xl overflow-hidden">
                    <Plant3DViewer plant={plant} />
                  </div>
                  
                  {/* Overlay Controls */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge className="bg-fresh-green/90 text-white">
                      {plant.category}
                    </Badge>
                  </div>
                  
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Plant3DModal 
                      plant={plant} 
                      buttonText="View" 
                      buttonSize="sm"
                      buttonVariant="secondary"
                    />
                  </div>
                </div>
                
                {/* Plant Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-forest mb-2 group-hover:text-fresh-green transition-colors">
                    {plant.commonName}
                  </h3>
                  <p className="text-sm text-gray-500 italic mb-3">
                    {plant.botanicalName}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {plant.primaryUse}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {plant.region}
                    </div>
                    <Plant3DModal 
                      plant={plant} 
                      buttonText="Explore" 
                      buttonSize="sm"
                      buttonVariant="outline"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredPlants?.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              No plants found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Interactive Features CTA */}
        <div className="mt-16 bg-gradient-to-r from-fresh-green to-forest rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Interactive Learning
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Each 3D model is fully interactive. Click and drag to rotate, scroll to zoom, 
            and discover the intricate details of these remarkable medicinal plants.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 rounded-lg p-4 text-white">
              <h4 className="font-semibold mb-1">Rotate</h4>
              <p className="text-sm">Click & drag</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-white">
              <h4 className="font-semibold mb-1">Zoom</h4>
              <p className="text-sm">Mouse wheel</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-white">
              <h4 className="font-semibold mb-1">Reset</h4>
              <p className="text-sm">Reset button</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}