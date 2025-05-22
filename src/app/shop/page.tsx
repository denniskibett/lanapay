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
      <main className="flex-grow bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Shop items available</h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {data && data.map((item) => (
              <div key={item.id} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
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
                    <h3 className="text-sm text-gray-700">{item.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{item.color}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
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