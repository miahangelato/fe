import React from 'react';
import { Button as UIButton } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Map our custom variants to shadcn variants
const variantMapping: Record<string, "default" | "outline" | "destructive" | "ghost" | "link" | "secondary"> = {
  primary: "default",
  secondary: "outline",
  danger: "destructive",
  ghost: "ghost",
  link: "link",
};

// Map our custom sizes to shadcn sizes
const sizeMapping: Record<string, "default" | "sm" | "lg" | "icon"> = {
  sm: "sm",
  md: "default",
  lg: "lg",
};

export interface NavigationButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  direction?: 'prev' | 'next' | 'none';
  loading?: boolean;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export function NavigationButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  direction = 'none',
  loading = false,
  iconPosition = 'left',
  disabled,
  ...props
}: NavigationButtonProps) {
  // Determine icon based on direction
  const getIcon = () => {
    if (loading) return <Loader2 className="animate-spin" />;
    if (direction === 'prev') return <ArrowLeft />;
    if (direction === 'next') return <ArrowRight />;
    return null;
  };

  const icon = getIcon();

  // Set icon sizes based on button size
  const getIconClasses = () => {
    switch(size) {
      case 'sm': return 'h-4 w-4';
      case 'lg': return 'h-5 w-5';
      default: return 'h-4 w-4';
    }
  };

  // Use Shadcn's built-in variants via our mapping
  const shadcnVariant = variantMapping[variant] || "default";
  const shadcnSize = sizeMapping[size] || "default";
    
  return (
    <UIButton
      variant={shadcnVariant}
      size={shadcnSize}
      className={cn(
        // Add rounded-full for small buttons only
        size === 'sm' ? 'rounded-full' : '',
        // Additional padding for md/lg buttons to match your design
        size === 'md' ? 'px-6 py-1.5' : size === 'lg' ? 'px-6 py-2' : '',
        // Add gap for icons
        icon ? "gap-2" : "",
        // Handle full width
        fullWidth ? "w-full" : "",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className={getIconClasses()}>
          {icon}
        </span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && (
        <span className={getIconClasses()}>
          {icon}
        </span>
      )}
    </UIButton>
  );
}

// Compose a Back Button
export function BackButton({
  children = "Back",
  variant = "secondary",
  size = "md",
  ...props
}: Omit<NavigationButtonProps, 'direction'> & { children?: React.ReactNode }) {
  return (
    <NavigationButton
      direction="prev"
      variant={variant}
      iconPosition="left"
      size={size}
      {...props}
    >
      {children}
    </NavigationButton>
  );
}

// Compose a Next Button
export function NextButton({
  children = "Next",
  variant = "primary",
  size = "md",
  ...props
}: Omit<NavigationButtonProps, 'direction'> & { children?: React.ReactNode }) {
  return (
    <NavigationButton
      direction="next"
      variant={variant}
      iconPosition="right"
      size={size}
      {...props}
    >
      {children}
    </NavigationButton>
  );
}

export default NavigationButton;