"use client";

import { CreateProductForm } from "./CreateProductForm";

interface CreateProductClientProps {
  vendorId: string;
  userId: string;
  categories: string[];
  seasonality: string[];
}

export function CreateProductClient({ vendorId, userId, categories, seasonality }: CreateProductClientProps) {
  return (
    <CreateProductForm 
      vendorId={vendorId}
      userId={userId}
      categories={categories} 
      seasonality={seasonality} 
    />
  );
}
