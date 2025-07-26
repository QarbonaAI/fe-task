import Navbar from "@/components/navbar";
import Home from "@/pages/home";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-auto">
      <Navbar />

      {/* Import home page */}
      <Home />
    </main>
  );
}
