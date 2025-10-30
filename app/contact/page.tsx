"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";

/**
 * Contact Page Component
 * Contact form (currently no backend integration)
 */
export default function ContactPage() {
  const language = useLanguageStore((state) => state.language);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const content = {
    tr: {
      title: "İletişim",
      subtitle: "Benimle iletişime geçin",
      name: "Ad",
      email: "E-posta",
      subject: "Konu",
      message: "Mesaj",
      send: "Gönder",
      namePlaceholder: "Adınız",
      emailPlaceholder: "ornek@email.com",
      subjectPlaceholder: "Konu",
      messagePlaceholder: "Mesajınız",
    },
    en: {
      title: "Contact",
      subtitle: "Get in touch with me",
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
      send: "Send",
      namePlaceholder: "Your name",
      emailPlaceholder: "example@email.com",
      subjectPlaceholder: "Subject",
      messagePlaceholder: "Your message",
    },
  };

  const t = content[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission will be implemented later
    console.log("Form submitted:", formData);
    alert("Form submission coming soon!");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold">{t.title}</h1>
            <p className="mt-2 text-muted-foreground">{t.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                {t.name}
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder={t.namePlaceholder}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                {t.email}
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder={t.emailPlaceholder}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-medium"
              >
                {t.subject}
              </label>
              <input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder={t.subjectPlaceholder}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium"
              >
                {t.message}
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder={t.messagePlaceholder}
                rows={6}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              <Send className="mr-2 h-4 w-4" />
              {t.send}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}

