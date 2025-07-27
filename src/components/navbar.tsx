import React from "react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex items-center space-x-6">
        <Link href="/products" className="text-xl font-bold">
          MyShop
        </Link>
        <nav className="flex items-center space-x-4">
          <Link 
            href="/products" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Products
          </Link>
        </nav>
      </div>
      <div className="ml-auto">
        <ModeToggle />
      </div>
    </div>
  );
}
