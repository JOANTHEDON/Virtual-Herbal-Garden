import { useState } from "react";
import Navigation from "@/components/navigation";
import SearchBar from "@/components/search-bar";
import PlantCard from "@/components/plant-card";
import VirtualTourCard from "@/components/virtual-tour-card";
import { usePlants, useVirtualTours } from "@/hooks/use-plants";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid3X3, List, Shield, Heart, Leaf, CircuitBoard } from "lucide-react";
import type { Plant } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const { data: plants, isLoading: plantsLoading } = usePlants();
  const { data: tours, isLoading: toursLoading } = useVirtualTours();

  const filteredPlants = plants?.filter((plant: Plant) => {
    const matchesSearch = !searchQuery || 
      plant.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.botanicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.medicinalUses.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.region.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || selectedCategory === "all" || plant.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleQuickFilter = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-soft-green to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-poppins font-bold text-forest mb-4">
              Explore Traditional Medicine
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover the healing power of medicinal plants through our interactive 3D platform. 
              Learn about AYUSH herbs with immersive visualization and expert knowledge.
            </p>
            
            <SearchBar 
              onSearch={setSearchQuery} 
              onQuickFilter={handleQuickFilter}
            />
          </div>
        </div>
      </section>

      {/* Virtual Tours Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-poppins font-bold text-forest mb-4">Virtual Tours</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Take guided journeys through curated collections of medicinal plants</p>
          </div>

          {toursLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {tours?.map((tour) => (
                <VirtualTourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Plants Section */}
      <section className="py-16 bg-soft-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-poppins font-bold text-forest mb-2">Featured Plants</h2>
              <p className="text-gray-600">Explore our collection of medicinal plants with detailed 3D models</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Anti-inflammatory">Anti-inflammatory</SelectItem>
                  <SelectItem value="Antibacterial">Antibacterial</SelectItem>
                  <SelectItem value="Adaptogen">Adaptogen</SelectItem>
                  <SelectItem value="Digestive">Digestive</SelectItem>
                  <SelectItem value="Healing">Healing</SelectItem>
                  <SelectItem value="Brain Health">Brain Health</SelectItem>
                  <SelectItem value="Sacred">Sacred</SelectItem>
                  <SelectItem value="Vitamin C">Vitamin C</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {plantsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className={`grid ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"} gap-6`}>
              {filteredPlants?.map((plant) => (
                <PlantCard key={plant.id} plant={plant} viewMode={viewMode} />
              ))}
            </div>
          )}

          {filteredPlants && filteredPlants.length > 0 && (
            <div className="text-center mt-12">
              <Button className="bg-fresh-green text-white px-8 py-3 rounded-xl hover:bg-forest transition-colors font-medium">
                Load More Plants
              </Button>
            </div>
          )}

          {filteredPlants && filteredPlants.length === 0 && !plantsLoading && (
            <div className="text-center py-12">
              <p className="text-gray-600">No plants found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* My Personal Garden Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-poppins font-bold text-forest mb-4">My Personal Garden</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Keep track of your favorite plants, add personal notes, and create your own collection</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-fresh-green transition-colors">
              <div className="text-center">
                <div className="w-16 h-16 bg-fresh-green/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Leaf className="text-fresh-green text-2xl" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-forest mb-2">Bookmarked Plants</h3>
                <p className="text-gray-600 mb-4">Save plants for quick access and future reference</p>
                <div className="bg-fresh-green/10 rounded-lg p-3 text-center">
                  <span className="text-2xl font-bold text-fresh-green">12</span>
                  <p className="text-sm text-gray-600">plants saved</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-fresh-green transition-colors">
              <div className="text-center">
                <div className="w-16 h-16 bg-golden/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <CircuitBoard className="text-golden text-2xl" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-forest mb-2">Personal Notes</h3>
                <p className="text-gray-600 mb-4">Add your own observations and experiences</p>
                <div className="bg-golden/10 rounded-lg p-3 text-center">
                  <span className="text-2xl font-bold text-golden">8</span>
                  <p className="text-sm text-gray-600">notes written</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-fresh-green transition-colors">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Shield className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-forest mb-2">Shared Collections</h3>
                <p className="text-gray-600 mb-4">Share your plant knowledge with others</p>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                  <p className="text-sm text-gray-600">collections shared</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-forest text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-fresh-green rounded-full flex items-center justify-center">
                  <Leaf className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-poppins font-semibold">Virtual Herbal Garden</h3>
                  <p className="text-sm text-gray-300">AYUSH Medicine Platform</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Bridging traditional medicinal knowledge with modern technology for accessible herbal education.
              </p>
            </div>

            <div>
              <h4 className="font-poppins font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Plant Library</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Virtual Tours</a></li>
                <li><a href="#" className="hover:text-white transition-colors">3D Gallery</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Search Plants</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-poppins font-semibold mb-4">AYUSH Systems</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Ayurveda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Yoga & Naturopathy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Unani</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Siddha</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Homeopathy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-poppins font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-600 mt-8 pt-8 text-center">
            <p className="text-gray-300 text-sm">
              &copy; 2024 Virtual Herbal Garden. Built for Smart India Hackathon 2024. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
