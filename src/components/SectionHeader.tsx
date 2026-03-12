import { ReactNode } from "react";

interface SectionHeaderProps {
  children: ReactNode;
  className?: string;
}

/**
 * Reusable section header component with consistent styling
 */
export default function SectionHeader({ children, className = "" }: SectionHeaderProps) {
  return (
    <button className={`font-newsreader italic font-medium mt-10 border-b-2 w-max hover:border-yellow-500 ${className}`}>
      {children}
    </button>
  );
}

