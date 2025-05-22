'use client'
import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

interface Item {
  id: string;
  name: string;
  price: number;
  imagesrc: string;
  imagealt: string;
  color: string;
}

function Shop() {
  const [data, setData] = useState<Item[]>([]);
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => {
    supabase
      .from('products')
      .select('id, name, price, imagesrc, imagealt, color')
      .then((response) => {
        const { data, error } = response;
        if (error) {
          setError(error ? new Error(error.message) : null);
        } else {
          setData(data);
        }
      });
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> 
      <main className="relative isolate px-6 pt-14 lg:px-8 font-sans">
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-cyan-500 to-purple-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-white">Shop items available</h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {data && data.map((item) => (
              <div key={item.id} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-white/10 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <Link href={`/shop/item/${item.id}`}>
                    <div className="relative w-full h-80 lg:h-full">
                      <Image
                        alt={item.imagealt}
                        src={item.imagesrc}
                        layout="fill" 
                        objectFit="cover" 
                        className="object-center"
                      />
                    </div>
                  </Link>
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-white">{item.name}</h3>
                    <p className="mt-1 text-sm text-gray-300">{item.color}</p>
                  </div>
                  <p className="text-sm font-medium text-white">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer /> 
    </div>
  );
}

export default Shop;