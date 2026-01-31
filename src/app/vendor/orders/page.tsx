"use client";

import { useEffect, useState } from "react";
import { Loader2, Package, CheckCircle, Truck, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function VendorOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/vendor/orders");
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
            case "confirmed": return { label: "Confirmed", icon: CheckCircle, color: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400" };
            case "pickedup": return { label: "Picked Up", icon: Truck, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" };
            case "returned": return { label: "Returned", icon: CheckCircle, color: "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400" };
            case "cancelled": return { label: "Cancelled", icon: XCircle, color: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400" };
            default: return { label: "Quote", icon: Clock, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400" };
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
            } else {
                alert("Failed to update status");
            }
        } catch (e) {
            console.error(e);
            alert("Error updating status");
        }
    };

    if (loading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin" /></div>;

    // Stats
    const pendingPickups = orders.filter(o => o.status === 'confirmed').length;
    const activeRentals = orders.filter(o => o.status === 'pickedup').length;
    const completedOrders = orders.filter(o => o.status === 'returned').length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-serif font-bold tracking-tight">Orders</h1>
                <p className="text-muted-foreground">Manage bookings for your products.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border border-border p-6 rounded-2xl">
                    <p className="text-sm font-medium text-muted-foreground">Pending Pickups</p>
                    <h3 className="text-3xl font-bold mt-1 text-amber-600">{pendingPickups}</h3>
                </div>
                <div className="bg-card border border-border p-6 rounded-2xl">
                    <p className="text-sm font-medium text-muted-foreground">Active Rentals</p>
                    <h3 className="text-3xl font-bold mt-1 text-blue-600">{activeRentals}</h3>
                </div>
                <div className="bg-card border border-border p-6 rounded-2xl">
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <h3 className="text-3xl font-bold mt-1 text-green-600">{completedOrders}</h3>
                </div>
            </div>

            {/* Order List */}
            {orders.length === 0 ? (
                <div className="border-2 border-dashed border-border rounded-xl p-16 text-center bg-muted/30">
                    <Package size={48} className="mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                    <p className="text-muted-foreground">When customers book your products, orders will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const statusConfig = getStatusConfig(order.status);
                        const StatusIcon = statusConfig.icon;
                        return (
                            <div key={order._id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                {/* Header */}
                                <div className="bg-muted/30 px-6 py-4 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-border">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${statusConfig.color}`}>
                                            <StatusIcon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Order</p>
                                            <p className="font-mono text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Customer</p>
                                            <p className="font-medium">{order.customerId?.name || "Guest"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Contact</p>
                                            <p className="font-medium">{order.contactPhone || order.customerId?.email || "N/A"}</p>
                                        </div>
                                        <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${statusConfig.color}`}>
                                            {statusConfig.label}
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="p-6 space-y-4">
                                    {order.items.map((item: any, i: number) => (
                                        <div key={i} className="flex gap-4 items-center">
                                            <div className="w-14 h-14 bg-muted rounded-lg overflow-hidden flex-shrink-0 border border-border">
                                                {item.productId?.images?.[0] ? (
                                                    <img src={item.productId.images[0]} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center"><Package size={20} className="opacity-50" /></div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold">{item.productId?.name || "Product"}</h4>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity} × ₹{item.priceAtBooking}</p>
                                            </div>
                                            <div className="font-medium">₹{(item.priceAtBooking * item.quantity).toLocaleString()}</div>
                                        </div>
                                    ))}

                                    <div className="mt-4 pt-4 border-t border-border flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex gap-6 text-sm">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Rental Period</p>
                                                <p className="font-medium">
                                                    {format(new Date(order.startDate), "MMM d")} - {format(new Date(order.endDate), "MMM d, yyyy")}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Shipping Address</p>
                                                <p className="font-medium max-w-xs truncate">{order.shippingAddress || "N/A"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {order.status === "quote" && (
                                                <Button size="sm" onClick={() => updateOrderStatus(order._id, "confirmed")}>
                                                    Confirm Order
                                                </Button>
                                            )}
                                            {order.status === "confirmed" && (
                                                <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order._id, "pickedup")}>
                                                    Mark as Picked Up
                                                </Button>
                                            )}
                                            {order.status === "pickedup" && (
                                                <Button size="sm" variant="secondary" onClick={() => updateOrderStatus(order._id, "returned")}>
                                                    Mark as Returned
                                                </Button>
                                            )}
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">Order Total</p>
                                                <p className="text-xl font-bold text-primary">₹{order.totalAmount?.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
