'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { RadioGroup, Radio } from "@headlessui/react";
import { StarIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { supabase } from '@/utils/supabaseClient';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

interface Product {
  id: string;
  name: string;
  price: number;
  imagesrc: string;
  imagealt: string;
  color: string;
  description?: string;
  size?: string;
}

function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);
  const [selectedColor, setSelectedColor] = useState<{ name: string; class: string; selectedClass: string }>({ 
    name: '', 
    class: 'bg-white', 
    selectedClass: 'ring-gray-400' 
  });
  const [selectedSize, setSelectedSize] = useState({ name: 'M', inStock: true });
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        const colorOptions = [
          { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
          { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
          { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
        ];
        const defaultColor = colorOptions.find(c => c.name === data.color) || colorOptions[0];
        
        setProduct(data);
        setSelectedColor(defaultColor);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleCheckout = () => {
    if (!product) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      imagesrc: product.imagesrc,
      imagealt: product.imagealt,
      selectedColor,
      selectedSize,
      quantity,
    };

    localStorage.setItem('cartItem', JSON.stringify(cartItem));
    router.push('/shop/checkout');
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  function classNames(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-white flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-white flex items-center justify-center">
          <div className="text-lg text-red-500">Error loading product or product not found</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
            <div className="lg:col-span-1">
              <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 relative">
                <Image
                  src={product.imagesrc}
                  alt={product.imagealt}
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>

            <div className="lg:col-span-1 mt-10 lg:mt-0">
              <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{product.name}</h2>

              <section aria-labelledby="information-heading" className="mt-2">
                <h3 id="information-heading" className="sr-only">Product information</h3>
                <p className="text-2xl text-gray-900">${(product.price * quantity).toFixed(2)}</p>

                <div className="mt-6">
                  <h4 className="sr-only">Reviews</h4>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          aria-hidden="true"
                          className={classNames(
                            rating < 4 ? 'text-gray-900' : 'text-gray-200',
                            'h-5 w-5 flex-shrink-0'
                          )}
                        />
                      ))}
                    </div>
                    <p className="sr-only">4 out of 5 stars</p>
                    <a href="#" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      117 reviews
                    </a>
                  </div>
                </div>
              </section>

              <section aria-labelledby="options-heading" className="mt-10">
                <h3 id="options-heading" className="sr-only">Product options</h3>

                <form>
                  <fieldset aria-label="Choose a color">
                    <legend className="text-sm font-medium text-gray-900">Color</legend>
                    <RadioGroup
                      value={selectedColor}
                      onChange={setSelectedColor}
                      className="mt-4 flex items-center space-x-3"
                    >
                      {[
                        { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
                        { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
                        { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
                      ].map((color) => (
                        <Radio
                          key={color.name}
                          value={color}
                          className={classNames(
                            color.selectedClass,
                            'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none data-[checked]:ring-2'
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              color.class,
                              'h-8 w-8 rounded-full border border-black border-opacity-10'
                            )}
                          />
                        </Radio>
                      ))}
                    </RadioGroup>
                  </fieldset>

                  <fieldset aria-label="Choose a size" className="mt-10">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">Size</div>
                      <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        Size guide
                      </a>
                    </div>
                    <RadioGroup
                      value={selectedSize}
                      onChange={setSelectedSize}
                      className="mt-4 grid grid-cols-4 gap-4"
                    >
                      {[
                        { name: 'XXS', inStock: true },
                        { name: 'XS', inStock: true },
                        { name: 'S', inStock: true },
                        { name: 'M', inStock: true },
                        { name: 'L', inStock: true },
                        { name: 'XL', inStock: true },
                        { name: 'XXL', inStock: true },
                        { name: 'XXXL', inStock: false },
                      ].map((size) => (
                        <Radio
                          key={size.name}
                          value={size}
                          disabled={!size.inStock}
                          className={classNames(
                            size.inStock
                              ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                              : 'cursor-not-allowed bg-gray-50 text-gray-200',
                            'group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none'
                          )}
                        >
                          <span>{size.name}</span>
                          {!size.inStock && (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                            >
                              <svg
                                className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                stroke="currentColor"
                              >
                                <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                              </svg>
                            </span>
                          )}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </fieldset>

                  <div className="mt-4">
                    <label htmlFor="quantity" className="text-sm font-medium text-gray-900">
                      Quantity
                    </label>
                    <div className="flex items-center mt-2">
                      <button
                        type="button"
                        onClick={decrementQuantity}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-l-md hover:bg-gray-300 focus:outline-none"
                      >
                        <MinusIcon className="h-5 w-5" />
                      </button>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-12 text-center border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        min="1"
                      />
                      <button
                        type="button"
                        onClick={incrementQuantity}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 focus:outline-none"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="mt-10 w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Add to cart
                  </button>
                </form>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ProductPage;