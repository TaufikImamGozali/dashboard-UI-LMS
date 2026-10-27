import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 select-none focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] min-h-[44px]';

  const variantStyles = {
    primary:
      'bg-brand-500 hover:bg-brand-600 text-white shadow-purple-glow hover:shadow-card',
    outline:
      'bg-white hover:bg-brand-surface text-slateText-primary border border-slate-200 hover:border-brand-200 shadow-2xs',
    ghost:
      'bg-transparent hover:bg-brand-50 text-brand-500 hover:text-brand-600',
  };

  const sizeStyles = {
    sm: 'text-xs px-4 py-2 gap-2 min-h-[38px]',
    md: 'text-sm px-6 py-2.5 gap-2.5 min-h-[44px]',
    lg: 'text-base px-8 py-3.5 gap-3 min-h-[50px]',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
