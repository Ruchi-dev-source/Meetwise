import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/10 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5",
  secondary: "bg-white text-black hover:bg-transparent hover:text-white border border-white hover:-translate-y-0.5",
  ghost: "bg-surface-card border border-white/10 text-white hover:bg-white/10 hover:border-white/20",
  outline: "bg-transparent border border-white/15 text-white hover:border-primary/50 hover:bg-primary/5",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};

const shared =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-300 ease-out whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] active:duration-150";

type NativeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;
type NativeAnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className" | "href">;

interface ButtonAsButtonProps extends BaseProps, NativeButtonProps {
  href?: undefined;
}

interface ButtonAsLinkProps extends BaseProps, NativeAnchorProps {
  href: string;
  external?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  className,
  children,
  ...props
}: ButtonAsButtonProps | ButtonAsLinkProps) {
  const classes = cn(shared, variantClasses[variant], sizeClasses[size], className);
  const content = (
    <>
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </>
  );

  if ("href" in props && props.href) {
    const { href, external, ...rest } = props as ButtonAsLinkProps;
    if (external || href.startsWith("http")) {
      return (
        <a href={href} className={classes} target="_blank" rel="noreferrer" {...rest}>
          {content}
        </a>
      );
    }
    return (
      <Link to={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as NativeButtonProps)}>
      {content}
    </button>
  );
}
