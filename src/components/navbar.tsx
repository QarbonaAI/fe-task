import React from "react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Package } from "lucide-react";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-4 bg-slate-100 dark:bg-slate-800 shadow-sm">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100">
          <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          MyShop
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/" 
            className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors font-medium"
          >
            Home
          </Link>
          <Link 
            href="/products" 
            className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors font-medium"
          >
            Products
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
      </div>
    </div>
  );
}
