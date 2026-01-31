"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

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
        // Redirect if already logged in
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            {/* Left Side - Visual - Reversed for visual interest */}
            <div className="hidden lg:flex relative h-full w-full flex-col p-10 dark:border-r order-2 text-white">
                <div
                    className="absolute inset-0 bg-zinc-900"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1605656100063-233633ab0a7b?q=80&w=1920&auto=format&fit=crop')",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                    }}
                />
                <div className="absolute inset-0 bg-purple-900/60 mix-blend-multiply" /> {/* Purple tint for consistency */}
                <div className="absolute inset-0 bg-black/40" />

                <div className="relative z-20 flex items-center gap-2 font-serif text-2xl font-bold">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg">S</div>
                    SmartRent
                </div>

                <div className="relative z-20 mt-auto text-right self-end max-w-lg">
                    <blockquote className="space-y-2">
                        <p className="text-2xl font-serif font-medium leading-relaxed tracking-wide">
                            &ldquo;We rent out our specialized drones here. The vendor tools are miles ahead of the competition.&rdquo;
                        </p>
                        <footer className="text-base font-medium opacity-80 pt-2 flex items-center gap-2 justify-end">
                            Marcus Chen - Aerial Cinematography
                            <div className="w-8 h-8 rounded-full bg-white/20" />
                        </footer>
                    </blockquote>
                </div>
            </div>

            {/* Right Side - Form - Now on Left */}
            <div className="flex items-center justify-center p-8 order-1">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-3xl font-serif font-bold tracking-tight">Create an account</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your details beneath to get started
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Full Name</label>
                            <Input
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="h-11 bg-muted/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Email</label>
                            <Input
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="h-11 bg-muted/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Password</label>
                            <Input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="h-11 bg-muted/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">I am a...</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="flex h-11 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="customer">Customer (I want to rent)</option>
                                <option value="vendor">Vendor (I want to list)</option>
                            </select>
                        </div>

                        {formData.role === "vendor" && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <label className="text-sm font-medium leading-none">GSTIN Number</label>
                                <Input
                                    name="gstin"
                                    placeholder="GSTIN12345"
                                    value={formData.gstin}
                                    onChange={handleChange}
                                    required
                                    className="h-11 bg-muted/50"
                                />
                            </div>
                        )}

                        <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </form>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
