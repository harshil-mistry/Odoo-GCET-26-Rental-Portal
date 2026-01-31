"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

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
                // Redirection handled by client-side router, token is set in cookies
                const data = await res.json();
                // Redirect based on role
                if (data.user.role === 'vendor') router.push("/vendor");
                else if (data.user.role === 'admin') router.push("/admin");
                else router.push("/"); // Customer to home

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
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl border border-border shadow-2xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                    <p className="text-muted-foreground mt-2">
                        Enter your credentials to access your account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
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
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-primary hover:underline font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
