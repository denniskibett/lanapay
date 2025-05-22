import Layout from "@/app/layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

function CheckoutPage() {
  const [cartItem, setCartItem] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedCartItem = localStorage.getItem("cartItem");
    if (storedCartItem) {
      setCartItem(JSON.parse(storedCartItem));
    }
  }, []);

  const handleRemoveItem = () => {
    localStorage.removeItem("cartItem");
    setCartItem(null);
  };

  return (
    <Layout>
      <Navbar/>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6">
        <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart</h2>
          <div className="flow-root">
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {cartItem ? (
                <li className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <Image
                    src={cartItem.imagesrc}
                    alt={cartItem.imagealt}
                    width={400} // add this property, adjust the value to match the image width
                    height={400} // add this property, adjust the value to match the image height
                    className="h-full w-full object-cover object-center"
                  />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <a href="#">{cartItem.name}</a>
                        </h3>
                        <p className="ml-4">${(cartItem.price * cartItem.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{cartItem.selectedColor.name}</p>
                      <p className="mt-1 text-sm text-gray-500">{cartItem.selectedSize.name}</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">Qty {cartItem.quantity}</p>

                      <div className="flex">
                        <button
                          type="button"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                          onClick={handleRemoveItem}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ) : (
                <li className="flex py-6 justify-center">
                  <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Your cart is empty!</h2>
                    <p className="text-lg text-gray-600 text-center">Add more items to your cart.</p>
                    <button
                      className="mt-6 bg-indigo-600 text-white py-3 px-6 rounded-md"
                      onClick={() => router.push('/shop')}
                    >
                      Back to Shop
                    </button>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {cartItem && (
            <div className="mt-6 border-t border-gray-200 py-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>${(cartItem.price * cartItem.quantity).toFixed(2)}</p>
              </div>
              <div className="mt-6 text-center">
                <p className="text-lg text-gray-900 font-bold">Choose a payment method:</p>
                <div className="flex justify-center mt-4">
                <button
                  type="button"
                  className="bg-indigo-600 text-white py-3 px-6 rounded-md mr-4 mb-4 w-1/3"
                  onClick={() => {
                    const params = new URLSearchParams({
                      label: "Shop Name", // Replace with dynamic shop name
                      message: `${cartItem.name} - ${cartItem.selectedColor.name}, ${cartItem.selectedSize.name} (Qty: ${cartItem.quantity})`,
                      memo: "Solscan transaction", // Can be replaced with dynamic transaction data
                      amount: (cartItem.price * cartItem.quantity).toFixed(2),
                    }).toString();
                    router.push(`/crypto-payment?${params}`);
                  }}
                >
                  Crypto
                </button>

                  <button
                    type="button"
                    className="bg-indigo-600 text-white py-3 px-6 rounded-md mr-4 mb-4 w-1/3"
                    onClick={() => router.push('/card-payment')}
                  >
                    Card
                  </button>
                  <button
                    type="button"
                    className="bg-indigo-600 text-white py-3 px-6 rounded-md mb-4 w-1/3"
                    onClick={() => router.push('/mobile-money-payment')}
                  >
                    Mobile Money
                  </button>
                </div>
              </div>
              <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                <p>
                  or <button onClick={() => router.push('/shop')} className="text-indigo-600 font-medium hover:text-indigo-500">Continue shopping</button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </Layout>
  );
}

export default CheckoutPage;