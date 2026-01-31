"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, ArrowRight, Store, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer",
        gstin: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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

    const validatePassword = (password: string) => {
        if (password.length < 8) return "Password must be at least 8 characters long";
        if (!/[A-Z]/.test(password)) return "Password must contain at least one capital letter";
        if (!/[a-z]/.test(password)) return "Password must contain at least one small letter";
        if (!/[0-9]/.test(password)) return "Password must contain at least one number";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            alert(passwordError);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
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
                alert(err.message || "Signup failed");
            }
        } catch (error) {
            console.error(error);
            alert("Signup error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center p-8 bg-background order-1">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[420px]"
                >
                    <div className="flex flex-col space-y-3 text-center">
                        <h1 className="text-4xl font-serif font-bold tracking-tight">Create an account</h1>
                        <p className="text-muted-foreground">
                            Join thousands of creators and businesses on SmartRent
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <Input
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="h-12 rounded-xl bg-muted/30 border-border/50 text-base"
                            />
                        </div>
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
                            <label className="text-sm font-medium">Password</label>
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

                        {/* Role Selector - Premium Toggle */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium">I want to...</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: "customer" })}
                                    className={`p-4 rounded-2xl border-2 transition-all text-left group ${formData.role === "customer"
                                        ? "border-primary bg-primary/5"
                                        : "border-border/50 hover:border-border"
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-colors ${formData.role === "customer"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                        }`}>
                                        <User size={20} />
                                    </div>
                                    <p className="font-semibold">Rent Gear</p>
                                    <p className="text-xs text-muted-foreground">Browse and book equipment</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: "vendor" })}
                                    className={`p-4 rounded-2xl border-2 transition-all text-left group ${formData.role === "vendor"
                                        ? "border-primary bg-primary/5"
                                        : "border-border/50 hover:border-border"
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-colors ${formData.role === "vendor"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                        }`}>
                                        <Store size={20} />
                                    </div>
                                    <p className="font-semibold">List Gear</p>
                                    <p className="text-xs text-muted-foreground">Rent out my equipment</p>
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {formData.role === "vendor" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2 overflow-hidden"
                                >
                                    <label className="text-sm font-medium">GSTIN Number</label>
                                    <Input
                                        name="gstin"
                                        placeholder="GSTIN12345..."
                                        value={formData.gstin}
                                        onChange={handleChange}
                                        required
                                        className="h-12 rounded-xl bg-muted/30 border-border/50 text-base"
                                    />
                                    <p className="text-xs text-muted-foreground">Required for vendor registration</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base rounded-xl shadow-lg shadow-primary/25 group"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:flex relative h-full w-full flex-col p-12 text-white order-2 overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-zinc-900"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1605656100063-233633ab0a7b?q=80&w=1920&auto=format&fit=crop')",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-purple-900/60 to-black/80" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />

                {/* Stats */}
                <div className="relative z-20 mt-auto space-y-8">
                    <div className="grid grid-cols-3 gap-6">
                        {[
                            { value: "10K+", label: "Active Users" },
                            { value: "500+", label: "Premium Gear" },
                            { value: "₹2Cr+", label: "In Rentals" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-sm text-white/60">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 space-y-4">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Sparkles key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                            ))}
                        </div>
                        <blockquote className="text-xl font-serif italic leading-relaxed">
                            "We rent out our specialized drones here. The vendor tools are miles ahead of the competition."
                        </blockquote>
                        <footer className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500" />
                            <div>
                                <p className="font-medium">Marcus Chen</p>
                                <p className="text-sm text-white/60">Aerial Cinematography</p>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
}
