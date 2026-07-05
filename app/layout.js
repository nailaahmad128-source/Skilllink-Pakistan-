import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "SkillLink Pakistan — Find Jobs & Hire Talent Across Pakistan",
    template: "%s | SkillLink Pakistan",
  },
  description:
    "Pakistan's most trusted career platform. Find jobs in IT, healthcare, education, engineering, banking, and more across Karachi, Lahore, Islamabad and all major cities.",
  keywords: [
    "jobs in Pakistan",
    "SkillLink Pakistan",
    "Karachi jobs",
    "Lahore jobs",
    "Islamabad jobs",
    "job portal Pakistan",
    "hire employees Pakistan",
  ],
  openGraph: {
    title: "SkillLink Pakistan — Find Jobs & Hire Talent",
    description: "Pakistan's most trusted career platform connecting professionals with leading employers nationwide.",
    url: "/",
    siteName: "SkillLink Pakistan",
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillLink Pakistan — Find Jobs & Hire Talent",
    description: "Pakistan's most trusted career platform.",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0C6B38",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
