import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900/50 backdrop-blur-lg border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex space-x-6">
            <Link href="#" className="p-2 rounded-full bg-gray-800/40 hover:bg-cyan-400/20 transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </Link>
            <Link href="#" className="p-2 rounded-full bg-gray-800/40 hover:bg-cyan-400/20 transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link href="#" className="p-2 rounded-full bg-gray-800/40 hover:bg-cyan-400/20 transition-colors">
              <span className="sr-only">Discord</span>
              <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.125-.094.25-.188.368-.288a.076.076 0 01.077-.01c3.928 1.793 8.18 1.793 12.061 0a.075.075 0 01.078.01c.12.1.245.194.37.288a.077.077 0 01-.006.127 12.3 12.3 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.84 19.84 0 006.002-3.03.077.077 0 00.032-.056c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zm-8.02 12.38c-1.552 0-2.813-1.484-2.813-3.325 0-1.84 1.246-3.326 2.813-3.326 1.566 0 2.815 1.485 2.815 3.326 0 1.841-1.248 3.325-2.815 3.325zm6.343 0c-1.552 0-2.813-1.484-2.813-3.325 0-1.84 1.246-3.326 2.813-3.326 1.566 0 2.815 1.485 2.815 3.326 0 1.841-1.248 3.325-2.815 3.325z" />
              </svg>
            </Link>
          </div>
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} LanaPay. Empowering Africa's digital economy.
          </p>
        </div>
      </div>
    </footer>
  )
}