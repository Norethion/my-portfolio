"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Mail, Phone, Github, Linkedin, Twitter, MapPin } from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Contact Page Component
 * Contact form (currently no backend integration)
 */
export default function ContactPage() {
  const language = useLanguageStore((state) => state.language);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [personalInfo, setPersonalInfo] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    location?: string;
    avatar?: string;
  }>({});
  const [infoLoading, setInfoLoading] = useState(true);

  useEffect(() => {
    fetch("/api/personal-info")
      .then((res) => res.json())
      .then((data) => {
        setPersonalInfo(data);
      })
      .catch((err) => console.error("Error fetching personal info:", err))
      .finally(() => setInfoLoading(false));
  }, []);

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
      comingSoon: "Form gönderimi yakında gelecek!",
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
      comingSoon: "Form submission coming soon!",
    },
  };

  const t = content[language];

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast({
        title: language === "tr" ? "Mesaj gönderildi!" : "Message sent!",
        description: language === "tr" ? "En kısa sürede dönüş yapılacaktır." : "We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: language === "tr" ? "Bir hata oluştu" : "An error occurred",
        description: language === "tr" ? "Lütfen daha sonra tekrar deneyin." : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Build contact info items that have values
  const contactInfoItems = [];
  if (personalInfo.email) {
    contactInfoItems.push({
      icon: Mail,
      label: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    });
  }
  if (personalInfo.phone) {
    contactInfoItems.push({
      icon: Phone,
      label: personalInfo.phone,
      href: `tel:${personalInfo.phone.replace(/\s/g, "")}`,
    });
  }
  if (personalInfo.github) {
    contactInfoItems.push({
      icon: Github,
      label: personalInfo.github,
      href: personalInfo.github.startsWith("http") ? personalInfo.github : `https://${personalInfo.github}`,
      external: true,
    });
  }
  if (personalInfo.linkedin) {
    contactInfoItems.push({
      icon: Linkedin,
      label: personalInfo.linkedin,
      href: personalInfo.linkedin.startsWith("http") ? personalInfo.linkedin : `https://${personalInfo.linkedin}`,
      external: true,
    });
  }
  if (personalInfo.twitter) {
    contactInfoItems.push({
      icon: Twitter,
      label: personalInfo.twitter,
      href: personalInfo.twitter.startsWith("http") ? personalInfo.twitter : `https://${personalInfo.twitter}`,
      external: true,
    });
  }
  if (personalInfo.location) {
    contactInfoItems.push({
      icon: MapPin,
      label: personalInfo.location,
      href: null,
    });
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-2 sm:px-4 pt-8 pb-16">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold">{t.title}</h1>
            <p className="mt-2 text-muted-foreground text-sm sm:text-base">{t.subtitle}</p>
          </div>

          {/* Contact Info Section */}
          {infoLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : contactInfoItems.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contactInfoItems.map((item, index) => {
                    const Icon = item.icon;
                    if (item.href) {
                      return (
                        <a
                          key={index}
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                        >
                          <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-sm break-all">{item.label}</span>
                        </a>
                      );
                    }
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg">
                        <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Form */}
          <Card>
            <CardContent className="pt-6">
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
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
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
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
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
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
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
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? (language === "tr" ? "Gönderiliyor..." : "Sending...") : t.send}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

