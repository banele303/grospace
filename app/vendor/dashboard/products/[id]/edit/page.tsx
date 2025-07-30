import { requireVendor } from "@/app/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductForm from "../../components/product-form";

async function getProduct(id: string, vendorId: string) {
  const product = await prisma.product.findUnique({
    where: {
      id,
      vendorId, // Ensure vendor can only edit their own products
    },
  });
  
  if (!product) {
    notFound();
  }
  
  return product;
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { vendor } = await requireVendor();
  const product = await getProduct(params.id, vendor.id);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/vendor/dashboard/products/${product.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Product
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-green-800">Edit Product</h1>
        </div>
      </div>
      
      <ProductForm 
        initialValues={product} 
        vendorId={vendor.id} 
        isEditing={true} 
      />
    </div>
  );
}
