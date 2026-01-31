"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import ImageUpload from "@/components/ui/image-upload";

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        basePrice: "",
        rentalPeriod: "daily",
        totalStock: "",
        images: [] as string[],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (url: string) => {
        setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
    }

    const handleImageRemove = (url: string) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((image) => image !== url) }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    basePrice: Number(formData.basePrice),
                    totalStock: Number(formData.totalStock),
                    // images is already an array in formData now
                }),
            });

            if (res.ok) {
                router.push("/vendor");
                router.refresh();
            } else {
                const err = await res.json();
                alert(err.message || "Something went wrong");
            }
        } catch (error) {
            console.error(error);
            alert("Error creating product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Link href="/vendor">
                    <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                        <ArrowLeft size={16} className="mr-2" /> Back
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-serif font-bold tracking-tight">Add New Product</h1>
                    <p className="text-sm text-muted-foreground">Detailed information about your rental item.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="md:col-span-2 space-y-6">
                    <div className="border border-border p-6 rounded-xl bg-card shadow-sm space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Product Name</label>
                                <Input
                                    name="name"
                                    placeholder="e.g. Sony A7 III Mirrorless Camera"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="h-11 bg-muted/30"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <Input
                                        name="category"
                                        placeholder="Category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className="h-11 bg-muted/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Rental Period</label>
                                    <div className="relative">
                                        <select
                                            name="rentalPeriod"
                                            value={formData.rentalPeriod}
                                            onChange={handleChange}
                                            className="flex h-11 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none"
                                        >
                                            <option value="hourly">Hourly Rate</option>
                                            <option value="daily">Daily Rate</option>
                                            <option value="weekly">Weekly Rate</option>
                                        </select>
                                        <div className="absolute right-3 top-3.5 pointer-events-none opacity-50">
                                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Price (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-muted-foreground">₹</span>
                                        <Input
                                            name="basePrice"
                                            type="number"
                                            min="0"
                                            placeholder="0.00"
                                            value={formData.basePrice}
                                            onChange={handleChange}
                                            required
                                            className="h-11 pl-7 bg-muted/30"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Total Stock</label>
                                    <Input
                                        name="totalStock"
                                        type="number"
                                        min="0"
                                        placeholder="Quantity available"
                                        value={formData.totalStock}
                                        onChange={handleChange}
                                        required
                                        className="h-11 bg-muted/30"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Product Images</label>
                                <ImageUpload
                                    value={formData.images}
                                    onChange={handleImageChange}
                                    onRemove={handleImageRemove}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Upload high-quality images of your gear.
                                </p>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <Link href="/vendor" className="flex-1">
                                    <Button type="button" variant="outline" className="w-full h-11">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" className="flex-1 h-11 shadow-lg shadow-primary/20" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Publish Product"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Preview / Tips Section */}
                <div className="space-y-6">
                    <div className="border border-border p-6 rounded-xl bg-muted/30">
                        <h3 className="font-semibold mb-2">Pro Tips</h3>
                        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                            <li>Use high-quality images to attract more renters.</li>
                            <li>Be specific with your product name (include model numbers).</li>
                            <li>Set competitive daily rates based on market value.</li>
                            <li>Ensure your stock count is accurate to avoid cancellations.</li>
                        </ul>
                    </div>

                    {formData.name && (
                        <div className="border border-border p-4 rounded-xl bg-card shadow-sm opacity-80 pointer-events-none grayscale-[0.2]">
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wide">Preview Card</p>
                            <div className="aspect-[4/3] bg-muted rounded-lg mb-3 overflow-hidden">
                                {formData.images[0] ? (
                                    <img src={formData.images[0]} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                                )}
                            </div>
                            <h4 className="font-semibold truncate">{formData.name}</h4>
                            <p className="text-sm text-muted-foreground">{formData.category || "Uncategorized"}</p>
                            <div className="mt-2 text-sm font-medium">₹{formData.basePrice || 0} / {formData.rentalPeriod}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
