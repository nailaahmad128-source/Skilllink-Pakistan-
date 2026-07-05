import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import Categories from "@/components/home/Categories";
import FeaturedJobsSection from "@/components/home/FeaturedJobsSection";
import TopEmployers from "@/components/home/TopEmployers";
import CareerTips from "@/components/home/CareerTips";
import SuccessStories from "@/components/home/SuccessStories";
import CTABanner from "@/components/home/CTABanner";
import { getCategoryJobCounts, getFeaturedJobs, getTopEmployers } from "@/lib/data";

export default async function HomePage() {
  const [categories, jobs, employers] = await Promise.all([
    getCategoryJobCounts(),
    getFeaturedJobs(6),
    getTopEmployers(6),
  ]);

  return (
    <div className="min-h-screen font-sans bg-white dark:bg-gray-950">
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <Categories categories={categories} />
        <FeaturedJobsSection jobs={jobs} />
        <TopEmployers employers={employers} />
        <CareerTips />
        <SuccessStories />
        <CTABanner />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
