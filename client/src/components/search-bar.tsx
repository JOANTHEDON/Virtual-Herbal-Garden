import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Shield, Heart, Leaf, CircuitBoard } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onQuickFilter: (category: string) => void;
}

export default function SearchBar({ onSearch, onQuickFilter }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const quickFilters = [
    { label: "Immunity", icon: Shield, category: "Anti-inflammatory" },
    { label: "Heart Health", icon: Heart, category: "Adaptogen" },
    { label: "Skin Care", icon: Leaf, category: "Healing" },
    { label: "Digestion", icon: CircuitBoard, category: "Digestive" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative mb-6">
        <Input
          type="text"
          placeholder="Search by plant name, benefit, or region..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full py-4 px-6 pr-24 text-lg rounded-2xl border-2 border-gray-200 focus:border-fresh-green shadow-lg"
        />
        <Button
          onClick={handleSearch}
          className="absolute right-2 top-2 bg-fresh-green text-white hover:bg-forest transition-colors rounded-xl"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {quickFilters.map((filter) => {
          const Icon = filter.icon;
          return (
            <Button
              key={filter.label}
              variant="outline"
              onClick={() => onQuickFilter(filter.category)}
              className="bg-white text-forest border-gray-200 hover:bg-fresh-green hover:text-white transition-colors rounded-full"
            >
              <Icon className="mr-2 h-4 w-4" />
              {filter.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
