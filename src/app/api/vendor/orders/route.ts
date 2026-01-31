import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token) as any;
        if (!decoded || decoded.role !== "vendor") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        // 1. Find all products owned by this vendor
        const myProducts = await Product.find({ vendorId: decoded.userId }).select("_id");
        const myProductIds = myProducts.map(p => p._id);

        let orders;

        if (myProductIds.length === 0) {
            // Fallback: If vendor has no products with vendorId set (legacy data),
            // check if there are ANY products without vendorId and assign them to this vendor
            // OR just show all orders for now as a temporary measure

            // For MVP, let's show all orders if vendor has no assigned products
            // This helps during development/testing
            const unassignedProducts = await Product.find({ vendorId: { $exists: false } });

            if (unassignedProducts.length > 0) {
                // Assign unassigned products to this vendor
                await Product.updateMany(
                    { vendorId: { $exists: false } },
                    { $set: { vendorId: decoded.userId } }
                );
                console.log(`Assigned ${unassignedProducts.length} products to vendor ${decoded.userId}`);

                // Now fetch orders with the newly assigned products
                const updatedProductIds = unassignedProducts.map(p => p._id);
                orders = await Order.find({
                    "items.productId": { $in: updatedProductIds }
                })
                    .sort({ createdAt: -1 })
                    .populate({
                        path: "items.productId",
                        model: Product,
                        select: "name images category vendorId"
                    })
                    .populate({
                        path: "customerId",
                        model: User,
                        select: "name email phone"
                    });
            } else {
                return NextResponse.json({ orders: [] }, { status: 200 });
            }
        } else {
            // 2. Find orders containing vendor's products
            orders = await Order.find({
                "items.productId": { $in: myProductIds }
            })
                .sort({ createdAt: -1 })
                .populate({
                    path: "items.productId",
                    model: Product,
                    select: "name images category vendorId"
                })
                .populate({
                    path: "customerId",
                    model: User,
                    select: "name email phone"
                });
        }

        return NextResponse.json({ orders }, { status: 200 });

    } catch (error: any) {
        console.error("Vendor Order fetch error:", error);
        return NextResponse.json({ message: error.message || "Error fetching orders" }, { status: 500 });
    }
}
