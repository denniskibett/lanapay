import Layout from "@/app/layout";
import { supabase } from "@/utils/supabaseClient";
import { RadioGroup, Radio } from "@headlessui/react";
import { StarIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

interface Product {
  id: number;
  name: string;
  price: number;
  imagesrc: string;
  imagealt: string;
  color: string;
  description: string;
}

function ProductPage({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState({ name: product.color, class: 'bg-white', selectedClass: 'ring-gray-400' });
  const [selectedSize, setSelectedSize] = useState({ name: 'M', inStock: true });
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  function classNames(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
  }

  // Function to handle the checkout process by adding item to cart and redirecting to checkout page
  const handleCheckout = () => {
    const totalPrice = (product.price * quantity).toFixed(2);
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

    localStorage.setItem('cartItem', JSON.stringify(cartItem)); // Save the item to localStorage
    router.push(`/checkout`);
  };

  // Function to increment quantity
  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // Function to decrement quantity
  const decrementQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1)); // Ensure quantity doesn't go below 1
  };

  return (
    <Layout>
      <Navbar />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
            <div className="lg:col-span-1">
              <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
                <Image
                  src={product.imagesrc}
                  alt={product.imagealt}
                  className="object-cover object-center"
                  layout="fill" // Makes the image fill its container
                  objectFit="cover" // Ensures the image is properly scaled
                />
              </div>
            </div>
            <div className="lg:col-span-1">
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
                            'h-5 w-5 flex-shrink-0',
                          )}
                        />
                      ))}
                    </div>
                    <p className="sr-only">4 out of 5 stars</p>
                    <a href="#" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">117 reviews</a>
                  </div>
                </div>
              </section>

              <section aria-labelledby="options-heading" className="mt-10">
                <h3 id="options-heading" className="sr-only">Product options</h3>

                <form>
                  {/* Colors */}
                  <fieldset aria-label="Choose a color">
                    <legend className="text-sm font-medium text-gray-900">Color</legend>

                    <RadioGroup
                      value={selectedColor}
                      onChange={setSelectedColor}
                      className="mt-4 flex items-center space-x-3"
                    >
                      {[{ name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' }, { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' }, { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' }].map((color) => (
                        <Radio
                          key={color.name}
                          value={color}
                          aria-label={color.name}
                          className={classNames(
                            color.selectedClass,
                            'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none data-[checked]:ring-2 data-[focus]:data-[checked]:ring data-[focus]:data-[checked]:ring-offset-1',
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              color.class,
                              'h-8 w-8 rounded-full border border-black border-opacity-10',
                            )}
                          />
                        </Radio>
                      ))}
                    </RadioGroup>
                  </fieldset>

                  {/* Sizes */}
                  <fieldset aria-label="Choose a size" className="mt-10">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">Size</div>
                      <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Size guide</a>
                    </div>

                    <RadioGroup
                      value={selectedSize}
                      onChange={setSelectedSize}
                      className="mt-4 grid grid-cols-4 gap-4"
                    >
                      {[{ name: 'XXS', inStock: true }, { name: 'XS', inStock: true }, { name: 'S', inStock: true }, { name: 'M', inStock: true }, { name: 'L', inStock: true }, { name: 'XL', inStock: true }, { name: 'XXL', inStock: true }, { name: 'XXXL', inStock: false }].map((size) => (
                        <Radio
                          key={size.name}
                          value={size}
                          disabled={!size.inStock}
                          className={classNames(
                            size.inStock
                              ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                              : 'cursor-not-allowed bg-gray-50 text-gray-200',
                            'group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none data-[focus]:ring-2 data-[focus]:ring-indigo-500 sm:flex-1',
                          )}
                        >
                          <span>{size.name}</span>
                          {size.inStock ? (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -inset-px rounded-md border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-indigo-500"
                            />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                            >
                              <svg
                                stroke="currentColor"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                              >
                                <line x1={0} x2={100} y1={100} y2={0} vectorEffect="non-scaling-stroke" />
                              </svg>
                            </span>
                          )}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </fieldset>

                  {/* Quantity */}
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
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        min="1"
                        className="w-12 text-center border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
      </div>
      <Footer />
    </Layout>
  );
}

export async function getServerSideProps({ params }: any) {
  const { id } = params;
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product,
    },
  };
}

export default ProductPage;
