import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Categories from "@/components/home/Categories";
import { getCategoryJobCounts } from "@/lib/data";

export const metadata = { title: "Job Categories" };

export default async function CategoriesPage() {
  const categories = await getCategoryJobCounts();
  return (
    <div className="min-h-screen font-sans bg-white dark:bg-gray-950">
      <Navbar />
      <div className="pt-16">
        <Categories categories={categories} showViewAll={false} />
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
