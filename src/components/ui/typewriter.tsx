"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Typewriter = ({
    words,
    className,
    cursorClassName,
}: {
    words: string[];
    className?: string;
    cursorClassName?: string;
}) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const word = words[currentWordIndex];

        // Typing speeds
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseBeforeDelete = 2000;

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (currentText.length < word.length) {
                    // Typing
                    setCurrentText(word.slice(0, currentText.length + 1));
                } else {
                    // Finished typing, wait before delete
                    setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
                }
            } else {
                if (currentText.length > 0) {
                    // Deleting
                    setCurrentText(word.slice(0, currentText.length - 1));
                } else {
                    // Finished deleting, move to next word
                    setIsDeleting(false);
                    setCurrentWordIndex((prev) => (prev + 1) % words.length);
                }
            }
        }, isDeleting ? deleteSpeed : typeSpeed);

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, currentWordIndex, words]);

    return (
        <span className={cn("inline-flex items-center", className)}>
            {currentText}
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className={cn("ml-1 h-12 w-[4px] rounded-full bg-primary", cursorClassName)}
            />
        </span>
    );
};
