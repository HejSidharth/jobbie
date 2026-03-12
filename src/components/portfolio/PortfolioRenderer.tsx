import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import ExperienceItem from "@/components/ExperienceItem";
import PageContainer from "@/components/PageContainer";
import ProjectItem from "@/components/ProjectItem";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { resolveAssetUrl } from "@/lib/assets";
import type { PortfolioSite, PreviewRoute } from "@/types/portfolio";

type RendererProps = {
  portfolio: PortfolioSite;
  route: PreviewRoute;
  onNavigate: (route: PreviewRoute) => void;
};

export function PortfolioRenderer({ portfolio, route, onNavigate }: RendererProps) {
  const avatar = resolveAssetUrl(portfolio.assets, portfolio.profile.avatarAssetId);
  const avatarHover = resolveAssetUrl(portfolio.assets, portfolio.profile.avatarHoverAssetId, avatar);
  void route;
  void onNavigate;

  return (
    <div className="portfolio-preview-surface min-h-full">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="h-20 bg-gradient-to-b from-background to-transparent mb-10" />
        <PageContainer showFooter={false}>
          <div className="flex flex-col gap-3 py-8 max-w-2xl mx-auto">
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="sm:hidden flex-shrink-0">
                    {avatar ? (
                      <img src={avatar} alt={portfolio.site.siteName} className="w-10 h-10 rounded-full object-cover border-2 border-border" />
                    ) : null}
                  </div>
                  <button className="font-bold border-b-2 text-lg hover:border-yellow-500 inline-block font-inter">
                    {portfolio.site.siteName}
                  </button>
                </div>
                <div className="mt-4">
                  <p className="font-inter text-base">
                    <span className="italic font-newsreader hover:text-yellow-500 cursor-pointer">
                      {portfolio.site.tagline}
                    </span>{" "}
                    {portfolio.profile.introHtml}
                  </p>
                  <p className="font-inter text-sm text-muted-foreground mt-4">
                    Contact me at:{" "}
                    <a href={`mailto:${portfolio.site.contactEmail}`} className="hover:text-yellow-500 transition-colors">
                      {portfolio.site.contactEmail}
                    </a>
                  </p>
                </div>
              </div>
              <div className="hidden sm:block flex-shrink-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-24 h-24 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden relative group cursor-pointer">
                        {avatar ? <img src={avatar} alt={portfolio.site.siteName} className="w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-300" /> : null}
                        {avatarHover ? <img src={avatarHover} alt={portfolio.site.siteName} className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> : null}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">Upload two Notion-style faces to reproduce the hover swap from your live site.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {portfolio.sections.showExperience ? (
              <section>
                <button className="font-newsreader italic font-medium mt-10 border-b-2 w-max hover:border-yellow-500">
                  Work Experience
                </button>
                <div className="grid grid-cols-1 gap-0 mt-4">
                  {portfolio.experience.map((item) => (
                    <ExperienceItem
                      key={item.id}
                      company={item.company}
                      title={item.role}
                      period={item.period}
                      href={item.href}
                      description={item.description}
                      logo={resolveAssetUrl(portfolio.assets, item.logoAssetId)}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {portfolio.sections.showFeaturedProjects ? (
              <section>
                <a
                  href="#featured-projects"
                  className="font-newsreader italic font-medium mt-10 border-b-2 w-max hover:border-yellow-500 flex items-center gap-2"
                >
                  Featured Projects
                  <MoveRight className="w-4 h-4" />
                </a>
                <div id="featured-projects" className="grid grid-cols-1 gap-0 mt-4">
                  {portfolio.featuredProjects.map((item) => (
                    <ProjectItem
                      key={item.id}
                      title={item.title}
                      subtitle={item.subtitle}
                      description={item.description}
                      href={item.href}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </PageContainer>
      </motion.div>
    </div>
  );
}
