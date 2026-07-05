import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  const info = [
    { icon: "📧", label: "Email Support", val: "support@skilllink.pk", sub: "Response within 24 hours", href: "mailto:support@skilllink.pk" },
    { icon: "📞", label: "Phone", val: "+92 300 1234567", sub: "Mon–Fri, 9AM–6PM PKT", href: "tel:+923001234567" },
    { icon: "📍", label: "Head Office", val: "Blue Area, Islamabad", sub: "Pakistan" },
    { icon: "💬", label: "WhatsApp", val: "+92 300 1234567", sub: "Quick queries & support", href: "https://wa.me/923001234567" },
  ];

  return (
    <div className="min-h-screen font-sans bg-white dark:bg-gray-950">
      <Navbar />
      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3">Get in Touch</h1>
            <p className="text-gray-500 dark:text-gray-400">We're here to help — reach out any time</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <ContactForm />

            <div className="space-y-5">
              {info.map((item, i) => {
                const Card = (
                  <div className="flex items-start gap-4 bg-white dark:bg-gray-950 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <div className="font-bold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-0.5">{item.label}</div>
                      <div className="font-bold text-gray-900 dark:text-white text-sm">{item.val}</div>
                      <div className="text-gray-400 text-xs">{item.sub}</div>
                    </div>
                  </div>
                );
                return item.href ? (
                  <a key={i} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    {Card}
                  </a>
                ) : (
                  <div key={i}>{Card}</div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
