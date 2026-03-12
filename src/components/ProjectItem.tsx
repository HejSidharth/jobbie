interface ProjectItemProps {
  title: string;
  description: string;
  href: string;
  subtitle?: string;
  onNavigate?: () => void;
}

export default function ProjectItem({
  title,
  description,
  href,
  subtitle = "Project",
  onNavigate,
}: ProjectItemProps) {
  const isExternalLink = href.startsWith("http://") || href.startsWith("https://");

  const content = (
    <div className="flex flex-col gap-1 py-4 px-4 -mx-4 rounded-xl hover:bg-muted/50 transition-all group">
      <div className="flex items-baseline gap-2 flex-wrap">
        <h3 className="font-bold text-base font-inter border-b-2 border-transparent group-hover:border-yellow-500 transition-colors">
          {title}
        </h3>
        <span className="text-muted-foreground text-sm">•</span>
        <span className="text-muted-foreground text-sm">{subtitle}</span>
      </div>
      
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );

  if (isExternalLink) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block no-underline"
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onNavigate} className="block no-underline text-left w-full">
      {content}
    </button>
  );
}
