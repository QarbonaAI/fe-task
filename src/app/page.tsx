import { type Metadata } from "next";
import HomePageClient from "./home-page-client";

export const metadata: Metadata = {
  title: "Products | FE task QuarbonaAI",
  description: "Manage and view your product inventory",
};

export default function HomePage() {
  return <HomePageClient />;
}
