import Navbar from "@/components/navbar";
import Home from "./home";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-auto">
      <Navbar />

      {/* Import home page */}
      <Home />
    </main>
  );
}
