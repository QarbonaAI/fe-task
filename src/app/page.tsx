import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Package, Database, Zap, Shield } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-auto">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 dark:text-slate-100 mb-6">
            Product Management System
          </h1>
          <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
            A comprehensive product management solution built with Next.js, TanStack Query, and modern web technologies.
            Manage your product catalog with full CRUD operations, real-time search, and beautiful UI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="text-lg px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white">
                <Package className="mr-2 h-5 w-5" />
                View Products
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800 dark:text-slate-100">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-slate-100 dark:bg-slate-700 rounded-lg shadow-sm">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">Full CRUD Operations</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Create, read, update, and delete products with intuitive forms and validation.
              </p>
            </div>
            
            <div className="text-center p-6 bg-slate-100 dark:bg-slate-700 rounded-lg shadow-sm">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">Real-time Search</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Search products by title or brand with debounced input for optimal performance.
              </p>
            </div>
            
            <div className="text-center p-6 bg-slate-100 dark:bg-slate-700 rounded-lg shadow-sm">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">Advanced Filtering</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Sort by multiple fields, pagination, and category-based filtering.
              </p>
            </div>
            
            <div className="text-center p-6 bg-slate-100 dark:bg-slate-700 rounded-lg shadow-sm">
              <div className="bg-orange-100 dark:bg-orange-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">Form Validation</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Robust form validation using Zod schemas and React Hook Form.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-slate-100 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800 dark:text-slate-100">Built With Modern Technologies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-4">
              <div className="bg-slate-800 text-slate-100 rounded-lg p-4 mb-3 shadow-md">
                <span className="text-lg font-bold">Next.js</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">React Framework</p>
            </div>
            
            <div className="text-center p-4">
              <div className="bg-blue-600 text-white rounded-lg p-4 mb-3 shadow-md">
                <span className="text-lg font-bold">TanStack Query</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Data Fetching</p>
            </div>
            
            <div className="text-center p-4">
              <div className="bg-purple-600 text-white rounded-lg p-4 mb-3 shadow-md">
                <span className="text-lg font-bold">Zod</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Schema Validation</p>
            </div>
            
            <div className="text-center p-4">
              <div className="bg-green-600 text-white rounded-lg p-4 mb-3 shadow-md">
                <span className="text-lg font-bold">Tailwind CSS</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Styling</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Explore the product management system and see it in action.
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3 bg-white text-blue-600 hover:bg-slate-100">
              <Package className="mr-2 h-5 w-5" />
              Explore Products
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
