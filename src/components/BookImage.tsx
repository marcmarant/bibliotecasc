'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { IoBook } from 'react-icons/io5';
import { cn } from '@/lib/utils';

interface BookImageProps extends Omit<ImageProps, 'src' | 'onError'> {
    src?: string | null;
    containerClassName?: string;
    showText?: boolean;
}

export const BookImage = ({
    src,
    alt,
    className,
    containerClassName,
    showText = true,
    ...props
}: BookImageProps) => {
    const [error, setError] = useState(false);

    // Check if src is valid (not null, not undefined, not empty)
    const isValidSrc = src && src !== 'NaN' && !src.includes('undefined') && !src.includes('null');

    if (error || !isValidSrc) {
        return (
            <div className={cn("flex flex-col items-center justify-center bg-muted text-muted-foreground w-full h-full", containerClassName)}>
                <IoBook className="w-1/3 h-1/3 min-w-[24px] min-h-[24px] max-w-[96px] max-h-[96px] mb-2 opacity-20" />
                {showText && (
                    <span className="text-[10px] sm:text-xs text-center px-1 break-words">Imagen no disponible</span>
                )}
            </div>
        );
    }

    return (
        <Image
            src={src!}
            alt={alt}
            className={cn("object-cover", className)}
            onError={() => setError(true)}
            {...props}
        />
    );
};
