import { ReactNode } from "react";
import Footer from "./Footer";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  showFooter?: boolean;
}

/**
 * Reusable page container component that provides consistent layout
 * across all pages with responsive design.
 */
export default function PageContainer({ children, className = "", showFooter = true }: PageContainerProps) {
  return (
    <div className={`flex flex-col max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 pb-24 ${className}`}>
      <div className="flex-grow">
        {children}
      </div>
      {showFooter ? <Footer /> : null}
    </div>
  );
}
