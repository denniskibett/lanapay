interface FAQ {
  question: string
  answer: string
}

export function FAQs({ faqs }: { faqs: FAQ[] }) {
  return (
    <div className="py-24 sm:py-32 bg-clear-900/30 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20">
          {faqs.map((faq) => (
            <div 
              key={faq.question}
              className="p-8 rounded-2xl bg-gray-800/20 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all"
            >
              <h3 className="text-lg font-semibold leading-7 text-white mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}