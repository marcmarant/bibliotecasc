import React from 'react';

export function Spinner({ className = "" }: { className?: string }) {
    return (
        <div className={`flex justify-center items-center ${className}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );
}
