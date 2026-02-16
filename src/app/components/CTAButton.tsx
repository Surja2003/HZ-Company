import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface CTAButtonProps {
  to?: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void | Promise<void>;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}

export function CTAButton({
  to,
  children,
  variant = "primary",
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: CTAButtonProps) {
  const baseClasses =
    "group inline-flex items-center px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-sm";
  
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105",
    secondary:
      "bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 hover:bg-white/20 hover:border-white/30",
  };

  const disabledClasses = disabled ? "opacity-70 cursor-not-allowed pointer-events-none" : "";
  const classes = `${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`;

  const content = (
    <>
      {children}
      <ArrowRight
        size={18}
        className="ml-2 group-hover:translate-x-1 transition-transform"
      />
    </>
  );

  if (to) {
    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
        <Link to={to} className={classes}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.05 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      onClick={onClick}
      type={type}
      className={classes}
      disabled={disabled}
    >
      {content}
    </motion.button>
  );
}
