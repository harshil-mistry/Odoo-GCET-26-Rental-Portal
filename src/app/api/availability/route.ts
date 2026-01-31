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

        // Fetch all active orders containing this product
        // We do filtering in JS to handle both legacy (order-level dates) and new (item-level dates) logic
        const overlappingOrders = await Order.find({
            "items.productId": productId,
            status: { $in: activeStatues }
        });

        let reservedCount = 0;
        overlappingOrders.forEach((order: any) => {
            // Find the specific item in the order
            const item = order.items.find((i: any) => i.productId.toString() === productId);

            if (item) {
                // Use item-specific dates if available, otherwise fall back to order-level dates
                const itemStart = item.startDate ? new Date(item.startDate) : new Date(order.startDate);
                const itemEnd = item.endDate ? new Date(item.endDate) : new Date(order.endDate);

                // Check for date overlap
                // (StartA <= EndB) and (EndA >= StartB)
                if (itemStart <= end && itemEnd >= start) {
                    reservedCount += item.quantity;
                }
            }
        });

        const availableStock = product.totalStock - reservedCount;
        const isAvailable = availableStock >= quantity;

        return NextResponse.json({ available: isAvailable, reserved: reservedCount, total: product.totalStock }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error checking availability" }, { status: 500 });
    }
}
