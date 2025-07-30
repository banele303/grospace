"use client";

import { ProductCard } from "./ProductCard";
import { Product } from "@/app/lib/zodSchemas";
import { Pagination } from "./Pagination";

interface FeaturedProductsClientProps {
  products: Product[];
  totalPages?: number;
  currentPage?: number;
  category?: string;
}

export function FeaturedProductsClient({ products, totalPages, currentPage, category }: FeaturedProductsClientProps) {
  // Create dynamic title and description based on category
  const getCategoryInfo = (category?: string) => {
    const categoryMap: Record<string, { title: string; description: string }> = {
      'seeds': { title: 'Quality Seeds Collection', description: 'Discover our handpicked selection of premium seeds for your farming needs' },
      'produce': { title: 'Fresh Produce Collection', description: 'Explore our finest selection of fresh, quality produce' },
      'livestock': { title: 'Livestock Collection', description: 'Browse our carefully selected livestock and animal products' },
      'equipment': { title: 'Farm Equipment Collection', description: 'Discover our professional-grade farming equipment and tools' },
      'fertilizer': { title: 'Fertilizer Collection', description: 'Enhance your crops with our premium fertilizer selection' },
      'organic': { title: 'Organic Products Collection', description: 'Explore our certified organic products for sustainable farming' },
      'services': { title: 'Agricultural Services', description: 'Professional agricultural services for your farming needs' },
      'grains': { title: 'Premium Grains Collection', description: 'Quality grains for all your agricultural requirements' },
      'fruits': { title: 'Fresh Fruits Collection', description: 'Discover our selection of fresh, seasonal fruits' },
      'vegetables': { title: 'Garden Vegetables Collection', description: 'Fresh vegetables grown with care and quality' },
      'herbs': { title: 'Herbs & Spices Collection', description: 'Aromatic herbs and spices for culinary and medicinal uses' },
      'dairy': { title: 'Dairy Products Collection', description: 'Fresh dairy products from trusted local farms' },
      'meat': { title: 'Quality Meat Collection', description: 'Premium meat products from responsibly raised animals' },
      'poultry': { title: 'Poultry Collection', description: 'Fresh poultry products and live birds' },
      'fish': { title: 'Fresh Fish Collection', description: 'Quality fish and seafood products' },
    };

    return categoryMap[category || ''] || { 
      title: 'Related Products', 
      description: 'Discover more products from the same category' 
    };
  };

  const { title, description } = getCategoryInfo(category);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            {description}
          </p>
        </div>
        <div className="mt-10">
          {products.length > 0 ? (
            <div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
              {totalPages && currentPage && totalPages > 1 && (
                <Pagination totalPages={totalPages} currentPage={currentPage} />
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500">No products to display at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Loading skeleton for product cards
export function LoadingRows() {
  return (
    <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-md p-4 animate-pulse">
          <div className="h-40 bg-gray-200 rounded-md mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}
