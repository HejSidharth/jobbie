import { ArrowLeft, ArrowRight, WandSparkles } from "lucide-react";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import PageContainer from "@/components/PageContainer";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import { RobotModeProvider } from "@/context/RobotModeContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { EditorPanel } from "@/components/builder/EditorPanel";
import { PreviewDockNav } from "@/components/portfolio/PreviewDockNav";
import { PortfolioRenderer } from "@/components/portfolio/PortfolioRenderer";
import { JobsExplorer } from "@/components/jobs/JobsExplorer";
import HeroBadge from "@/components/ui/hero-badge";
import { Icons } from "@/components/ui/icons";
import { useBuilderStore } from "@/state/store";
import { cn } from "@/lib/utils";

const setupSteps = [
  {
    id: "site",
    label: "Site Settings",
    description: "Set your title, tagline, email, and SEO basics.",
  },
  {
    id: "profile",
    label: "Profile",
    description: "Write your intro and upload your Notion-style avatar pair.",
  },
  {
    id: "experience",
    label: "Experience",
    description: "Add the work rows that appear on the homepage.",
  },
  {
    id: "featured",
    label: "Featured Projects",
    description: "Choose the projects you want featured on the homepage.",
  },
  {
    id: "social",
    label: "Social + Dock",
    description: "Control dock links, social links, and homepage toggles.",
  },
  {
    id: "assets",
    label: "Assets + Icons",
    description: "Fetch or upload the logos and images used on the homepage.",
  },
  {
    id: "export",
    label: "Export",
    description: "Validate everything and download the source ZIP.",
  },
] as const;

function SiteNavbar() {
  const location = useLocation();
  const isPortfolio = location.pathname.startsWith("/portfolio") && location.pathname !== "/portfolio/preview";
  const isHome = location.pathname === "/";

  if (isPortfolio) {
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 h-14 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-inter text-xl font-bold tracking-tight transition-colors hover:text-yellow-500">
              Jobbie
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link to="/jobs" className="transition-colors hover:text-foreground">
                Jobs
              </Link>
              <Link to="/portfolio" className="text-foreground transition-colors hover:text-foreground">
                Portfolio
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/HejSidharth"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icons.github className="h-4 w-4" />
            </a>
            {isHome && (
              <Button asChild variant="default" size="sm" className="rounded-full px-4">
                <Link to="/jobs">Start now</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 box-border h-24 bg-background/90 px-4 py-4 backdrop-blur">
      <div className="mx-auto flex h-full max-w-3xl items-center justify-between rounded-full border bg-card/90 px-5 py-3 shadow-sm">
        <Link to="/" className="font-inter text-2xl font-semibold tracking-tight transition-colors hover:text-yellow-500">
          Jobbie
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
         
          <Link to="/jobs" className={cn("transition-colors hover:text-foreground", location.pathname === "/jobs" && "text-foreground")}>
            Jobs
          </Link>
          <Link to="/portfolio" className={cn("transition-colors hover:text-foreground", location.pathname.startsWith("/portfolio") && "text-foreground")}>
            Portfolio
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/HejSidharth"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icons.github className="h-4 w-4" />
          </a>
          {isHome && (
            <Button asChild variant="outline" className="rounded-full px-5">
              <Link to="/jobs">Start now</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function BuilderSidebar({
  currentStepLabel,
  currentStepDescription,
  isFirstStep,
  isLastStep,
  goToPreviousStep,
  goToNextStep,
}: {
  currentStepLabel: string;
  currentStepDescription: string;
  isFirstStep: boolean;
  isLastStep: boolean;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
}) {
  const { collapsed } = useSidebar();

  return (
    <Sidebar>
      <div className="flex h-full flex-col">
        <SidebarHeader className="px-4 py-4 sm:px-5">
          <div className={`flex items-start justify-between gap-3 ${collapsed ? "lg:justify-center" : ""}`}>
            <div className={`min-w-0 ${collapsed ? "lg:hidden" : ""}`}>
                <p className="text-sm font-medium">{currentStepLabel}</p>
                <p className="mt-1 text-sm text-muted-foreground">{currentStepDescription}</p>
            </div>
            <SidebarTrigger className="hidden shrink-0 lg:inline-flex" />
          </div>
        </SidebarHeader>

        <SidebarContent className={collapsed ? "px-4 py-5 sm:px-5 lg:px-3 lg:py-4" : "px-4 py-5 sm:px-5"}>
          <div className={collapsed ? "lg:hidden" : ""}>
            <EditorPanel />
          </div>
        </SidebarContent>

        <SidebarFooter className={collapsed ? "px-4 py-4 sm:px-5 lg:px-3" : "px-4 py-4 sm:px-5"}>
          <div className={`flex items-center justify-between gap-2 ${collapsed ? "lg:flex-col lg:items-center" : ""}`}>
            <button
              type="button"
              onClick={goToPreviousStep}
              disabled={isFirstStep}
              className="rounded-full border bg-background px-4 py-2 text-sm hover:text-yellow-500 inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:hover:text-inherit"
              aria-label="Previous step"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className={collapsed ? "lg:hidden" : ""}>Back</span>
            </button>
            <button
              type="button"
              onClick={goToNextStep}
              disabled={isLastStep}
              className="rounded-full border bg-background px-4 py-2 text-sm hover:text-yellow-500 inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:hover:text-inherit"
              aria-label="Next step"
            >
              <span className={collapsed ? "lg:hidden" : ""}>Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}

function BuilderScreen() {
  const {
    portfolio,
    previewRoute,
    selectedSection,
    setSelectedSection,
  } = useBuilderStore();
  const currentIndex = Math.max(
    0,
    setupSteps.findIndex((step) => step.id === selectedSection),
  );
  const currentStep = setupSteps[currentIndex] ?? setupSteps[0];
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === setupSteps.length - 1;

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setSelectedSection(setupSteps[currentIndex - 1].id);
    }
  };

  const goToNextStep = () => {
    if (!isLastStep) {
      setSelectedSection(setupSteps[currentIndex + 1].id);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden bg-background lg:flex-row">
        <BuilderSidebar
          currentStepLabel={currentStep.label}
          currentStepDescription={currentStep.description}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          goToPreviousStep={goToPreviousStep}
          goToNextStep={goToNextStep}
        />
        <SidebarInset className="relative hidden overflow-hidden lg:block">
          <div className="h-full overflow-y-auto bg-background pb-28">
            <PortfolioRenderer portfolio={portfolio} route={previewRoute} onNavigate={() => undefined} />
          </div>
          <PreviewDockNav
            portfolio={portfolio}
            route={previewRoute}
            onNavigate={() => undefined}
            className="pointer-events-none absolute bottom-4 left-0 right-0 z-30 mx-auto w-fit"
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function HomeScreen() {
  return (
    <div className="">
      <PageContainer className="max-w-3xl pb-0">
        <div className="mx-auto flex  max-w-6xl flex-col mt-10 sm:py-4 px-4">
          <div className="w-full border-b border-border/80 pb-4">
            <div className="flex h-full max-w-6xl flex-col  justify-center space-y-4  pb-10">
              <HeroBadge
                text="Made by Hejamadi"
                icon={<Icons.logo className="h-4 w-4" />}
                className="border-border text-muted-foreground"
              />

              <div className="space-y-4">
                <h1 className="max-w-6xl  font-newsreader text-5xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground lg:text-7xl">
                  Make job hunting
                  <span className="block underline-offset-4">easier.</span>
                </h1>

              <p className="max-w-6xl  text-lg text-muted-foreground">
                Find jobs, build your resume, and prepare for interviews all in one place.
              </p>
                
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="default"
                  className="px-4 py-3 text-md font-semibold bg-white text-background hover:bg-gray-100"
                >
                  Start Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 py-4 md:grid-cols-3 md:gap-8">
            <div>
              <h3 className="text-sm font-medium text-foreground">Find Jobs</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Browse internships and new grad roles without bouncing between public repos and scattered links.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Build Your Materials</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Create a personal portfolio and resume in the same workflow so applications are easier to send.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Prepare Smarter</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Keep room for company-specific question banks and other tools that help you prep before applying.
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

function JobsScreen() {
  return (
    <div className="max-w-3xl mx-auto">
    <PageContainer className="max-w-3xl px-5 sm:px-5 lg:px-5">
      <div className="py-8">
        <JobsExplorer />
      </div>
    </PageContainer>
    </div>
  );
}

function PreviewScreen() {
  const { portfolio, previewRoute } = useBuilderStore();

  return (
    <div className="min-h-screen relative">
      <div className="sticky top-14 z-20 bg-gradient-to-b from-background to-transparent">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-3 flex items-center justify-center gap-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">preview mode</p>
          <Link
            to="/portfolio"
            className="text-xs italic underline underline-offset-4 text-muted-foreground hover:text-yellow-500 inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            go back
          </Link>
        </div>
      </div>

      <PortfolioRenderer portfolio={portfolio} route={previewRoute} onNavigate={() => undefined} />
      <PreviewDockNav
        portfolio={portfolio}
        route={previewRoute}
        onNavigate={() => undefined}
        className="pointer-events-none fixed bottom-4 left-0 right-0"
      />
    </div>
  );
}

function AppRoutes() {
  return (
    <>
      <SiteNavbar />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/jobs" element={<JobsScreen />} />
        <Route path="/portfolio" element={<BuilderScreen />} />
        <Route path="/portfolio/preview" element={<PreviewScreen />} />
      </Routes>
    </>
  );
}

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AccessibilityProvider>
        <RobotModeProvider>
          <TooltipProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </RobotModeProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}
