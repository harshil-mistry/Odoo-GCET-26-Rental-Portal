import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Helper to get user from token
const getUser = (req: NextRequest) => {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET) as any;
    } catch (e) {
        return null;
    }
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

        // 2. Default Dates (Mocking 1 day rental starting tomorrow if not provided)
        // In a real app we would get these from the body request
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 1); // Tomorrow
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1); // +1 Day

        // 3. Create Order
        const newOrder = new Order({
            customerId: user.id, // from token payload
            items: items.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
                priceAtBooking: item.price
            })),
            startDate,
            endDate,
            status: "quote", // Default to quote or confirmed? Let's say "confirmed" for checkout.
            totalAmount,
            shippingAddress: shippingDetails?.address,
            contactPhone: shippingDetails?.phone,
            notes: shippingDetails?.notes
        });

        await newOrder.save();

        // 4. Update Stock
        // This should ideally be a transaction
        for (const item of items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { totalStock: -item.quantity }
            });
        }

        return NextResponse.json({ message: "Order placed successfully", orderId: newOrder._id }, { status: 201 });

    } catch (error: any) {
        console.error("Order error:", error);
        return NextResponse.json({ message: error.message || "Internal Error" }, { status: 500 });
    }
}
