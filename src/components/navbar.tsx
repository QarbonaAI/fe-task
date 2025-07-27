import React from "react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Package } from "lucide-react";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex items-center space-x-6">
        <Link href="/" className="flex items-center space-x-2">
          <Package className="h-6 w-6" />
          <span className="font-bold text-xl">MyShop</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link href="/products" className="text-sm font-medium hover:text-primary">
            Products
          </Link>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <ModeToggle />
      </div>
    </div>
  );
}
