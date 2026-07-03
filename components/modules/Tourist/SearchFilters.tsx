// src/components/modules/Tourist/SearchFilters.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, MapPin, DollarSign } from "lucide-react";
import { ListingCategory } from "@/types/listing.interface";
import { Badge } from "@/components/ui/badge";

interface SearchFiltersProps {
  onSearch: (filters: any) => void;
  initialFilters?: any;
}

const SearchFilters = ({ onSearch, initialFilters = {} }: SearchFiltersProps) => {
  const [filters, setFilters] = useState({
    city: initialFilters.city || "",
    category: initialFilters.category || "",
    minPrice: initialFilters.minPrice || 0,
    maxPrice: initialFilters.maxPrice || 1000,
    sortBy: initialFilters.sortBy || "newest"
  });

  const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice]);

  const handleInputChange = (name: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      ...filters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    });
  };

  const handleReset = () => {
    const defaultFilters = {
      city: "",
      category: "",
      minPrice: 0,
      maxPrice: 1000,
      sortBy: "newest"
    };
    setFilters(defaultFilters);
    setPriceRange([0, 1000]);
    onSearch(defaultFilters);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tours by name or description..."
            className="pl-10"
            value={filters.city || ""}
            onChange={(e) => handleInputChange("city", e.target.value)}
          />
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            City
          </Label>
          <Input
            placeholder="e.g., New York, Paris"
            value={filters.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
          />
        </div>

        <Separator />

        {/* Category */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => handleInputChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {Object.values(ListingCategory).map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-4">
          <Label className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Price Range
            </span>
            <Badge variant="secondary">
              ${priceRange[0]} - ${priceRange[1]}
            </Badge>
          </Label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={1000}
            step={10}
            className="py-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>$0</span>
            <span>$1000</span>
          </div>
        </div>

        <Separator />

        {/* Sort By */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleInputChange("sortBy", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button type="submit" className="w-full">
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="w-full"
          >
            Reset Filters
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;