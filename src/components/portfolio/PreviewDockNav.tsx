import { Accessibility, Github, Home, Linkedin, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dock, DockIcon } from "@/components/ui/dock";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAccessibility } from "@/context/AccessibilityContext";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import type { PortfolioSite, PreviewRoute } from "@/types/portfolio";

export function PreviewDockNav({
  portfolio,
  onNavigate,
  className,
}: {
  portfolio: PortfolioSite;
  route: PreviewRoute;
  onNavigate: (route: PreviewRoute) => void;
  className?: string;
}) {
  const { setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("dark");
  const {
    fontSize,
    contrast,
    increaseFontSize,
    decreaseFontSize,
    toggleContrast,
    resetAccessibility,
  } = useAccessibility();

  useEffect(() => {
    const syncTheme = () => {
      setCurrentTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    };
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn("z-50 flex justify-center pointer-events-none", className)}>
      <Dock direction="bottom" className="pointer-events-auto" magnification={40}>
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onNavigate({ type: "home" })}
                className="flex items-center justify-center transition-colors text-foreground"
              >
                <Home className="w-6 h-6" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">{portfolio.dock.homeLabel}</TooltipContent>
          </Tooltip>
        </DockIcon>
        {portfolio.social.github ? (
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={portfolio.social.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center text-muted-foreground hover:text-yellow-500 transition-colors"
                >
                  <Github className="w-6 h-6" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="top">GitHub</TooltipContent>
            </Tooltip>
          </DockIcon>
        ) : null}
        {portfolio.social.linkedin ? (
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={portfolio.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center text-muted-foreground hover:text-yellow-500 transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="top">LinkedIn</TooltipContent>
            </Tooltip>
          </DockIcon>
        ) : null}
        {portfolio.dock.showAccessibilityMenu ? (
          <DockIcon>
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-center text-muted-foreground hover:text-yellow-500 transition-colors" aria-label="Accessibility settings">
                      <Accessibility className="w-6 h-6" />
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">Accessibility</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="mb-2">
                <DropdownMenuItem onSelect={(event) => event.preventDefault()} onClick={increaseFontSize}>Increase Text</DropdownMenuItem>
                <DropdownMenuItem onSelect={(event) => event.preventDefault()} onClick={decreaseFontSize}>Decrease Text</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(event) => event.preventDefault()} onClick={toggleContrast}>
                  Contrast: {contrast === "high" ? "High" : "Normal"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(event) => event.preventDefault()} onClick={resetAccessibility}>Reset All</DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs text-muted-foreground text-center">Font Size: {fontSize}%</div>
              </DropdownMenuContent>
            </DropdownMenu>
          </DockIcon>
        ) : null}
        {portfolio.dock.showThemeToggle ? (
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
                  className="flex items-center justify-center text-muted-foreground hover:text-yellow-500 transition-colors"
                  aria-label="Toggle theme"
                >
                  {currentTheme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">{currentTheme === "dark" ? "Light Mode" : "Dark Mode"}</TooltipContent>
            </Tooltip>
          </DockIcon>
        ) : null}
      </Dock>
    </div>
  );
}
