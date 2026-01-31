"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onUpload = (result: any) => {
        // result.info contains secure_url
        onChange(result.info.secure_url);
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4 flex-wrap">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden bg-muted border border-border group">
                        <div className="z-10 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="sm" className="h-8 w-8 p-0">
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        {/* Using standard img for simplicity here, allows immediate rendering of external URLs too */}
                        <img className="object-cover w-full h-full" src={url} alt="Uploaded Image" />
                    </div>
                ))}
            </div>
            <CldUploadWidget
                onSuccess={onUpload}
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "smartrent_preset"}
            >
                {({ open }) => {
                    const onClick = () => {
                        open();
                    };

                    return (
                        <Button
                            type="button"
                            disabled={disabled}
                            variant="secondary"
                            onClick={onClick}
                            className="bg-muted hover:bg-muted/80 border border-dashed border-border h-32 w-full flex flex-col gap-2"
                        >
                            <ImagePlus className="h-8 w-8 text-muted-foreground" />
                            <span className="text-muted-foreground">Upload Images</span>
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
}

export default ImageUpload;
