// components/atoms/InputText.tsx
import React from "react";

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
    fullWidth?: boolean;
}

export default function InputText({ fullWidth = false, ...rest }: InputTextProps) {
    return (
        <input
            className={`border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none ${fullWidth ? "w-full" : "auto"
                }`}
            {...rest}
        />
    );
}
