"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Globe, Heart, Shield, Sparkles, Users, Zap } from "lucide-react";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Pattern */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none -z-10" />

            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

            <div className="container mx-auto px-4 pt-32 pb-20">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-4xl mx-auto space-y-6 mb-32 relative"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                        <Sparkles size={14} />
                        <span className="tracking-wide uppercase text-xs font-bold">Our Story</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                        Empowering the next generation of creators.
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        We believe that access to professional-grade equipment shouldn't be a barrier to creativity.
                        SmartRent bridges the gap between ambition and reality.
                    </p>
                </motion.div>

                {/* Mission Section */}
                <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl md:text-4xl font-serif font-bold">Democratizing Access</h2>
                        <div className="w-20 h-1 bg-primary rounded-full" />
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Started in a small college dorm, Odoo Rental Service was born from a simple frustration:
                            why is it so hard to get your hands on a good camera for a weekend project?
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Today, we connect thousands of equipment owners with filmmakers, photographers,
                            and hobbyists. We've created a trusted ecosystem where gear is utilized, not just stored.
                        </p>

                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="space-y-2">
                                <h3 className="text-4xl font-bold">10K+</h3>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider">Active Renters</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-4xl font-bold">₹2Cr+</h3>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider">Creator Earnings</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-3xl blur-3xl -z-10" />
                        <div className="relative rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=2070&auto=format&fit=crop"
                                alt="Film crew working"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                <blockquote className="text-white italic font-serif text-lg">
                                    "This platform completely changed how I produce my short films."
                                </blockquote>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Values Grid */}
                <div className="mb-32">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold">Why Creators Trust Us</h2>
                        <p className="text-muted-foreground">Built by creators, for creators. We understand what matters most.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: "Fully Insured",
                                description: "Every rental is protected. Broken lens? Stolen drone? We've got you covered up to ₹5 Lakhs."
                            },
                            {
                                icon: Zap,
                                title: "Lightning Fast",
                                description: "Same-day delivery available in select cities. Book in 2 minutes, get shooting in 2 hours."
                            },
                            {
                                icon: Heart,
                                title: "Verified Community",
                                description: "We vet every member. Our review system ensures you're dealing with professionals."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-8 rounded-3xl bg-muted/20 border border-border/50 hover:bg-muted/40 transition-colors relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <item.icon size={100} />
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                    <item.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-32">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="bg-card border border-border/50 rounded-[40px] overflow-hidden relative"
                    >
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

                        <div className="relative p-12 md:p-20 text-center space-y-8">
                            <h2 className="text-3xl md:text-5xl font-serif font-bold">Join the Movement</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Whether you have gear gathering dust or a vision waiting to be captured, there's a place for you here.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                <Link href="/signup">
                                    <Button size="lg" className="h-14 px-8 rounded-2xl text-lg shadow-xl shadow-primary/20">
                                        Start Renting
                                    </Button>
                                </Link>
                                <Link href="/browse">
                                    <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl text-lg bg-background/50 backdrop-blur-sm">
                                        Browse Gear
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
