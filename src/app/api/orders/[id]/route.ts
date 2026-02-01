import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Invoice from "@/models/Invoice";

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

        // Automatic Invoice Generation on Confirmation
        if (status === "confirmed") {
            // Populate products to get vendor details
            const fullOrder = await Order.findById(id).populate({
                path: "items.productId",
                model: Product
            });

            if (fullOrder) {
                // Group items by vendor
                const vendorItems: Record<string, any[]> = {};

                fullOrder.items.forEach((item: any) => {
                    const product = item.productId;
                    if (product && product.vendorId) {
                        const vid = product.vendorId.toString();
                        if (!vendorItems[vid]) vendorItems[vid] = [];

                        vendorItems[vid].push({
                            description: `${product.name} (Rent)`,
                            quantity: item.quantity,
                            unitPrice: item.priceAtBooking,
                            total: item.priceAtBooking * item.quantity
                        });
                    }
                });

                // Generate Invoice for each vendor
                for (const [vendorId, items] of Object.entries(vendorItems)) {
                    // Check if invoice already exists
                    const exists = await Invoice.findOne({ orderId: id, vendorId });

                    if (!exists) {
                        const totalAmount = items.reduce((sum, i) => sum + i.total, 0);
                        const invoiceNumber = `INV-${new Date().getFullYear()}${Math.floor(Math.random() * 10000)}`;

                        await Invoice.create({
                            invoiceNumber,
                            orderId: id,
                            vendorId,
                            customerId: fullOrder.customerId,
                            amount: totalAmount,
                            status: "pending",
                            dueDate: fullOrder.startDate, // Due by rental start
                            items
                        });
                        console.log(`Generated invoice ${invoiceNumber} for vendor ${vendorId}`);
                    }
                }
            }
        }

        return NextResponse.json({ message: "Status updated", order }, { status: 200 });

    } catch (error: any) {
        console.error("Order status update error:", error);
        return NextResponse.json({ message: error.message || "Error updating order" }, { status: 500 });
    }
}
