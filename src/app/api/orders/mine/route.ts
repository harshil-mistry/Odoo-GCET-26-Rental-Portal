import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Order from "@/models/Order";
import Product from "@/models/Product"; // Ensure Product model is registered

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded = verifyToken(token) as any;
        if (!decoded) {
            return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
        }

        // Fetch orders and populate items.productId to get names and images
        const orders = await Order.find({ customerId: decoded.userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "items.productId",
                model: Product,
                select: "name images category"
            });

        return NextResponse.json({ orders }, { status: 200 });

    } catch (error: any) {
        console.error("Order fetch error:", error);
        return NextResponse.json({ message: error.message || "Error fetching orders" }, { status: 500 });
    }
}
