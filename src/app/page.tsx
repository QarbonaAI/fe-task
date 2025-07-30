import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-auto">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-full pt-16">
        <h1 className="text-3xl font-bold mb-4">Welcome to MyShop</h1>
        <p className="text-lg text-gray-600 mb-6">
          Browse and manage products using the navigation above.
        </p>
        <Link href="/products">
          <Button>View Products</Button>
        </Link>
      </div>
    </main>
  );
}