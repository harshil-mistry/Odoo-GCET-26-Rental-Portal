"use client";

import { useCart } from "@/context/cart-context";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartSheet() {
    const { isCartOpen, closeCart, items, updateQuantity, removeFromCart, cartTotal } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col h-full"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-serif font-bold flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                Your Cart
                            </h2>
                            <Button variant="ghost" size="sm" onClick={closeCart} className="h-8 w-8 p-0 rounded-full hover:bg-muted">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                        <ShoppingBag size={32} />
                                    </div>
                                    <p className="text-lg font-medium">Your cart is empty</p>
                                    <p className="text-sm text-muted-foreground max-w-xs">
                                        Looks like you haven't added any gear yet.
                                        Browse our collection to find what you need.
                                    </p>
                                    <Button variant="outline" onClick={closeCart}>
                                        Continue Shopping
                                    </Button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item._id} className="flex gap-4 group">
                                        <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0 border border-border">
                                            {item.images && item.images[0] ? (
                                                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Img</div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-medium line-clamp-1">{item.name}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    ₹{item.basePrice} / {item.rentalPeriod}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border border-input rounded-md h-8">
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                        className="px-2 hover:bg-muted h-full flex items-center justify-center disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                        className="px-2 hover:bg-muted h-full flex items-center justify-center"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item._id)}
                                                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-border bg-muted/10 space-y-4">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-medium">₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Service Fee</span>
                                        <span className="font-medium">₹0</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-border/50 mt-2">
                                        <span>Total</span>
                                        <span>₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                                <Link href="/checkout" onClick={closeCart} className="block w-full">
                                    <Button size="lg" className="w-full text-base shadow-lg shadow-primary/20">
                                        Proceed to Checkout
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
