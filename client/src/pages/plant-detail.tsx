import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlant } from "@/hooks/use-plants";
import Plant3DViewer from "@/components/plant-3d-viewer";
import { ArrowLeft, Heart, Share2, MapPin, Calendar, Beaker, Leaf, Info, BookOpen } from "lucide-react";
import { useState } from "react";

export default function PlantDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { data: plant, isLoading } = usePlant(parseInt(id || "0"));
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-fresh-green border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plant details...</p>
        </div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Plant Not Found</h1>
          <Button onClick={() => setLocation("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically save to localStorage or call an API
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: plant.commonName,
        text: `Learn about ${plant.commonName} - ${plant.primaryUse}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/")}
              className="flex items-center text-gray-600 hover:text-forest"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Garden
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`${isBookmarked ? "text-red-500" : "text-gray-400"} hover:text-red-500`}
              >
                <Heart className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-gray-400 hover:text-blue-500"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D Model Section */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center text-forest">
                  <Leaf className="h-5 w-5 mr-2 text-fresh-green" />
                  3D Model Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-96 bg-gray-50">
                  <Plant3DViewer plant={plant} />
                </div>
              </CardContent>
            </Card>

            {/* Quick Info Card */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <MapPin className="h-5 w-5 mx-auto text-gray-500 mb-2" />
                    <p className="text-sm text-gray-600">Region</p>
                    <p className="font-semibold">{plant.region}</p>
                  </div>
                  <div className="text-center">
                    <Beaker className="h-5 w-5 mx-auto text-gray-500 mb-2" />
                    <p className="text-sm text-gray-600">AYUSH System</p>
                    <p className="font-semibold">{plant.ayushSystem}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plant Information Section */}
          <div className="space-y-6">
            {/* Plant Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge className={getCategoryColor(plant.category)}>
                  {plant.category}
                </Badge>
                {plant.isPopular && (
                  <Badge variant="secondary" className="bg-golden text-white">
                    ⭐ Popular
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl font-bold text-forest mb-2">
                {plant.commonName}
              </h1>
              <p className="text-xl text-gray-600 italic mb-4">
                {plant.botanicalName}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {plant.primaryUse}
              </p>
            </div>

            {/* Detailed Information Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview" className="flex items-center">
                  <Info className="h-4 w-4 mr-1" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="medicinal" className="flex items-center">
                  <Beaker className="h-4 w-4 mr-1" />
                  Medicinal
                </TabsTrigger>
                <TabsTrigger value="cultivation" className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Growing
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Plant Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-forest mb-2">Description</h4>
                      <p className="text-gray-700">{plant.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-forest mb-2">Habitat</h4>
                      <p className="text-gray-700">{plant.habitat}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-forest mb-2">Traditional Uses</h4>
                      <p className="text-gray-700">{plant.traditionalUses}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="medicinal" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Medicinal Properties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-forest mb-2">Medicinal Uses</h4>
                      <p className="text-gray-700">{plant.medicinalUses}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-forest mb-2">Preparation Methods</h4>
                      <div className="flex flex-wrap gap-2">
                        {plant.preparationMethods.map((method, index) => (
                          <Badge key={index} variant="outline" className="text-fresh-green border-fresh-green">
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> Always consult with a qualified healthcare practitioner before using medicinal plants for treatment.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cultivation" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Cultivation Guide</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-forest mb-2">Growing Instructions</h4>
                      <p className="text-gray-700">{plant.cultivation}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-forest mb-2">Best Growing Conditions</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Suitable for {plant.region} climate</li>
                        <li>Traditional {plant.ayushSystem} cultivation methods</li>
                        <li>Optimal for {plant.category.toLowerCase()} properties</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}