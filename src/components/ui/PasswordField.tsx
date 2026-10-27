import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { TextField, type TextFieldProps } from './TextField';

export interface PasswordFieldProps extends Omit<TextFieldProps, 'type' | 'leftIcon' | 'rightElement'> {
  showToggle?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  showToggle = true,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      {...props}
      type={showPassword ? 'text' : 'password'}
      leftIcon={<Lock className="w-4 h-4 stroke-[2]" />}
      rightElement={
        showToggle ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="p-1.5 rounded-full text-slateText-muted hover:text-slateText-primary hover:bg-slate-200/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        ) : undefined
      }
    />
  );
};
