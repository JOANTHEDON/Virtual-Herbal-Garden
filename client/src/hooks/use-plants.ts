import { useQuery } from "@tanstack/react-query";
import type { Plant, VirtualTour } from "@shared/schema";

export function usePlants() {
  return useQuery<Plant[]>({
    queryKey: ["/api/plants"],
  });
}

export function usePlant(id: number) {
  return useQuery<Plant>({
    queryKey: ["/api/plants", id.toString()],
    enabled: id > 0,
  });
}

export function useSearchPlants(query: string) {
  return useQuery<Plant[]>({
    queryKey: ["/api/plants/search", query],
    enabled: query.length > 0,
  });
}

export function usePlantsByCategory(category: string) {
  return useQuery<Plant[]>({
    queryKey: ["/api/plants/category", category],
    enabled: category.length > 0,
  });
}

export function usePlantsByRegion(region: string) {
  return useQuery<Plant[]>({
    queryKey: ["/api/plants/region", region],
    enabled: region.length > 0,
  });
}

export function useVirtualTours() {
  return useQuery<VirtualTour[]>({
    queryKey: ["/api/tours"],
  });
}

export function useVirtualTour(id: number) {
  return useQuery<VirtualTour>({
    queryKey: ["/api/tours", id.toString()],
    enabled: id > 0,
  });
}
