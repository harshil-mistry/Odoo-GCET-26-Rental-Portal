import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    priceAtBooking: number;
}

export interface IOrder extends Document {
    customerId: mongoose.Types.ObjectId;
    items: IOrderItem[];
    startDate: Date;
    endDate: Date;
    status: "quote" | "confirmed" | "pickedup" | "returned" | "cancelled";
    totalAmount: number;
    shippingAddress?: string;
    contactPhone?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema(
    {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        priceAtBooking: { type: Number, required: true, min: 0 },
    },
    { _id: false }
);

const OrderSchema: Schema<IOrder> = new Schema(
    {
        customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: [OrderItemSchema],
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        status: {
            type: String,
            enum: ["quote", "confirmed", "pickedup", "returned", "cancelled"],
            default: "quote",
        },
        totalAmount: { type: Number, required: true, default: 0 },
        shippingAddress: { type: String },
        contactPhone: { type: String },
        notes: { type: String },
    },
    { timestamps: true }
);

const Order: Model<IOrder> =
    (mongoose.models.Order as Model<IOrder>) ||
    mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
