"use client";

import { useEffect, useState } from "react";
import { IOrder } from "@/models/Order"; // Adjust path if needed
import { Loader2, Package, CalendarClock, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "quote": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "cancelled": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    if (loading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin" /></div>;

    const activeRentals = orders.filter(o => o.status === 'confirmed').length;
    const totalSpent = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-serif font-bold tracking-tight">Overview</h2>
                <p className="text-muted-foreground">Welcome back, here's what's happening with your rentals.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Active Rentals</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-bold">{activeRentals}</h3>
                        <Package className="text-primary opacity-50" />
                    </div>
                </div>
                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Total Orders</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-bold">{orders.length}</h3>
                        <CalendarClock className="text-blue-500 opacity-50" />
                    </div>
                </div>
                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Total Spent</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-bold">₹{totalSpent.toLocaleString()}</h3>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Lifetime</span>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Recent Orders</h3>

                {orders.length === 0 ? (
                    <div className="border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground bg-muted/30">
                        <Package size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="mb-4">You haven't rented any gear yet.</p>
                        <Link href="/browse"><Button>Browse Catalog</Button></Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.slice(0, 5).map((order) => (
                            <div key={order._id} className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row justify-between gap-4 transition-all hover:border-primary/50 group">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-xs text-muted-foreground">#{order._id.slice(-6).toUpperCase()}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <h4 className="font-medium">
                                        {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}: {order.items.map((i: any) => i.productId?.name || "Product").join(", ")}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        Booked for {format(new Date(order.startDate), "MMM d, yyyy")}
                                    </p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-sm font-medium">₹{order.totalAmount}</p>
                                        <p className="text-xs text-muted-foreground">Total</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">Details</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
