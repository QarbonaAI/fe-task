import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-auto bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <Navbar />
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col items-center text-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-2">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            Welcome to QuarbonaAI
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-300">
            Manage your product catalog with advanced features, analytics, and a beautiful, modern UI. Powered by Next.js, TanStack Query, and Zod validation.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button size="lg" className="px-8 text-lg shadow-md">
              View Products
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow p-8 flex flex-col items-center text-center border border-slate-100 dark:border-slate-800">
          <svg className="w-10 h-10 mb-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3v4H8V3" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">Product Management</h3>
          <p className="text-slate-600 dark:text-slate-400">Full CRUD operations: add, edit, and delete products with instant updates and validation.</p>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow p-8 flex flex-col items-center text-center border border-slate-100 dark:border-slate-800">
          <svg className="w-10 h-10 mb-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4 4 4-4m0-5V3m-8 9v6a2 2 0 002 2h4a2 2 0 002-2v-6" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">Advanced Table</h3>
          <p className="text-slate-600 dark:text-slate-400">Paginated, sortable, and filterable data table powered by TanStack Query and React Table.</p>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow p-8 flex flex-col items-center text-center border border-slate-100 dark:border-slate-800">
          <svg className="w-10 h-10 mb-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">Robust Validation</h3>
          <p className="text-slate-600 dark:text-slate-400">Zod-powered forms with instant feedback and error handling for a seamless experience.</p>
        </div>
      </section>
    </main>
  );
}
