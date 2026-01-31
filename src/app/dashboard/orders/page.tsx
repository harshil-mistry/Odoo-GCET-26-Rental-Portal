"use client";

import { useEffect, useState } from "react";
import { Loader2, Package } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "quote": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "cancelled": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    if (loading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-serif font-bold tracking-tight">My Rentals</h2>
                <p className="text-muted-foreground">Manage your past and upcoming equipment rentals.</p>
            </div>

            {orders.length === 0 ? (
                <div className="border-2 border-dashed border-border rounded-xl p-20 text-center flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <Package size={32} className="opacity-50" />
                    </div>
                    <h3 className="text-xl font-semibold">No orders yet</h3>
                    <p className="text-muted-foreground max-w-sm">
                        Start your creative journey by renting premium gear from us.
                    </p>
                    <Link href="/browse"><Button>Browse Catalog</Button></Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">

                            {/* Header */}
                            <div className="bg-muted/30 px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border">
                                <div className="flex items-center gap-4">
                                    <div className="bg-background border border-border p-2 rounded-md">
                                        <Package size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Order ID</p>
                                        <p className="font-mono text-sm leading-none mt-1">#{order._id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Order Placed</p>
                                        <p className="text-sm leading-none mt-1">{format(new Date(order.createdAt), "MMM d, yyyy")}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="space-y-6">
                                    {order.items.map((item: any, i: number) => (
                                        <div key={i} className="flex gap-4 items-center">
                                            <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0 border border-border">
                                                {item.productId?.images?.[0] ? (
                                                    <img src={item.productId.images[0]} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs">No Img</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold">{item.productId?.name || "Unknown Product"}</h4>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity} × ₹{item.priceAtBooking?.toLocaleString()}</p>
                                            </div>
                                            <div className="font-medium">
                                                ₹{(item.priceAtBooking * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-6 border-t border-border flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">Rental Period</p>
                                        <p className="text-sm font-semibold">
                                            {format(new Date(order.startDate), "MMM d")} - {format(new Date(order.endDate), "MMM d, yyyy")}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-muted-foreground">Total Amount</p>
                                        <p className="text-xl font-bold text-primary">₹{order.totalAmount?.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
