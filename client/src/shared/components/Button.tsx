import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function Button({ variant = 'primary', children, className, ...rest }: ButtonProps) {
  return (
    <button className={['btn', `btn--${variant}`, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </button>
  );
}
