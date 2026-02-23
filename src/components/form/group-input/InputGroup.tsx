import React from 'react';
import Label from '../Label';
import Input from '../input/InputField';

interface InputGroupProps {
    label?: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    className?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({
    label,
    name,
    value,
    onChange,
    type = 'text',
    placeholder,
    required = false,
    disabled = false,
    error,
    icon,
    iconPosition = 'left',
    className = '',
}) => {
    const inputId = `input-${name}`;

    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <Label htmlFor={inputId}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
            )}
            <div className="relative">
                {icon && iconPosition === 'left' && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        {icon}
                    </span>
                )}
                <Input
                    id={inputId}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={`
                        ${icon && iconPosition === 'left' ? 'pl-[62px]' : ''}
                        ${icon && iconPosition === 'right' ? 'pr-[62px]' : ''}
                        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                    `}
                />
                {icon && iconPosition === 'right' && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 border-l border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        {icon}
                    </span>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

export default InputGroup;