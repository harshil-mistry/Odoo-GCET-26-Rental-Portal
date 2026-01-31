export interface IProduct {
    _id: string;
    name: string;
    category: string;
    basePrice: number;
    rentalPeriod: "hourly" | "daily" | "weekly";
    totalStock: number;
    isRentable: boolean;
    images: string[];
    createdAt: string;
    updatedAt: string;
}

export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: "customer" | "vendor" | "admin";
}
