"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Box, ShieldCheck, Zap, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { IProduct } from "@/types";
import { ProductCard } from "@/components/product-card";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    // Fetch a few products for the featured section
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          // Take first 4 items
          setFeaturedProducts(data.slice(0, 4));
        }
      } catch (e) {
        console.error("Failed to fetch featured", e);
      }
    };
    fetchFeatured();
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />

        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto space-y-6"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-secondary text-secondary-foreground text-xs font-bold tracking-wide uppercase">
              <Star size={12} className="fill-current" />
              Trusted by 500+ Creatives
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]">
              Rent the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Extraordinary</span>.
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Access premium cameras, drones, and tech gear without the premium price tag.
              Seamless booking, instant availability updates, and flexible terms.
            </motion.p>

            <motion.div variants={itemVariants} className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/browse">
                <Button size="lg" className="rounded-full px-8 h-14 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                  Start Browsing <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-base border-border/60 bg-background/50 backdrop-blur-sm">
                  How it works
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Zap className="w-6 h-6 text-yellow-500" />, title: "Instant Booking", desc: "Real-time stock checks. No back-and-forth emails. Book instantly." },
              { icon: <ShieldCheck className="w-6 h-6 text-green-500" />, title: "Verified Gear Quality", desc: "Every item is inspected and sanitized before pickup. Top condition guaranteed." },
              { icon: <Box className="w-6 h-6 text-blue-500" />, title: "Flexible Duration", desc: "Rent for a day, a week, or a month. Rates auto-adjust for longer terms." }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mb-4 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 font-heading">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Trending Gear</h2>
              <p className="text-muted-foreground">Most rented items this week</p>
            </div>
            <Link href="/browse">
              <Button variant="ghost" className="hidden sm:flex group">View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" /></Button>
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <p className="text-muted-foreground">Loading trending gear...</p>
            </div>
          )}

          <Link href="/browse">
            <Button variant="outline" className="w-full sm:hidden mt-8">View All Products</Button>
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden bg-primary px-6 py-16 md:px-12 md:py-24 text-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Ready to elevate your production?</h2>
              <p className="text-white/90 text-lg md:text-xl">Join thousands of creators who trust SmartRent for their equipment needs.</p>
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="mt-4 rounded-full px-8 h-14 font-bold text-primary hover:bg-white text-base">
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Simplified) */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 SmartRent Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
