"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        basePrice: "",
        rentalPeriod: "daily",
        totalStock: "",
        images: "",
    });

    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id]);

    const fetchProduct = async (productId: string) => {
        try {
            const res = await fetch(`/api/products/${productId}`);
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    name: data.name,
                    category: data.category,
                    basePrice: data.basePrice.toString(),
                    rentalPeriod: data.rentalPeriod,
                    totalStock: data.totalStock.toString(),
                    images: data.images.join(", "),
                });
            } else {
                alert("Product not found");
                router.push("/vendor");
            }
        } catch (error) {
            console.error(error);
            alert("Error fetching product");
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    basePrice: Number(formData.basePrice),
                    totalStock: Number(formData.totalStock),
                    images: formData.images.split(",").map((s) => s.trim()).filter(Boolean),
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
            alert("Error updating product");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-10 text-center">Loading product...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/vendor">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft size={16} className="mr-2" /> Back
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Edit Product</h1>
            </div>

            <div className="border border-border p-6 rounded-xl bg-card shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Product Name</label>
                        <Input
                            name="name"
                            placeholder="e.g. DSLR Camera Canon EOS 200D"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <Input
                                name="category"
                                placeholder="e.g. Electronics, Furniture"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Rental Period</label>
                            <select
                                name="rentalPeriod"
                                value={formData.rentalPeriod}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <option value="hourly">Hourly</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Price (₹)</label>
                            <Input
                                name="basePrice"
                                type="number"
                                min="0"
                                placeholder="0.00"
                                value={formData.basePrice}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Total Stock</label>
                            <Input
                                name="totalStock"
                                type="number"
                                min="0"
                                placeholder="10"
                                value={formData.totalStock}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Image URLs (comma separated)</label>
                        <Input
                            name="images"
                            placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                            value={formData.images}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating Product...
                                </>
                            ) : (
                                "Update Product"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
