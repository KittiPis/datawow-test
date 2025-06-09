"use client";

import { Fragment, useEffect, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { getCategories } from "@/lib/apiCategories";
import { Category } from "@/types/types";

interface MenuCategoriesProps {
  selectedCategory?: Category;
  onSelect: (category: Category) => void;
}

export function MenuCategories({
  selectedCategory,
  onSelect,
}: MenuCategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCategories();
      if (data) {
        setCategories([
          {
            id: 0,
            name: "Community",
            slug: "community",
          },
          ...data,
        ]);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative w-full text-left">
      <Menu as="div" className="relative">
        <div>
          <MenuButton
            className="w-full inline-flex items-center gap-x-1.5 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow ring-1 ring-gray-300
           hover:bg-gray-50 focus:outline-none"
          >
            {selectedCategory?.name || "Community"}
            <ChevronDownIcon
              aria-hidden="true"
              className="w-4 h-4 text-gray-400"
            />
          </MenuButton>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute inset-x-0 mx-auto mt-2 max-w-xs origin-top rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
            <div className="py-1">
              {categories.length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No categories found
                </div>
              )}
              {categories.map((category) => (
                <MenuItem
                  key={category.id}
                  onClick={() => onSelect(category)}
                  as="a"
                  className="block px-4 py-2 text-sm text-gray-700 ui-active:bg-gray-100 ui-active:text-gray-900 cursor-default"
                >
                  {category.name}
                </MenuItem>
              ))}
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}
