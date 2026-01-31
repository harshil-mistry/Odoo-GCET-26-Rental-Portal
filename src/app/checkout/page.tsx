"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Form State
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
                        price: item.basePrice
                    })),
                    totalAmount: cartTotal,
                    shippingDetails: formData
                })
            });

            if (res.ok) {
                setSuccess(true);
                clearCart();
                // Redirect after a few seconds? or show success screen here.
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
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={40} className="text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold">Your cart is empty</h1>
                <p className="text-muted-foreground max-w-md">
                    You need to add some gear before you can checkout.
                </p>
                <Link href="/browse">
                    <Button>Browse Gear</Button>
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={48} />
                </div>
                <h1 className="text-4xl font-serif font-bold">Order Placed!</h1>
                <p className="text-muted-foreground max-w-lg text-lg">
                    Thank you for your order. We have sent a confirmation to your email.
                    Our team will contact you shortly to coordinate the pickup/delivery.
                </p>
                <div className="flex gap-4">
                    <Link href="/browse">
                        <Button variant="outline">Back to Browse</Button>
                    </Link>
                    <Link href="/dashboard"> {/* Assuming user dashboard exists, otherwise home */}
                        <Button>View My Orders</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Order Summary (Left/Top) */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Shipping Info */}
                        <div className="bg-card border border-border p-6 rounded-xl space-y-6">
                            <h2 className="text-xl font-semibold">Contact & Shipping</h2>
                            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone Number</label>
                                    <Input
                                        name="phone"
                                        required
                                        placeholder="+91 98765 43210"
                                        value={formData.phone}
                                        onChange={handleChange}
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
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Notes (Optional)</label>
                                    <Input
                                        name="notes"
                                        placeholder="Gate code, preferred time, etc."
                                        value={formData.notes}
                                        onChange={handleChange}
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Payment Method (Mock) */}
                        <div className="bg-card border border-border p-6 rounded-xl space-y-4">
                            <h2 className="text-xl font-semibold">Payment Method</h2>
                            <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full bg-primary" />
                                <span className="font-medium">Pay on Delivery / Pickup</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Currently we only support payment upon receiving the equipment.
                                Online payments coming soon.
                            </p>
                        </div>
                    </div>

                    {/* Order Total (Sidebar) */}
                    <div className="space-y-6">
                        <div className="bg-muted/30 border border-border p-6 rounded-xl space-y-4 sticky top-24">
                            <h3 className="font-semibold text-lg">Order Summary</h3>
                            <div className="space-y-3">
                                {items.map((item) => (
                                    <div key={item._id} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {item.quantity}x {item.name}
                                        </span>
                                        <span>₹{item.basePrice * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-border pt-4 space-y-2">
                                <div className="flex justify-between font-medium">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground text-sm">
                                    <span>Taxes (est.)</span>
                                    <span>₹0</span>
                                </div>
                            </div>
                            <div className="border-t border-border pt-4 pb-4">
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                form="checkout-form"
                                className="w-full h-12 text-lg shadow-lg shadow-primary/20"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Place Order"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
