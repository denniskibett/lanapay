import Image from "next/image";

interface Company {
  name: string
  logo: string
  width: number
  height: number
}

export function TrustedBy({ companies }: { companies: Company[] }) {
  return (
    <div className="py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold leading-8 text-gray-900 dark:text-gray-300">
          Trusted by Africa's most innovative fintech teams
        </h2>
        
        {/* Desktop Grid */}
        <div className="hidden lg:grid mt-10 grid-cols-4 gap-8 lg:grid-cols-8">
          {companies.map((company) => (
            <div 
              key={company.name}
              className="col-span-1 flex justify-center"
            >
              <Image
                src={company.logo}
                alt={company.name}
                width={158}
                height={48}
                className="max-h-12 w-full object-contain dark:grayscale dark:brightness-0 dark:invert hover:grayscale-0 hover:brightness-100 hover:invert-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="lg:hidden mt-10">
          <div className="relative overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            <div className="flex gap-8 w-max px-4">
              {companies.map((company) => (
                <div 
                  key={company.name}
                  className="snap-center shrink-0 first:pl-4 last:pr-4"
                >
                  <div className="w-40 h-20 flex items-center justify-center p-4 bg-gray-50/5 rounded-xl backdrop-blur-sm border border-white/10">
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={company.width}
                      height={company.height}
                      className="max-h-8 w-full object-contain dark:grayscale dark:brightness-0 dark:invert hover:grayscale-0 hover:brightness-100 hover:invert-0 transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}