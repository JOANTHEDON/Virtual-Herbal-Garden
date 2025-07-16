import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import PlantDetail from "@/pages/plant-detail";
import VirtualTours from "@/pages/virtual-tours";
import Gallery3D from "@/pages/gallery-3d";
import MyGarden from "@/pages/my-garden";
import Chatbot from "@/components/chatbot";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/plants/:id" component={PlantDetail} />
      <Route path="/tours" component={VirtualTours} />
      <Route path="/gallery" component={Gallery3D} />
      <Route path="/garden" component={MyGarden} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <Chatbot />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
