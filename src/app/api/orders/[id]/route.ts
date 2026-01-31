import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Order from "@/models/Order";

// PATCH: Update order status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token) as any;
        if (!decoded || (decoded.role !== "vendor" && decoded.role !== "admin")) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        const { status } = await req.json();

        const validStatuses = ["quote", "confirmed", "pickedup", "returned", "cancelled"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ message: "Invalid status" }, { status: 400 });
        }

        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Status updated", order }, { status: 200 });

    } catch (error: any) {
        console.error("Order status update error:", error);
        return NextResponse.json({ message: error.message || "Error updating order" }, { status: 500 });
    }
}
