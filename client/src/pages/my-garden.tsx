import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePlants } from "@/hooks/use-plants";
import { Heart, BookOpen, Plus, Calendar, Leaf, Target, Star, ArrowLeft } from "lucide-react";
import PlantCard from "@/components/plant-card";
import { Link } from "wouter";

export default function MyGarden() {
  const { data: plants } = usePlants();
  const [, setLocation] = useLocation();
  const [bookmarkedPlantIds, setBookmarkedPlantIds] = useState<number[]>([]);

  // Load bookmarked plants from localStorage
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem("plantBookmarks") || "[]");
    setBookmarkedPlantIds(bookmarks);
  }, []);
  const [gardenGoals, setGardenGoals] = useState([
    { id: 1, title: "Learn 10 immunity herbs", progress: 6, target: 10, category: "Learning" },
    { id: 2, title: "Complete Skin Care tour", progress: 3, target: 5, category: "Tours" },
    { id: 3, title: "Add personal notes", progress: 15, target: 20, category: "Documentation" }
  ]);
  const [newNote, setNewNote] = useState("");
  const [personalNotes] = useState([
    { id: 1, plantName: "Turmeric", note: "Great for morning golden milk. Use 1 tsp with warm milk and honey.", date: "2024-01-15" },
    { id: 2, plantName: "Neem", note: "Applied neem oil for skin issues - very effective for acne treatment.", date: "2024-01-14" },
    { id: 3, plantName: "Aloe Vera", note: "Fresh gel works amazingly for sunburn relief. Keep plant on windowsill.", date: "2024-01-13" }
  ]);

  const bookmarkedPlantsData = plants?.filter(plant => bookmarkedPlantIds.includes(plant.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="text-center mb-12">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="flex items-center text-gray-600 hover:text-forest mb-6 mx-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold text-forest mb-4">
            My Garden
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your personal space to track favorite plants, learning progress, and medicinal discoveries.
            Create your own digital herbarium and document your journey with traditional medicine.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-forest mb-1">{bookmarkedPlants.length}</h3>
              <p className="text-gray-600 text-sm">Favorite Plants</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-forest mb-1">{personalNotes.length}</h3>
              <p className="text-gray-600 text-sm">Personal Notes</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-forest mb-1">{gardenGoals.length}</h3>
              <p className="text-gray-600 text-sm">Active Goals</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold text-forest mb-1">24</h3>
              <p className="text-gray-600 text-sm">Plants Learned</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="favorites" className="data-[state=active]:bg-fresh-green data-[state=active]:text-white">
              Favorites
            </TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-fresh-green data-[state=active]:text-white">
              My Notes
            </TabsTrigger>
            <TabsTrigger value="goals" className="data-[state=active]:bg-fresh-green data-[state=active]:text-white">
              Goals
            </TabsTrigger>
            <TabsTrigger value="journal" className="data-[state=active]:bg-fresh-green data-[state=active]:text-white">
              Journal
            </TabsTrigger>
          </TabsList>
          
          {/* Favorite Plants */}
          <TabsContent value="favorites" className="mt-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-forest">Favorite Plants</h2>
                <Link href="/plants">
                  <Button className="bg-fresh-green hover:bg-forest text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add More
                  </Button>
                </Link>
              </div>
              
              {bookmarkedPlantsData && bookmarkedPlantsData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookmarkedPlantsData.map((plant) => (
                    <PlantCard key={plant.id} plant={plant} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No favorite plants yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start exploring plants and add them to your favorites
                  </p>
                  <Link href="/plants">
                    <Button className="bg-fresh-green hover:bg-forest text-white">
                      Explore Plants
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Personal Notes */}
          <TabsContent value="notes" className="mt-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-forest mb-6">Personal Notes</h2>
              
              {/* Add New Note */}
              <Card className="mb-6 border-dashed border-2 border-gray-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-forest mb-4">Add New Note</h3>
                  <div className="space-y-4">
                    <Input placeholder="Plant name" className="border-gray-200" />
                    <Textarea 
                      placeholder="Share your experience, preparation methods, or observations..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="border-gray-200 min-h-[100px]"
                    />
                    <Button className="bg-fresh-green hover:bg-forest text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Save Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Existing Notes */}
              <div className="space-y-4">
                {personalNotes.map((note) => (
                  <Card key={note.id} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-forest">{note.plantName}</h4>
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(note.date).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{note.note}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Learning Goals */}
          <TabsContent value="goals" className="mt-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-forest">Learning Goals</h2>
                <Button className="bg-fresh-green hover:bg-forest text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Goal
                </Button>
              </div>
              
              <div className="space-y-6">
                {gardenGoals.map((goal) => (
                  <Card key={goal.id} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-forest mb-1">{goal.title}</h4>
                          <Badge className="bg-fresh-green/10 text-fresh-green text-xs">
                            {goal.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-forest">
                            {goal.progress}/{goal.target}
                          </div>
                          <div className="text-sm text-gray-500">
                            {Math.round((goal.progress / goal.target) * 100)}% complete
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-fresh-green h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Garden Journal */}
          <TabsContent value="journal" className="mt-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-forest mb-6">Garden Journal</h2>
              
              <div className="space-y-6">
                <Card className="border-l-4 border-l-fresh-green">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-forest">Today's Discovery</h4>
                      <Badge className="bg-green-100 text-green-700">
                        Today
                      </Badge>
                    </div>
                    <p className="text-gray-600">
                      Learned about the different preparation methods for Ashwagandha. The root powder 
                      mixed with warm milk seems to be the most traditional method for stress relief.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-blue-400">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-forest">Weekly Goal Progress</h4>
                      <Badge className="bg-blue-100 text-blue-700">
                        This Week
                      </Badge>
                    </div>
                    <p className="text-gray-600">
                      Completed the "Immunity Herbs" virtual tour. Particularly impressed by the 
                      synergistic effects of combining Tulsi, Amla, and Ginger for respiratory health.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-purple-400">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-forest">Monthly Reflection</h4>
                      <Badge className="bg-purple-100 text-purple-700">
                        This Month
                      </Badge>
                    </div>
                    <p className="text-gray-600">
                      Started incorporating more Ayurvedic herbs into daily routine. The 3D models 
                      really helped understand the plant structures and identify quality herbs at the market.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}