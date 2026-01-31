"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Star, Zap, Shield, Globe, MousePointer2 } from "lucide-react";
import { useEffect, useState } from "react";
import { IProduct } from "@/types";
import { ProductCard } from "@/components/product-card";
import { Spotlight } from "@/components/ui/spotlight";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Typewriter } from "@/components/ui/typewriter";
import { useTheme } from "next-themes";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data.slice(0, 4));
        }
      } catch (e) {
        console.error("Failed to fetch featured", e);
      }
    };
    fetchFeatured();
  }, []);

  const testimonials = [
    { quote: "SmartRent transformed how we manage our studio gear. It's flawless.", name: "Alex Rivera", title: "Director, FrameOne" },
    { quote: "The availability checks are a lifesaver. No more double bookings.", name: "Sarah Chen", title: "Producer, IndieLens" },
    { quote: "Best rental platform I've used. Clean, fast, and reliable.", name: "Marcus Johnson", title: "Freelance Photographer" },
    { quote: "I can finally track my inventory from my phone. Game changer.", name: "Emily Davis", title: "Gear House Owner" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300">

      {/* Hero Section with Spotlight */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 flex items-center justify-center min-h-[90vh]">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill={theme === 'dark' ? "white" : "#ec4899"}
        />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold tracking-widest uppercase mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
            Next Gen Rental Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Rent the <br />
            <Typewriter
              words={["Facilities.", "Equipment.", "Future.", "Dream."]}
              className="text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/50"
              cursorClassName="h-10 md:h-16 lg:h-20 bg-foreground/50"
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Experience the future of gear management. Real-time availability, AI-powered insights, and seamless bookings.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/browse">
              <Button size="lg" className="h-14 px-8 rounded-full text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-base font-medium border-border/60 hover:bg-muted/50">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Abstract Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10"></div>
      </section>

      {/* Modern Bento Grid Features */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Crafted for perfection</h2>
            <p className="text-muted-foreground">Every detail optimized for your workflow.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Large Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 row-span-1 rounded-3xl bg-card border border-border p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="p-3 bg-primary/10 w-fit rounded-xl text-primary mb-4">
                  <Zap size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Lightning Fast Booking</h3>
                  <p className="text-muted-foreground max-w-sm">Our Overlapping Date Algorithm ensures 100% accuracy in stock availability, instantly.</p>
                </div>
              </div>
              {/* Abstract Decoration */}
              <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent group-hover:from-primary/10 transition-colors" />
            </motion.div>

            {/* Stacking Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-1 row-span-1 rounded-3xl bg-card border border-border p-8 relative overflow-hidden group hover:shadow-xl transition-all"
            >
              <div className="p-3 bg-blue-500/10 w-fit rounded-xl text-blue-500 mb-6">
                <Globe size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Global Scale</h3>
              <p className="text-muted-foreground">Manage inventory across multiple locations effortlessly.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-1 row-span-1 rounded-3xl bg-card border border-border p-8 relative overflow-hidden group hover:shadow-xl transition-all"
            >
              <div className="p-3 bg-green-500/10 w-fit rounded-xl text-green-500 mb-6">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Security</h3>
              <p className="text-muted-foreground">Enterprise-grade protection for your asset data.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 row-span-1 rounded-3xl bg-card border border-border p-8 relative overflow-hidden group hover:shadow-2xl transition-all flex items-center justify-between"
            >
              <div className="max-w-md">
                <div className="p-3 bg-purple-500/10 w-fit rounded-xl text-purple-500 mb-4">
                  <MousePointer2 size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Intuitive Interface</h3>
                <p className="text-muted-foreground">Designed with the modern user in mind. Themeable, accessible, and beautiful.</p>
              </div>
              <div className="hidden sm:block">
                {/* Fake UI Element */}
                <div className="w-32 h-32 bg-background border border-border rounded-xl shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-500 flex items-center justify-center">
                  <span className="text-4xl font-serif font-bold text-primary">Ui</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Infinite Scroll Testimonials */}
      <section className="py-20 overflow-hidden bg-muted/20">
        <h2 className="text-center font-serif text-3xl font-bold mb-10">Trusted by Creators</h2>
        <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
      </section>

      {/* Featured Products */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-2">Curated Collection</h2>
              <p className="text-muted-foreground">The most sought-after equipment available now.</p>
            </div>
            <Link href="/browse">
              <Button variant="secondary" className="hidden sm:flex group">Browse All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" /></Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            )) : (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[300px] rounded-2xl bg-muted animate-pulse" />
              ))
            )}
          </div>

          <Link href="/browse">
            <Button className="w-full sm:hidden mt-8" variant="secondary">Browse All Products</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">S</div>
                <span className="font-serif text-2xl font-bold tracking-tight">SmartRent</span>
              </Link>
              <p className="text-muted-foreground leading-relaxed">
                The next-generation platform for rental management.
                Empowering creators with instant access to premium gear.
              </p>
              <div className="flex gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                    <Globe size={14} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Platform</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/browse" className="hover:text-primary transition-colors">Browse Gear</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Comparison</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Enterprise</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Stay Updated</h4>
              <p className="text-muted-foreground mb-4">Subscribe to our newsletter for the latest gear drops.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button size="sm">Subscribe</Button>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; 2026 SmartRent Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
