import { Link } from "react-router-dom";

type BackButtonProps = {
  title: string;
  href: string;
};

/**
 * Reusable back button component that displays differently on desktop and mobile
 * Desktop: Fixed position on the left side
 * Mobile: Inline with the page content
 */
const BackButton: React.FC<BackButtonProps> = ({ title, href }) => {
  const backButtonContent = (
    <Link
      className="text-white p-2 mr-4 font-newsreader italic flex gap-2"
      to={href}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-undo-2"
      >
        <path d="M9 14 4 9l5-5" />
        <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" />
      </svg>
      {title}
    </Link>
  );

  return (
    <>
      {/* Desktop: Fixed position (lg and above) */}
      <div className="px-10 hidden lg:block fixed">
        {backButtonContent}
      </div>
      {/* Mobile and Medium: Inline */}
      <div className="lg:hidden translate-x-[-20px] translate-y-[-30px] ml-6">
        {backButtonContent}
      </div>
    </>
  );
};

export default BackButton;