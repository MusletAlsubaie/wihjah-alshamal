import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  variable: "--font-cairo",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

const siteTitle = "وِجهة الشمال | بوابة الخدمات الموحدة";
const siteDescription =
  "منصة تصورية لرحلة مستفيد أكثر سهولة وفعالية في منطقة الحدود الشمالية — تقديم الطلبات، التصنيف الذكي، والمتابعة الموحدة.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | وِجهة الشمال",
  },
  description: siteDescription,
  applicationName: "وِجهة الشمال",
  keywords: [
    "وِجهة الشمال",
    "الحدود الشمالية",
    "خدمات المستفيد",
    "تقديم طلب",
    "متابعة طلب",
  ],
  authors: [{ name: "وِجهة الشمال" }],
  creator: "وِجهة الشمال",
  icons: {
    icon: [
      { url: "/branding/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/branding/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/branding/logo-icon.png", type: "image/png" },
    ],
    apple: [{ url: "/branding/logo-icon.png", type: "image/png" }],
    shortcut: "/branding/favicon-32.png",
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: siteUrl,
    siteName: "وِجهة الشمال",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/branding/og-cover.png",
        width: 1200,
        height: 630,
        alt: "وِجهة الشمال — الهوية البصرية",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/branding/og-cover.png"],
  },
  other: {
    "social:square": "/branding/social-square.png",
    "social:story": "/branding/social-story.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className={cairo.className}>{children}</body>
    </html>
  );
}
