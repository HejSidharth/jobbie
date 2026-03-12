"use client";

import type { ReactNode } from "react";
import { motion, useAnimation, type Variants } from "framer-motion";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1];

interface HeroBadgeProps {
  href?: string;
  text: string;
  icon?: ReactNode;
  endIcon?: ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

const badgeVariants: Record<string, string> = {
  default: "bg-background hover:bg-muted",
  outline: "border-2 hover:bg-muted",
  ghost: "hover:bg-muted/50",
};

const sizeVariants: Record<string, string> = {
  sm: "gap-1.5 px-3 py-1 text-xs",
  md: "gap-2 px-4 py-1.5 text-sm",
  lg: "gap-2.5 px-5 py-2 text-base",
};

const iconAnimationVariants: Variants = {
  initial: { rotate: 0 },
  hover: { rotate: -10 },
};

type BadgeContentProps = Pick<
  HeroBadgeProps,
  "text" | "icon" | "endIcon" | "variant" | "size" | "className"
> & {
  interactive?: boolean;
};

function BadgeContent({
  text,
  icon,
  endIcon,
  variant = "default",
  size = "md",
  className,
  interactive = false,
}: BadgeContentProps) {
  const controls = useAnimation();

  const baseClassName = cn(
    "inline-flex items-center rounded-full border transition-colors",
    badgeVariants[variant],
    sizeVariants[size],
    className,
  );

  return (
    <motion.div
      className={cn(baseClassName, interactive && "group")}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease }}
      onHoverStart={() => controls.start("hover")}
      onHoverEnd={() => controls.start("initial")}
    >
      {icon ? (
        <motion.div
          className="text-foreground/60 transition-colors group-hover:text-primary"
          variants={iconAnimationVariants}
          initial="initial"
          animate={controls}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          {icon}
        </motion.div>
      ) : null}
      <span>{text}</span>
      {endIcon ? <motion.div className="text-foreground/60">{endIcon}</motion.div> : null}
    </motion.div>
  );
}

export default function HeroBadge({
  href,
  text,
  icon,
  endIcon,
  variant = "default",
  size = "md",
  className,
  onClick,
}: HeroBadgeProps) {
  if (href) {
    return (
      <Link to={href} className="inline-flex cursor-pointer">
        <BadgeContent
          text={text}
          icon={icon}
          endIcon={endIcon}
          variant={variant}
          size={size}
          className={className}
          interactive
        />
      </Link>
    );
  }

  return (
    <motion.button type="button" onClick={onClick} className="inline-flex">
      <BadgeContent
        text={text}
        icon={icon}
        endIcon={endIcon}
        variant={variant}
        size={size}
        className={className}
        interactive
      />
    </motion.button>
  );
}
