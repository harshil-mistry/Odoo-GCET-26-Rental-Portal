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

        if (myProductIds.length === 0) {
            return NextResponse.json({ orders: [] }, { status: 200 });
        }

        // 2. Find orders containing any of these products
        const orders = await Order.find({
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

        // 3. Mark which items belong to this vendor?
        // The UI can filter showing only relevant items.

        return NextResponse.json({ orders }, { status: 200 });

    } catch (error: any) {
        console.error("Vendor Order fetch error:", error);
        return NextResponse.json({ message: error.message || "Error fetching status" }, { status: 500 });
    }
}
