import Navbar from "@/components/navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-auto">
      <Navbar />
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to MyShop</h1>
        <p className="text-xl mb-8">Manage your products efficiently</p>
        <Link href="/products">
          <Button size="lg">View Products</Button>
        </Link>
      </div>
    </main>
  );
}
