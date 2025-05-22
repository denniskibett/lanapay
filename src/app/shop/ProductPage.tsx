import { useState, useEffect } from 'react';
import { supabase } from './../../utils/supabaseClient';
import { StarIcon } from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  href: string;
  imageSrc: string;
  imagealt: string;
  price: number;
  color: string;
  sizes: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
}

function classNames(arg0: string, arg1: string): string {
  return `${arg0} ${arg1}`;
}

function ProductPage({ id }: { id: string }) {
  const [product, setProduct] = useState<Product>({});

  useEffect(() => {
    fetchProduct();
  }, []);

  async function fetchProduct() {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, href, imageSrc, imagealt, price, color, sizes, colors')
      .eq('id', id);
    if (error) console.error(error);
    else setProduct(data[0]);
  }

  return (
    <div className="relative flex w-full items-center overflow-hidden bg-white px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
        <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
          <img
            alt={product.imagealt}
            src={product.imageSrc}
            className="object-cover object-center"
          />
        </div>
        <div className="sm:col-span-8 lg:col-span-7">
          <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{product.name}</h2>

          <section aria-labelledby="information-heading" className="mt-2">
            <h3 id="information-heading" className="sr-only">
              Product information
            </h3>

            <p className="text-2xl text-gray-900">{product?.price ?? ''}</p>

            {/* Reviews */}
            <div className="mt-6">
              <h4 className="sr-only">Reviews</h4>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={classNames(
                        product.rating > rating ? 'text-gray-900' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0',
                      )}
                    />
                  ))}
                </div>
                <p className="sr-only">{product?.rating} out of 5 stars</p>
                <a href="#" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {product?.reviewCount} reviews
                </a>
              </div>
            </div>

            {/* Add to cart button */}
            <button
              type="submit"
              className={classNames(
                'mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
              )}
            >
              Add to cart
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;