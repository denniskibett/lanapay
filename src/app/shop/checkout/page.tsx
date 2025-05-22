'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import Image from 'next/image';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    image_url: string; // Changed to match Supabase response
  };
}

function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    const { data, error } = await supabase
      .from('cart')
      .select(`
        id, 
        product_id, 
        quantity, 
        product:products (name, price, image_url)
      `);

    if (error) {
      console.error(error);
      return;
    }

    // Safe type assertion
    const cartData = data as unknown as Array<{
      id: string;
      product_id: string;
      quantity: number;
      product: {
        name: string;
        price: number;
        image_url: string;
      };
    }>;

    setCart(cartData);
    calculateSubtotal(cartData);
  }

  function calculateSubtotal(cart: CartItem[]) {
    const total = cart.reduce((acc, item) => 
      acc + (item.quantity * item.product.price), 0
    );
    setSubtotal(total);
  }


  return (
      <>
      <Navbar />
      <div className="relative flex w-full items-center overflow-hidden bg-white px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <div className="grid w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
        <div className="sm:col-span-8 lg:col-span-7">
          <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">Shopping cart</h2>

          <ul role="list" className="-my-6 divide-y divide-gray-200">
            {cart.map((item) => (
              <li key={item.id} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
                  <Image
                    alt={item.product.name}
                    src={item.product.image_url}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>{item.product.name}</h3>
                      <p className="ml-4">${item.product.price.toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <p className="text-gray-500">
                      Subtotal: ${(item.quantity * item.product.price).toFixed(2)}
                    </p>

                    <div className="flex">
                      <button
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                        onClick={() => { } }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
            <div className="mt-6">
              <Link
                href="/checkout"
                className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Checkout
              </Link>
            </div>
            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
              <p>
                or{' '}
                <Link
                  href="/shop"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div><Footer />
    </>
  );
}

export default Checkout;