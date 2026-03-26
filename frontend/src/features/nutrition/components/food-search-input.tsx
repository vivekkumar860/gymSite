"use client";

import { useState, useRef, useEffect } from "react";
import type { FoodItem } from "@/api/schemas/nutrition.schema";
import { Input } from "@/components/ui/input";
import { useFoodSearch } from "../hooks/use-food-search";

type FoodSearchInputProps = {
  onSelect: (food: FoodItem) => void;
};

export function FoodSearchInput({ onSelect }: FoodSearchInputProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useFoodSearch(query);
  const foods = data?.data ?? [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(food: FoodItem) {
    onSelect(food);
    setQuery(food.name);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <Input
        type="text"
        placeholder="Search foods..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && query.length >= 2 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-md">
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Searching...
            </div>
          ) : foods.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No foods found.
            </div>
          ) : (
            <ul className="max-h-60 overflow-y-auto py-1">
              {foods.map((food) => (
                <li key={food.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleSelect(food)}
                  >
                    <span className="truncate font-medium">{food.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {Math.round(food.macros.calories)} kcal / {food.servingSize}
                      {food.servingUnit}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
