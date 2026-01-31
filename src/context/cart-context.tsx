"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { IProduct } from "@/types";

export interface CartItem extends IProduct {
    quantity: number;
    rentalDays: number;
    startDate?: string;
    endDate?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: IProduct, quantity?: number, startDate?: string, endDate?: string) => void;
    removeFromCart: (productId: string, startDate?: string, endDate?: string) => void;
    updateQuantity: (productId: string, quantity: number, startDate?: string, endDate?: string) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
    openCart: () => void;
    closeCart: () => void;
    isCartOpen: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem("smartrent_cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (error) {
                console.error("Failed to parse cart", error);
            }
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("smartrent_cart", JSON.stringify(items));
        }
    }, [items, isMounted]);

    const addToCart = (product: IProduct, quantity: number = 1, startDate?: string, endDate?: string) => {
        setItems((prev) => {
            const existing = prev.find((item) =>
                item._id === product._id &&
                item.startDate === startDate &&
                item.endDate === endDate
            );

            if (existing) {
                return prev.map((item) =>
                    (item._id === product._id && item.startDate === startDate && item.endDate === endDate)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity, rentalDays: 1, startDate, endDate }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: string, startDate?: string, endDate?: string) => {
        setItems((prev) => prev.filter((item) => !(item._id === productId && item.startDate === startDate && item.endDate === endDate)));
    };

    const updateQuantity = (productId: string, quantity: number, startDate?: string, endDate?: string) => {
        if (quantity < 1) return;
        setItems((prev) =>
            prev.map((item) =>
                (item._id === productId && item.startDate === startDate && item.endDate === endDate)
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const cartTotal = items.reduce(
        (total, item) => total + (item.basePrice * item.quantity),
        0
    );

    const cartCount = items.reduce((count, item) => count + item.quantity, 0);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
                openCart,
                closeCart,
                isCartOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
