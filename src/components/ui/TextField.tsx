import React from 'react';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  id,
  error,
  helperText,
  leftIcon,
  rightElement,
  className = '',
  disabled,
  ...props
}) => {
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className="w-full space-y-1.5 text-left">
      <label
        htmlFor={id}
        className="block text-xs font-bold uppercase tracking-wider text-slateText-secondary"
      >
        {label}
      </label>

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slateText-muted">
            {leftIcon}
          </div>
        )}

        <input
          id={id}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`
            w-full py-3 text-sm text-slateText-primary placeholder-slateText-muted bg-brand-surface hover:bg-slate-100/80 focus:bg-surface rounded-full border transition-all duration-200 min-h-touch focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-11' : 'pl-5'}
            ${rightElement ? 'pr-12' : 'pr-5'}
            ${
              error
                ? 'border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
                : 'border-transparent focus:border-brand-300 focus:ring-4 focus:ring-brand-100'
            }
            ${className}
          `}
          {...props}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error ? (
        <p id={errorId} className="text-xs text-rose-500 font-medium pl-3 animate-fadeIn">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-slateText-muted pl-3">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
