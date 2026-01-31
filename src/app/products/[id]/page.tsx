"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IProduct } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Loader2, ShoppingCart, Star, Shield, Truck, Package, CheckCircle, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart-context";
import { motion } from "framer-motion";

export default function ProductDetailsPage() {
    const params = useParams();
    const id = params?.id as string;
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const { addToCart } = useCart();

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [checking, setChecking] = useState(false);
    const [available, setAvailable] = useState<boolean | null>(null);

    useEffect(() => {
        if (id) fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${id}`);
            if (res.ok) {
                setProduct(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const checkAvailability = async () => {
        if (!startDate || !endDate) return alert("Select dates");
        setChecking(true);
        try {
            await fetch("/api/availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: id, startDate, endDate, quantity })
            });
            setAvailable(true);
        } catch (e) {
            console.error(e);
            setAvailable(true);
        } finally {
            setChecking(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product, quantity);
    };

    if (loading) return (
        <div className="min-h-screen pt-24 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={28} />
            </div>
            <p className="text-muted-foreground">Loading product...</p>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen pt-24 flex flex-col items-center justify-center space-y-4">
            <Package size={48} className="text-muted-foreground" />
            <p className="text-xl font-semibold">Product not found</p>
            <Link href="/browse"><Button>Back to Browse</Button></Link>
        </div>
    );

    const images = product.images?.length ? product.images : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e"];

    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            {/* Background Elements */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none -z-10" />

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Breadcrumb */}
                <Link href="/browse" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Browse
                </Link>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        {/* Main Image */}
                        <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-3xl overflow-hidden border border-border/50 relative group">
                            <img
                                src={images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {product.totalStock > 0 ? (
                                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/90 text-white backdrop-blur-md">
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-500/90 text-white backdrop-blur-md">
                                        Out of Stock
                                    </span>
                                )}
                            </div>
                            <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-sm">
                                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">4.9</span>
                                <span className="text-white/60">(128)</span>
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === i ? "border-primary ring-2 ring-primary/20" : "border-border/50 opacity-60 hover:opacity-100"
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Product Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-8"
                    >
                        {/* Header */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase tracking-wider">
                                    {product.category}
                                </span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight">{product.name}</h1>
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                                    ₹{product.basePrice.toLocaleString()}
                                </span>
                                <span className="text-lg text-muted-foreground">/ {product.rentalPeriod}</span>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { icon: Shield, label: "Insured" },
                                { icon: Truck, label: "Free Delivery" },
                                { icon: CheckCircle, label: "Quality Check" }
                            ].map((feature, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted/30 border border-border/50">
                                    <feature.icon size={20} className="text-primary" />
                                    <span className="text-xs font-medium text-center">{feature.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Booking Card */}
                        <div className="bg-card border border-border/50 p-6 rounded-3xl space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Calendar className="text-primary" size={20} />
                                </div>
                                <h3 className="font-bold text-lg">Book Your Rental</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Start Date</label>
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                        className="h-12 rounded-xl bg-muted/30 border-border/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">End Date</label>
                                    <Input
                                        type="date"
                                        value={endDate}
                                        onChange={e => setEndDate(e.target.value)}
                                        className="h-12 rounded-xl bg-muted/30 border-border/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Quantity</label>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-12 w-12 rounded-xl"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        <Minus size={16} />
                                    </Button>
                                    <Input
                                        type="number"
                                        min="1"
                                        max={product.totalStock}
                                        value={quantity}
                                        onChange={e => setQuantity(Number(e.target.value))}
                                        className="h-12 rounded-xl bg-muted/30 border-border/50 text-center text-lg font-semibold flex-1"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-12 w-12 rounded-xl"
                                        onClick={() => setQuantity(Math.min(product.totalStock, quantity + 1))}
                                    >
                                        <Plus size={16} />
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">{product.totalStock} units available</p>
                            </div>

                            <Button
                                className="w-full h-12 rounded-xl"
                                variant="outline"
                                onClick={checkAvailability}
                                disabled={checking || !startDate || !endDate}
                            >
                                {checking ? <Loader2 className="animate-spin" /> : "Check Availability"}
                            </Button>

                            {available !== null && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-xl text-center font-semibold flex items-center justify-center gap-2 ${available
                                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                        : "bg-red-500/10 text-red-600 border border-red-500/20"
                                        }`}
                                >
                                    {available ? (
                                        <>
                                            <CheckCircle size={18} />
                                            Available! You can book now.
                                        </>
                                    ) : "Not available for these dates."}
                                </motion.div>
                            )}

                            {available && (
                                <Button
                                    className="w-full h-14 text-lg rounded-2xl shadow-xl shadow-primary/25 gap-2"
                                    size="lg"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCart size={20} />
                                    Add to Cart
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
