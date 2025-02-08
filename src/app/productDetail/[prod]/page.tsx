import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import ProductDetailsClient from "./ProductDetailsClient";

type Prod = {
  _id: string;
  name: string;
  price: number;
  discountPercentage: number;
  tags: string[];
  imageUrl: string;
  description: string;
  stockLevel: number;
};

export default async function Page({ params }: { params: { productDetails: string } }) {
  // Fetch product data on the server with no caching.
  const query = await client.fetch(
    `*[_type == "product"]{
      _id,
      name,
      price,
      discountPercentage,
      tags,
      "imageUrl": image.asset->url,
      description,
      stockLevel
    }`,
    {},
    { cache: 'no-store' }  // Force a fresh fetch on every request
  );
  
  const product = query.find((item: Prod) => item._id == params.productDetails);

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <ProductDetailsClient
      product={{
        id: product._id,
        name: product.name,
        price: product.price,
        description: product.description,
        stockLevel: product.stockLevel,
        imageUrl: urlFor(product.imageUrl).url(),
      }}
      relatedProducts={query} // Pass relatedProducts as needed
    />
  );
}