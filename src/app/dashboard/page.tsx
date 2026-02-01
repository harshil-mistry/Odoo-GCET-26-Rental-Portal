"use client";

import { useEffect, useState } from "react";
import { Loader2, Package, CalendarClock, TrendingUp, ArrowUpRight, Clock } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

import { InvoiceList } from "@/components/invoice-list";

export default function DashboardPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const searchParams = useSearchParams();

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "invoices") {
            setActiveTab("invoices");
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/orders/mine");
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data.orders);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "confirmed": return { color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", dot: "bg-emerald-500" };
            case "pickedup": return { color: "bg-blue-500/10 text-blue-500 border-blue-500/20", dot: "bg-blue-500" };
            case "returned": return { color: "bg-gray-500/10 text-gray-500 border-gray-500/20", dot: "bg-gray-500" };
            case "cancelled": return { color: "bg-red-500/10 text-red-500 border-red-500/20", dot: "bg-red-500" };
            default: return { color: "bg-amber-500/10 text-amber-500 border-amber-500/20", dot: "bg-amber-500" };
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={28} />
            </div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
    );

    const activeRentals = orders.filter(o => o.status === 'confirmed' || o.status === 'pickedup').length;
    const totalSpent = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="space-y-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/25">
                        👋
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif font-bold tracking-tight">Welcome back!</h1>
                        <p className="text-muted-foreground">Here's what's happening with your rentals.</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-4 border-b border-border/50 pb-1">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`text-sm font-medium pb-3 border-b-2 transition-colors ${activeTab === "overview"
                            ? "border-primary text-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("invoices")}
                        className={`text-sm font-medium pb-3 border-b-2 transition-colors ${activeTab === "invoices"
                            ? "border-primary text-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Invoices
                    </button>
                </div>
            </motion.div>

            {activeTab === "overview" ? (
                <>
                    {/* Stats Cards */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="group relative bg-gradient-to-br from-primary/5 via-card to-card border border-border/50 p-6 rounded-3xl overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform" />
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <Package className="text-primary" size={24} />
                                    </div>
                                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Active</span>
                                </div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Active Rentals</p>
                                <h3 className="text-4xl font-bold">{activeRentals}</h3>
                            </div>
                        </div>

                        <div className="group relative bg-gradient-to-br from-blue-500/5 via-card to-card border border-border/50 p-6 rounded-3xl overflow-hidden transition-all hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/30">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform" />
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                        <CalendarClock className="text-blue-500" size={24} />
                                    </div>
                                    <span className="text-xs font-medium text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full">All time</span>
                                </div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Total Orders</p>
                                <h3 className="text-4xl font-bold">{orders.length}</h3>
                            </div>
                        </div>

                        <div className="group relative bg-gradient-to-br from-emerald-500/5 via-card to-card border border-border/50 p-6 rounded-3xl overflow-hidden transition-all hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/30">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform" />
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                        <TrendingUp className="text-emerald-500" size={24} />
                                    </div>
                                    <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">Lifetime</span>
                                </div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Total Spent</p>
                                <h3 className="text-4xl font-bold">₹{totalSpent.toLocaleString()}</h3>
                            </div>
                        </div>
                    </motion.div>

                    {/* Recent Orders */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Recent Orders</h2>
                            <Link href="/dashboard/orders">
                                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                                    View all <ArrowUpRight size={14} />
                                </Button>
                            </Link>
                        </div>

                        {orders.length === 0 ? (
                            <div className="relative border-2 border-dashed border-border rounded-3xl p-16 text-center overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent" />
                                <div className="relative">
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-muted flex items-center justify-center">
                                        <Package size={36} className="text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                        Start your creative journey by renting premium gear from us.
                                    </p>
                                    <Link href="/browse">
                                        <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/25">
                                            Browse Catalog
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.slice(0, 5).map((order, index) => {
                                    const statusConfig = getStatusConfig(order.status);
                                    return (
                                        <motion.div
                                            key={order._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group bg-card border border-border/50 rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-4 transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-muted overflow-hidden flex-shrink-0">
                                                    {order.items[0]?.productId?.images?.[0] ? (
                                                        <img src={order.items[0].productId.images[0]} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package size={24} className="text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                                            #{order._id.slice(-6).toUpperCase()}
                                                        </span>
                                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${statusConfig.color}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-semibold">
                                                        {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}: {order.items.slice(0, 2).map((i: any) => i.productId?.name || "Product").join(", ")}{order.items.length > 2 && '...'}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Clock size={12} />
                                                        Booked for {format(new Date(order.startDate), "MMM d, yyyy")}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 md:gap-6">
                                                <div className="text-right">
                                                    <p className="text-xl font-bold">₹{order.totalAmount?.toLocaleString()}</p>
                                                    <p className="text-xs text-muted-foreground">Total</p>
                                                </div>
                                                <Button variant="outline" size="sm" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Details
                                                </Button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                </>
            ) : (
                <motion.div variants={itemVariants}>
                    <InvoiceList role="user" />
                </motion.div>
            )}
        </motion.div>
    );
}
