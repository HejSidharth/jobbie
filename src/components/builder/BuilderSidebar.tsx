import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sections = [
  { id: "site", label: "Site Settings" },
  { id: "profile", label: "Profile" },
  { id: "experience", label: "Experience" },
  { id: "featured", label: "Featured Projects" },
  { id: "social", label: "Social + Dock" },
  { id: "assets", label: "Assets + Icons" },
  { id: "export", label: "Export" },
];

export function BuilderSidebar({
  selectedSection,
  onSelect,
}: {
  selectedSection: string;
  onSelect: (section: string) => void;
}) {
  return (
    <aside className="builder-sidebar panel">
      <div>
        <p className="panel-kicker">Sections</p>
        <h2>Only the homepage content is editable now.</h2>
      </div>
      <div className="sm:hidden">
        <Select value={selectedSection} onValueChange={onSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Choose section" />
          </SelectTrigger>
          <SelectContent>
            {sections.map((section) => (
              <SelectItem key={section.id} value={section.id}>
                {section.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <nav className="builder-nav">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`hidden sm:block ${selectedSection === section.id ? "is-active" : ""}`}
            onClick={() => onSelect(section.id)}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
