import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvoice extends Document {
    invoiceNumber: string;
    orderId: mongoose.Types.ObjectId;
    vendorId: mongoose.Types.ObjectId;
    customerId: mongoose.Types.ObjectId;
    amount: number;
    status: "paid" | "pending";
    issuedAt: Date;
    dueDate: Date;
    items: {
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }[];
}

const InvoiceSchema: Schema<IInvoice> = new Schema(
    {
        invoiceNumber: { type: String, required: true, unique: true },
        orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
        vendorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true },
        status: { type: String, enum: ["paid", "pending"], default: "pending" },
        issuedAt: { type: Date, default: Date.now },
        dueDate: { type: Date, required: true },
        items: [{
            description: String,
            quantity: Number,
            unitPrice: Number,
            total: Number
        }]
    },
    { timestamps: true }
);

const Invoice: Model<IInvoice> =
    (mongoose.models.Invoice as Model<IInvoice>) ||
    mongoose.model<IInvoice>("Invoice", InvoiceSchema);

export default Invoice;
