import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Doto, Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const doto = Doto({ subsets: ['latin'], variable: '--font-doto' });

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-poppins' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sdmafia.hdtl.in'),
  title: {
    default: 'System Design Mafia — Architecture Diagrams & Visual Guides',
    template: '%s — System Design Mafia',
  },
  description: 'Free, open-source system design guides with interactive architecture diagrams. Explore microservices, event-driven, CQRS, hexagonal, and layered architecture patterns.',
  keywords: ['system design', 'architecture diagrams', 'microservices', 'distributed systems', 'CQRS', 'event-driven architecture', 'system design interview', 'software architecture', 'scalability'],
  authors: [{ name: 'Atharva Arbat', url: 'https://x.com/arbat_atharva' }],
  creator: 'Atharva Arbat',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'System Design Mafia',
    title: 'System Design Mafia — Architecture Diagrams & Visual Guides',
    description: 'Free, open-source system design guides with interactive diagrams. Explore microservices, event-driven, CQRS, hexagonal, and layered architectures.',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'System Design Mafia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'System Design Mafia — Architecture Diagrams & Visual Guides',
    description: 'Free, open-source system design guides with interactive diagrams. Explore microservices, event-driven, CQRS, hexagonal, and layered architectures.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'System Design Mafia',
  url: 'https://sdmafia.hdtl.in',
  logo: 'https://sdmafia.hdtl.in/logo.png',
  description: 'Free, open-source system design guides with interactive architecture diagrams.',
  sameAs: [
    'https://github.com/atharvaarbat',
    'https://x.com/arbat_atharva',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'System Design Mafia',
  url: 'https://sdmafia.hdtl.in',
  description: 'Free, open-source system design guides with interactive architecture diagrams.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://sdmafia.hdtl.in/patterns?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable, poppins.variable, doto.variable)}
    >
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon-light.ico" media="(prefers-color-scheme: dark)" />
        <link rel="icon" type="image/x-icon" href="/favicon-dark.ico" media="(prefers-color-scheme: light)" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:border focus:border-foreground/20 focus:text-sm focus:font-bold">
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
