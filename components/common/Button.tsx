
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'text';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'filled',
  children,
  className,
  ...props
}) => {
  const baseClasses =
    'px-6 py-2.5 rounded-full font-medium text-sm tracking-wide transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center';

  const variantClasses = {
    filled: 'bg-primary text-on-primary hover:opacity-90',
    tonal: 'bg-secondary-container text-on-secondary-container hover:opacity-90',
    text: 'bg-transparent text-primary hover:bg-primary/10',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;