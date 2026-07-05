"use client";

import { useState, useEffect } from "react";

const WHATSAPP_NUMBER = "923001234567"; // replace with your real business number, no + or leading 0

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`fixed bottom-6 right-6 z-40 transition-all duration-500 ${visible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
      <div className="relative group">
        <div className="absolute bottom-14 right-0 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-3 w-44 opacity-0 group-hover:opacity-100 transition pointer-events-none">
          <p className="text-xs font-semibold text-gray-800 dark:text-white">💬 WhatsApp Support</p>
          <p className="text-xs text-gray-500 mt-0.5">Mon–Fri · 9AM–6PM PKT</p>
        </div>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi SkillLink Pakistan, I need help with...")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl text-2xl hover:scale-110 transition-transform"
          style={{ background: "#25D366" }}
        >
          💬
        </a>
      </div>
    </div>
  );
}
