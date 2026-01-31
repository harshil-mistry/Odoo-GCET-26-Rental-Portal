import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";

// Helper to get user from token
const getUser = (req: NextRequest) => {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;
    return verifyToken(token);
};

export async function POST(req: NextRequest) {
    await connectDB();

    // 1. Authenticate
    const user = getUser(req);
    // For MVP, if not logged in, maybe allow guest checkout? 
    // But our schema requires customerId (User).
    // So we must enforce login.
    if (!user) {
        return NextResponse.json({ message: "Unauthorized. Please log in." }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { items, totalAmount, shippingDetails } = body; // shippingDetails: { phone, address, notes }

        if (!items || items.length === 0) {
            return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
        }

        // 2. Calculate Dates from Items
        let orderStartDate = new Date();
        let orderEndDate = new Date();

        // Find min start and max end
        if (items.length > 0 && items[0].startDate && items[0].endDate) {
            orderStartDate = new Date(items[0].startDate);
            orderEndDate = new Date(items[0].endDate);

            items.forEach((item: any) => {
                if (item.startDate) {
                    const s = new Date(item.startDate);
                    if (s < orderStartDate) orderStartDate = s;
                }
                if (item.endDate) {
                    const e = new Date(item.endDate);
                    if (e > orderEndDate) orderEndDate = e;
                }
            });
        } else {
            // Fallback if no dates provided (should not happen with new cart logic)
            orderStartDate.setDate(orderStartDate.getDate() + 1);
            orderEndDate.setDate(orderEndDate.getDate() + 1);
        }

        // 3. Create Order
        const newOrder = new Order({
            customerId: (user as any).userId,
            items: items.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
                priceAtBooking: item.price,
                startDate: item.startDate ? new Date(item.startDate) : orderStartDate,
                endDate: item.endDate ? new Date(item.endDate) : orderEndDate
            })),
            startDate: orderStartDate,
            endDate: orderEndDate,
            status: "quote",
            totalAmount,
            shippingAddress: shippingDetails?.address,
            contactPhone: shippingDetails?.phone,
            notes: shippingDetails?.notes
        });

        await newOrder.save();

        // Stock is managed via availability calculation, not decrementing totalStock.

        return NextResponse.json({ message: "Order placed successfully", orderId: newOrder._id }, { status: 201 });

    } catch (error: any) {
        console.error("Order error:", error);
        return NextResponse.json({ message: error.message || "Internal Error" }, { status: 500 });
    }
}
