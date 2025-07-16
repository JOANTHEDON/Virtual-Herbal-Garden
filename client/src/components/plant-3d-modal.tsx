import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Plant3DViewer from "@/components/plant-3d-viewer";
import { Box, Eye } from "lucide-react";
import type { Plant } from "@shared/schema";

interface Plant3DModalProps {
  plant: Plant;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "secondary";
  buttonSize?: "sm" | "default" | "lg";
}

export default function Plant3DModal({ 
  plant, 
  buttonText = "View 3D Model", 
  buttonVariant = "default",
  buttonSize = "default"
}: Plant3DModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={buttonVariant} 
          size={buttonSize}
          className="transition-all duration-200 hover:scale-105"
        >
          <Box className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0 overflow-hidden" aria-describedby="plant-3d-description">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-forest flex items-center">
            <Eye className="h-6 w-6 mr-3 text-fresh-green" />
            3D Model: {plant.commonName}
          </DialogTitle>
          <p id="plant-3d-description" className="text-gray-600 italic">
            {plant.botanicalName} - Interactive 3D model viewer
          </p>
        </DialogHeader>
        
        <div className="flex-1 p-6 pt-0">
          <div className="h-full bg-gray-50 rounded-xl overflow-hidden">
            <Plant3DViewer plant={plant} />
          </div>
          
          {/* Plant Info Overlay */}
          <div className="mt-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-forest mb-2">Category</h4>
                <p className="text-sm text-gray-600">{plant.category}</p>
              </div>
              <div>
                <h4 className="font-semibold text-forest mb-2">Region</h4>
                <p className="text-sm text-gray-600">{plant.region}</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold text-forest mb-2">Primary Use</h4>
                <p className="text-sm text-gray-600">{plant.primaryUse}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}