import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

interface CTAButtonProps {
  to?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

export function CTAButton({
  to,
  children,
  variant = "primary",
  onClick,
  type = "button",
  className = "",
}: CTAButtonProps) {
  const baseClasses =
    "group inline-flex items-center px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-sm";
  
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105",
    secondary:
      "bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 hover:bg-white/20 hover:border-white/30",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      type={type}
      className={classes}
    >
      {content}
    </motion.button>
  );
}
