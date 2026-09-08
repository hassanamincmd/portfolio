import type { Metadata } from "next";
import { Micro_5, Space_Grotesk } from "next/font/google";
import "@/components/draft/figma-page.css";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const micro5 = Micro_5({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-micro-5",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hassan Amin, Product Designer",
  description:
    "Hassan Amin, product designer. Software interfaces, design systems, and interactive experiences.",
  metadataBase: new URL("https://hassanamin.net"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Hassan Amin",
    title: "Hassan Amin, Product Designer",
    description:
      "Hassan Amin, product designer. Software interfaces, design systems, and interactive experiences.",
    url: "https://hassanamin.net/",
    images: [
      {
        url: "/website-thumbnail.png",
        width: 1232,
        height: 604,
        alt: "Hassan Amin, Product Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hassan Amin, Product Designer",
    description:
      "Hassan Amin, product designer. Software interfaces, design systems, and interactive experiences.",
    images: ["/website-thumbnail.png"],
  },
  icons: {
    icon: {
      url: "/favicon.png",
      type: "image/png",
      sizes: "512x512",
    },
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${micro5.variable}`}>
      <body>{children}</body>
    </html>
  );
}
