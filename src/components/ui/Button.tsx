import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "whatsapp" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-rose-600 text-cream hover:bg-rose-700 shadow-[var(--shadow-soft)]",
  outline:
    "bg-transparent text-rose-700 border border-rose-400 hover:bg-blush-50",
  whatsapp:
    "bg-[#25D366] text-white hover:brightness-95 shadow-[var(--shadow-soft)]",
  ghost: "bg-transparent text-rose-700 hover:bg-blush-50",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-sm px-5 py-3",
  lg: "text-base px-7 py-3.5",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold
        transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
