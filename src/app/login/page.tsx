"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    if (data.user.role === 'vendor') router.push("/vendor");
                    else if (data.user.role === 'admin') router.push("/admin");
                    else router.push("/");
                }
            });
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.user.role === 'vendor') router.push("/vendor");
                else if (data.user.role === 'admin') router.push("/admin");
                else router.push("/");
                router.refresh();
            } else {
                const err = await res.json();
                alert(err.message || "Login failed");
            }
        } catch (error) {
            console.error(error);
            alert("Login error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex relative h-full w-full flex-col text-white p-12 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-black" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />

                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />

                {/* Decorative Line */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-primary to-transparent opacity-50" />


                {/* Testimonial */}
                <div className="relative z-20 mt-auto">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 space-y-4">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Sparkles key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                            ))}
                        </div>
                        <blockquote className="text-xl font-serif italic leading-relaxed">
                            "This platform completely revolutionized how we handle our production equipment scaling. It's simply beautiful."
                        </blockquote>
                        <footer className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500" />
                            <div>
                                <p className="font-medium">Sofia Davis</p>
                                <p className="text-sm text-white/60">Director at FrameOne</p>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-8 bg-background">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px]"
                >
                    <div className="flex flex-col space-y-3 text-center">
                        <h1 className="text-4xl font-serif font-bold tracking-tight">Welcome back</h1>
                        <p className="text-muted-foreground">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="h-12 rounded-xl bg-muted/30 border-border/50 text-base"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Password</label>
                                <Link href="#" className="text-sm text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="h-12 rounded-xl bg-muted/30 border-border/50 text-base"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base rounded-xl shadow-lg shadow-primary/25 group"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-4 text-muted-foreground">
                                New to SmartRent?
                            </span>
                        </div>
                    </div>

                    <Link href="/signup" className="block">
                        <Button variant="outline" className="w-full h-12 rounded-xl border-border/50">
                            Create an account
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
