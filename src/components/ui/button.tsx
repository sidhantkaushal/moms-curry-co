import Link from "next/link";
import type { ComponentProps } from "react";

const base =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-forest text-ivory hover:bg-forest/90",
    secondary: "bg-terracotta text-ivory hover:bg-terracotta/90",
    ghost: "text-forest hover:bg-forest/5",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      type={props.type ?? "button"}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function ButtonLink({ variant = "primary", className = "", ...props }: ButtonLinkProps) {
  const variants = {
    primary: "bg-forest text-ivory hover:bg-forest/90",
    secondary: "bg-terracotta text-ivory hover:bg-terracotta/90",
    ghost: "text-forest hover:bg-forest/5",
  };
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
