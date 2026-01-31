import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { IOrder } from "@/models/Order";

export async function POST(req: Request) {
    try {
        const { productId, startDate, endDate, quantity } = await req.json();
        await connectDB();

        const product = await Product.findById(productId);
        if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });

        const start = new Date(startDate);
        const end = new Date(endDate);

        // CRITICAL: Overlapping Date Logic
        // Find all *active* orders for this product that overlap with the requested range
        // Overlap condition: (OrderStart <= RequestedEnd) AND (OrderEnd >= RequestedStart)
        const activeStatues = ["confirmed", "pickedup"]; // returned/cancelled don't count

        const overlappingOrders = await Order.find({
            "items.productId": productId,
            status: { $in: activeStatues },
            startDate: { $lte: end },
            endDate: { $gte: start }
        });

        let reservedCount = 0;
        overlappingOrders.forEach((order: any) => {
            const item = order.items.find((i: any) => i.productId.toString() === productId);
            if (item) reservedCount += item.quantity;
        });

        const availableStock = product.totalStock - reservedCount;
        const isAvailable = availableStock >= quantity;

        return NextResponse.json({ available: isAvailable, reserved: reservedCount, total: product.totalStock }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error checking availability" }, { status: 500 });
    }
}
