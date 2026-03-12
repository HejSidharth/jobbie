import { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SocialLinkProps {
  icon: LucideIcon;
  href: string;
  label: string;
  iconClassName?: string;
}

/**
 * Reusable social link component with tooltip
 */
export default function SocialLink({
  icon: Icon,
  href,
  label,
  iconClassName = "",
}: SocialLinkProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
          >
            <Icon className={iconClassName} />
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

