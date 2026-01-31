"use client";

import { useEffect, useState } from "react";
import { Loader2, Package, Calendar, CheckCircle, Clock, Truck, XCircle, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
            case "confirmed": return { label: "Confirmed", icon: CheckCircle, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", dot: "bg-emerald-500" };
            case "pickedup": return { label: "Picked Up", icon: Truck, color: "bg-blue-500/10 text-blue-600 border-blue-500/20", dot: "bg-blue-500" };
            case "returned": return { label: "Returned", icon: CheckCircle, color: "bg-gray-500/10 text-gray-600 border-gray-500/20", dot: "bg-gray-500" };
            case "cancelled": return { label: "Cancelled", icon: XCircle, color: "bg-red-500/10 text-red-600 border-red-500/20", dot: "bg-red-500" };
            default: return { label: "Quote", icon: Clock, color: "bg-amber-500/10 text-amber-600 border-amber-500/20", dot: "bg-amber-500" };
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={28} />
            </div>
            <p className="text-muted-foreground">Loading your orders...</p>
        </div>
    );

    return (
        <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-lg shadow-primary/25">
                    <ShoppingBag size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight">My Rentals</h1>
                    <p className="text-muted-foreground">Manage your past and upcoming equipment rentals.</p>
                </div>
            </motion.div>

            {orders.length === 0 ? (
                <motion.div
                    variants={itemVariants}
                    className="border-2 border-dashed border-border rounded-3xl p-20 text-center bg-gradient-to-br from-muted/20 to-transparent"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-muted flex items-center justify-center">
                        <Package size={36} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        Start your creative journey by renting premium gear from us.
                    </p>
                    <Link href="/browse">
                        <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/25">Browse Catalog</Button>
                    </Link>
                </motion.div>
            ) : (
                <div className="space-y-5">
                    {orders.map((order, index) => {
                        const statusConfig = getStatusConfig(order.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-card border border-border/50 rounded-3xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all"
                            >
                                {/* Header */}
                                <div className="bg-muted/20 px-6 py-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border/50">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${statusConfig.color} border`}>
                                            <StatusIcon size={22} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Order ID</p>
                                            <p className="font-mono font-semibold">#{order._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Order Placed</p>
                                            <p className="text-sm font-medium">{format(new Date(order.createdAt), "MMM d, yyyy")}</p>
                                        </div>
                                        <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border ${statusConfig.color}`}>
                                            {statusConfig.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-5">
                                    {order.items.map((item: any, i: number) => (
                                        <div key={i} className="flex gap-4 items-center">
                                            <div className="w-16 h-16 bg-muted rounded-2xl overflow-hidden flex-shrink-0 border border-border/50">
                                                {item.productId?.images?.[0] ? (
                                                    <img src={item.productId.images[0]} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package size={20} className="text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold truncate">{item.productId?.name || "Product"}</h4>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity} × ₹{item.priceAtBooking?.toLocaleString()}</p>
                                            </div>
                                            <div className="font-semibold">₹{((item.priceAtBooking || 0) * item.quantity).toLocaleString()}</div>
                                        </div>
                                    ))}

                                    <div className="pt-5 border-t border-border/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-muted-foreground" />
                                            <div>
                                                <p className="text-[10px] text-muted-foreground uppercase">Rental Period</p>
                                                <p className="font-medium">
                                                    {format(new Date(order.startDate), "MMM d")} - {format(new Date(order.endDate), "MMM d, yyyy")}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-muted-foreground uppercase">Total Amount</p>
                                            <p className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                                                ₹{order.totalAmount?.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}
