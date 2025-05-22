import Link from "next/link";

// components/DashboardSidebar.tsx
export default function DashboardSidebar({ role }: { role: string }) {
  return (
    <aside className="w-64 bg-white h-screen border-r">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6">LanaPay Dashboard</h2>
        <nav className="space-y-2">
          <Link 
            href="/dashboard" 
            className="block p-2 hover:bg-gray-50 rounded"
          >
            Overview
          </Link>
          {role === 'business' && (
            <Link
              href="/dashboard/transactions"
              className="block p-2 hover:bg-gray-50 rounded"
            >
              Transactions
            </Link>
          )}
          <Link
            href="/dashboard/wallets"
            className="block p-2 hover:bg-gray-50 rounded"
          >
            Wallets
          </Link>
        </nav>
      </div>
    </aside>
  )
}