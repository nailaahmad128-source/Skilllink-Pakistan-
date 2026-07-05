import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import TopEmployers from "@/components/home/TopEmployers";
import { getTopEmployers } from "@/lib/data";

export const metadata = { title: "Employers Hiring in Pakistan" };

export default async function EmployersPage() {
  const employers = await getTopEmployers(48);
  return (
    <div className="min-h-screen font-sans bg-white dark:bg-gray-950">
      <Navbar />
      <div className="pt-16">
        <TopEmployers employers={employers} />
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
