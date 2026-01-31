import type { Metadata } from "next";
import { Inter, Outfit, Playfair_Display } from "next/font/google"; // Added Serif
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";

import { CartProvider } from "@/context/cart-context";
import { GlobalBackground } from "@/components/ui/global-background";
import { CartSheet } from "@/components/cart-sheet";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" }); // Premium Serif

export const metadata: Metadata = {
  title: "SmartRent - Premium Gear Rentals",
  description: "Rent top-tier equipment for your projects. Cameras, Drones, Laptops and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <GlobalBackground />
            <CartSheet />
            <div className="relative z-10">
              <Navbar />
              {children}
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
