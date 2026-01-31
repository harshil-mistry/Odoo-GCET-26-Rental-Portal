"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function UserDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Basic User Check
        fetch("/api/auth/me").then(async (res) => {
            if (res.ok) {
                const data = await res.json();
                if (!data.user) router.push("/login");
            } else {
                router.push("/login");
            }
        }).finally(() => setLoading(false));
    }, [router]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-background pt-24 pb-8">
            <div className="container mx-auto px-4 max-w-6xl animate-in fade-in duration-500">
                {children}
            </div>
        </div>
    );
}
