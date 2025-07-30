"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";

// Define Product interface based on component usage
interface Product {
  id: string;
  name: string;
  images: string[];
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      const debounce = setTimeout(() => {
        fetch(`/api/search?query=${query}`)
          .then((res) => res.json())
          .then((data) => setResults(data));
      }, 300); // 300ms debounce

      return () => clearTimeout(debounce);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${query}`);
      setIsFocused(false);
    }
  };

  return (
    <div className="relative w-full max-w-4xl" ref={searchRef}>
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for products, brands, and more..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className="w-full rounded-full px-14 py-4 text-lg bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white text-gray-900 placeholder:text-gray-500 transition-all duration-200"
          />
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <SearchIcon className="h-6 w-6 text-gray-500" />
          </div>
        </div>
      </form>
      {isFocused && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white shadow-xl rounded-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <ul>
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/product/${product.id}`}
                  className="flex items-center p-4 hover:bg-gray-50 transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
                  onClick={() => setIsFocused(false)}
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="object-cover rounded-lg"
                  />
                  <span className="ml-4 text-gray-900 font-medium text-lg">{product.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}