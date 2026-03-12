interface ExperienceItemProps {
  company: string;
  title: string;
  period: string;
  logo?: string;
  href?: string;
  description?: string;
  logoSize?: "small" | "default";
}

export default function ExperienceItem({
  company,
  title,
  period,
  logo,
  href,
  description,
  logoSize = "default",
}: ExperienceItemProps) {
  const logoSizeClass = logoSize === "small" ? "w-6 h-6" : "w-8 h-8";
  
  const content = (
    <div className="flex items-start gap-4 py-4 px-4 -mx-4 rounded-xl hover:bg-muted/50 transition-all group">
      {logo && (
        <div className="flex-shrink-0">
          <img
            src={logo}
            alt={`${company} logo`}
            className={`${logoSizeClass} rounded-full object-cover`}
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="font-bold text-base font-inter">{company}</h3>
          <span className="text-muted-foreground text-sm">•</span>
          <span className="text-muted-foreground text-sm">{title}</span>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1 ">{period}</p>
      </div>
    </div>
  );

  if (href) {
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

  return <div>{content}</div>;
}
