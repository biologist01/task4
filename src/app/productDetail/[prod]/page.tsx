import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import ProductDetailsClient from "./ProductDetailsClient";

type Product = {
  _id: string;
  name: string;
  price: number;
  discountPercentage: number;
  tags: string[];
  imageUrl: string;
  description: string;
};

export default async function Page({ params }: { params: { prod: string } }) {
  // Fetch product data
  const query = await client.fetch(`
    *[_type == "product"]{
      _id,
      name,
      price,
      discountPercentage,
      tags,
      "imageUrl": image.asset->url,
      description
    }
  `);

  const product = query.find((item: Product) => item._id === params.prod);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-2xl font-semibold text-red-600">Product not found.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 lg:p-12">
      <section className="container mx-auto">
        <ProductDetailsClient
          product={{
            id: product._id,
            name: product.name,
            price: product.price,
            description: product.description,
            imageUrl: urlFor(product.imageUrl).url(),
          }}
          relatedProducts={query} // Pass related products for recommendations
        />
      </section>
    </main>
  );
}
