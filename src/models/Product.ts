import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
    name: string;
    category: string;
    basePrice: number;
    rentalPeriod: "hourly" | "daily" | "weekly";
    totalStock: number;
    isRentable: boolean;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
    {
        name: { type: String, required: true },
        category: { type: String, required: true },
        basePrice: { type: Number, required: true, min: 0 },
        rentalPeriod: {
            type: String,
            enum: ["hourly", "daily", "weekly"],
            required: true,
            default: "daily",
        },
        totalStock: { type: Number, required: true, min: 0, default: 0 },
        isRentable: { type: Boolean, default: true },
        images: { type: [String], default: [] },
    },
    { timestamps: true }
);

const Product: Model<IProduct> =
    (mongoose.models.Product as Model<IProduct>) ||
    mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
