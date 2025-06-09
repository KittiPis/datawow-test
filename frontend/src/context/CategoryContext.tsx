"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Category } from "@/types/types";

interface CategoryContextType {
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
}

const defaultCategory: Category = {
  id: 0,
  name: "Community",
  slug: "community",
};

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCategory, setSelectedCategory] =
    useState<Category>(defaultCategory);

  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = (): CategoryContextType => {
  const ctx = useContext(CategoryContext);
  if (!ctx) {
    throw new Error("useCategory must be used inside CategoryProvider");
  }
  return ctx;
};
