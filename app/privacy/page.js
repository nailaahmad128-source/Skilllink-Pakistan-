import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen font-sans bg-white dark:bg-gray-950">
      <Navbar />
      <div className="pt-32 pb-16 max-w-3xl mx-auto px-4 sm:px-6 prose dark:prose-invert">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
        <div className="text-gray-600 dark:text-gray-400 space-y-4 text-sm leading-relaxed">
          <p>SkillLink Pakistan ("we", "our") respects your privacy. This policy explains what data we collect and how we use it.</p>
          <h3 className="text-gray-900 dark:text-white font-bold">Information We Collect</h3>
          <p>Account details (name, email, phone), profile information you provide (CV, skills, company details), and usage data to improve our service.</p>
          <h3 className="text-gray-900 dark:text-white font-bold">How We Use It</h3>
          <p>To match job seekers with employers, verify accounts, send relevant notifications, and improve the platform. We never sell your personal data.</p>
          <h3 className="text-gray-900 dark:text-white font-bold">Your Rights</h3>
          <p>You may update or delete your profile and CV at any time from your dashboard, or contact us to request full account deletion.</p>
          <p className="text-xs text-gray-400 mt-8">Last updated: {new Date().getFullYear()}</p>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
