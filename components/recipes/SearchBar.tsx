"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search recipes..." 
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto mb-8"
    >
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Search recipes"
        />
        <Search className="absolute left-3 text-gray-400" size={20} />
        <button
          type="submit"
          className="absolute right-3 bg-primary text-white px-4 py-1 rounded-md hover:bg-primary/90"
        >
          Search
        </button>
      </div>
    </form>
  );
}
