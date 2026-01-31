"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, ShoppingBag, CreditCard, Truck, Package, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);

    const [formData, setFormData] = useState({
        phone: "",
        address: "",
        notes: ""
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map(item => ({
                        productId: item._id,
                        quantity: item.quantity,
                        price: item.basePrice,
                        startDate: item.startDate,
                        endDate: item.endDate
                    })),
                    totalAmount: cartTotal,
                    shippingDetails: formData
                })
            });

            if (res.ok) {
                setSuccess(true);
                clearCart();
            } else {
                alert("Failed to place order. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    if (items.length === 0 && !success) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-muted rounded-3xl flex items-center justify-center">
                    <ShoppingBag size={48} className="text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-serif font-bold">Your cart is empty</h1>
                    <p className="text-muted-foreground max-w-md">
                        You need to add some gear before you can checkout.
                    </p>
                </div>
                <Link href="/browse">
                    <Button size="lg" className="rounded-full px-8">Browse Gear</Button>
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center text-center space-y-8"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl scale-150" />
                    <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                        <CheckCircle2 size={56} />
                    </div>
                </div>
                <div className="space-y-3">
                    <h1 className="text-5xl font-serif font-bold">Order Placed!</h1>
                    <p className="text-lg text-muted-foreground max-w-lg">
                        Thank you for your order. We've sent a confirmation to your email.
                        Our team will contact you shortly to coordinate delivery.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link href="/browse">
                        <Button variant="outline" size="lg" className="rounded-full">Back to Browse</Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button size="lg" className="rounded-full shadow-lg shadow-primary/25">View My Orders</Button>
                    </Link>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            {/* Background Elements */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none -z-10" />

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Back Button */}
                <Link href="/browse" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft size={16} /> Continue Shopping
                </Link>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left Column - Forms */}
                    <div className="flex-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                        >
                            <h1 className="text-4xl font-serif font-bold">Checkout</h1>
                            <p className="text-muted-foreground">Complete your order details below.</p>
                        </motion.div>

                        {/* Progress Steps */}
                        <div className="flex items-center gap-4 text-sm">
                            {["Cart", "Details", "Confirm"].map((step, i) => (
                                <div key={step} className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 1 ? "bg-primary text-primary-foreground" : i < 1 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                                        }`}>
                                        {i + 1}
                                    </div>
                                    <span className={i === 1 ? "font-medium" : "text-muted-foreground"}>{step}</span>
                                    {i < 2 && <div className="w-8 h-px bg-border" />}
                                </div>
                            ))}
                        </div>

                        {/* Contact & Shipping */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-card border border-border/50 p-8 rounded-3xl space-y-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Truck className="text-primary" size={20} />
                                </div>
                                <h2 className="text-xl font-bold">Contact & Shipping</h2>
                            </div>

                            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone Number</label>
                                    <Input
                                        name="phone"
                                        required
                                        placeholder="+91 98765 43210"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="h-12 rounded-xl bg-muted/30 border-border/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Delivery Address</label>
                                    <Input
                                        name="address"
                                        required
                                        placeholder="Street address, City, Zip"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="h-12 rounded-xl bg-muted/30 border-border/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Notes <span className="text-muted-foreground">(Optional)</span></label>
                                    <Input
                                        name="notes"
                                        placeholder="Gate code, preferred time, etc."
                                        value={formData.notes}
                                        onChange={handleChange}
                                        className="h-12 rounded-xl bg-muted/30 border-border/50"
                                    />
                                </div>
                            </form>
                        </motion.div>

                        {/* Payment Method */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-card border border-border/50 p-8 rounded-3xl space-y-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <CreditCard className="text-blue-500" size={20} />
                                </div>
                                <h2 className="text-xl font-bold">Payment Method</h2>
                            </div>

                            <div className="p-5 border-2 border-primary/30 bg-primary/5 rounded-2xl flex items-center gap-4">
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                </div>
                                <div>
                                    <span className="font-semibold">Pay on Delivery / Pickup</span>
                                    <p className="text-sm text-muted-foreground">Pay when you receive the equipment</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                                <Shield size={18} className="text-muted-foreground mt-0.5" />
                                <p className="text-sm text-muted-foreground">
                                    Your payment information is secure. Online payments coming soon.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:w-[420px]"
                    >
                        <div className="sticky top-24 bg-gradient-to-b from-card to-card/80 border border-border/50 p-8 rounded-3xl space-y-6">
                            <h3 className="font-bold text-xl flex items-center gap-2">
                                <Package size={20} /> Order Summary
                            </h3>

                            <div className="space-y-4 max-h-64 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item._id} className="flex gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                                            {item.images?.[0] ? (
                                                <img src={item.images[0]} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package size={20} className="text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold">₹{(item.basePrice * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-border pt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Delivery</span>
                                    <span className="text-emerald-500">Free</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Taxes (est.)</span>
                                    <span>₹0</span>
                                </div>
                            </div>

                            <div className="border-t border-border pt-4">
                                <div className="flex justify-between items-baseline">
                                    <span className="font-medium">Total</span>
                                    <span className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                                        ₹{cartTotal.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                form="checkout-form"
                                className="w-full h-14 text-lg rounded-2xl shadow-xl shadow-primary/25"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Place Order"
                                )}
                            </Button>

                            <p className="text-xs text-center text-muted-foreground">
                                By placing this order, you agree to our Terms of Service
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
