import Navbar from "@/components/navbar";


export default function HomePage() {
  return (
    <main className="min-h-screen overflow-auto">
      <Navbar />
      <div className="flex justify-center mt-8">
        <a href="/products" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Go to Products</a>
      </div>
    </main>
  );
}
