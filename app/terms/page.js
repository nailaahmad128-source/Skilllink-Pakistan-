import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="min-h-screen font-sans bg-white dark:bg-gray-950">
      <Navbar />
      <div className="pt-32 pb-16 max-w-3xl mx-auto px-4 sm:px-6 prose dark:prose-invert">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Terms & Conditions</h1>
        <div className="text-gray-600 dark:text-gray-400 space-y-4 text-sm leading-relaxed">
          <p>By using SkillLink Pakistan, you agree to the following terms.</p>
          <h3 className="text-gray-900 dark:text-white font-bold">Job Seekers</h3>
          <p>You are responsible for the accuracy of your profile and CV. Applications are sent directly to employers; SkillLink does not guarantee employment outcomes.</p>
          <h3 className="text-gray-900 dark:text-white font-bold">Employers</h3>
          <p>All job posts are subject to admin review and approval. Employers must be truthful about job details and compensation, and must not post discriminatory or misleading listings.</p>
          <h3 className="text-gray-900 dark:text-white font-bold">Account Suspension</h3>
          <p>We reserve the right to suspend accounts that violate these terms, post fraudulent listings, or misuse the platform.</p>
          <p className="text-xs text-gray-400 mt-8">Last updated: {new Date().getFullYear()}</p>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
