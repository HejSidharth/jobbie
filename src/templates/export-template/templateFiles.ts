import type { PortfolioSite } from "@/types/portfolio";

function stableJson(data: unknown) {
  return JSON.stringify(data, null, 2);
}

export function createExportReadme(siteName: string) {
  return `# ${siteName}

This project was exported from Portfolio Clone Builder.

## Run locally

\`\`\`bash
npm install
npm run dev
\`\`\`

## Production build

\`\`\`bash
npm run build
\`\`\`

## Deploy to Netlify

1. \`npm install\`
2. \`npm run build\`
3. \`npx netlify login\`
4. \`npx netlify init\`
5. Use \`npm run build\` as the build command
6. Use \`dist\` as the publish directory
7. Run \`npx netlify deploy --prod\`
`;
}

export function createTemplatePackageJson() {
  return stableJson({
    name: "exported-portfolio",
    private: true,
    version: "0.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "tsc -b && vite build",
      preview: "vite preview",
    },
    dependencies: {
      react: "^18.2.0",
      "react-dom": "^18.2.0",
      "react-router-dom": "^6.23.1",
    },
    devDependencies: {
      "@types/react": "^18.2.66",
      "@types/react-dom": "^18.2.22",
      "@vitejs/plugin-react": "^5.0.2",
      typescript: "^5.9.2",
      vite: "^7.1.7",
    },
  });
}

export function createTemplateTsconfig() {
  return stableJson({
    compilerOptions: {
      target: "ES2021",
      useDefineForClassFields: true,
      lib: ["ES2021", "DOM", "DOM.Iterable"],
      module: "ESNext",
      skipLibCheck: true,
      moduleResolution: "Bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx",
      strict: true,
    },
    include: ["src"],
    references: [{ path: "./tsconfig.node.json" }],
  });
}

export function createTemplateTsconfigNode() {
  return stableJson({
    compilerOptions: {
      composite: true,
      target: "ES2021",
      module: "ESNext",
      moduleResolution: "Bundler",
      resolveJsonModule: true,
      allowSyntheticDefaultImports: true,
    },
    include: ["vite.config.ts"],
  });
}

export function createTemplateViteConfig() {
  return `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`;
}

export function createTemplateIndexHtml(siteTitle: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${siteTitle}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

export function createTemplateStyles() {
  return `:root {
  color: #f8fafc;
  background: #0f172a;
  font-family: Inter, system-ui, sans-serif;
}

* { box-sizing: border-box; }
body { margin: 0; background: #0f0f0f; min-height: 100vh; }
a { color: inherit; }
button { font: inherit; }
img { display: block; max-width: 100%; }

.site-shell { min-height: 100vh; }
.site-topbar { height: 80px; position: sticky; top: 0; background: linear-gradient(to bottom, #0f0f0f, transparent); }
.site-frame { max-width: 64rem; margin: 0 auto; padding: 0 1.5rem 6rem; }
.name { font-weight: 700; border-bottom: 2px solid transparent; display: inline-block; font-size: 1.125rem; }
.name:hover { border-color: #eab308; color: #eab308; }
.content { display: flex; flex-direction: column; gap: 0.75rem; padding: 2rem 0; max-width: 42rem; margin: 0 auto; }
.header { display: flex; justify-content: space-between; gap: 2rem; align-items: flex-start; }
.avatar { width: 96px; height: 96px; border-radius: 999px; overflow: hidden; position: relative; border: 2px solid #27272a; background: #18181b; }
.avatar img { width: 100%; height: 100%; object-fit: cover; transition: opacity .2s ease; }
.avatar .hover { position: absolute; inset: 0; opacity: 0; }
.avatar:hover .hover { opacity: 1; }
.avatar:hover .base { opacity: 0; }
.muted { color: #a1a1aa; }
.section-title { font-family: Georgia, serif; font-style: italic; font-weight: 500; margin-top: 2.5rem; border-bottom: 2px solid transparent; width: max-content; }
.section-title:hover { border-color: #eab308; }
.project-link { text-decoration: none; color: inherit; }
.project-link > div,
.experience-row { display: flex; flex-direction: column; gap: 0.25rem; padding: 1rem; margin: 0 -1rem; border-radius: 0.75rem; transition: background .2s ease; }
.project-link > div:hover,
.experience-row:hover { background: rgba(39, 39, 42, 0.6); }
.project-heading { display: flex; gap: 0.5rem; align-items: baseline; flex-wrap: wrap; }
.project-heading h3 { font-size: 1rem; font-weight: 700; border-bottom: 2px solid transparent; margin: 0; }
.project-link:hover .project-heading h3 { border-color: #eab308; }
.logo-row { display: flex; gap: 1rem; align-items: flex-start; }
.logo-row img { width: 32px; height: 32px; border-radius: 999px; object-fit: cover; }
.dock { position: fixed; left: 0; right: 0; bottom: 1rem; display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap; }
.dock a, .dock span { padding: 0.625rem 0.875rem; border-radius: 999px; border: 1px solid #27272a; background: #0f0f0f; text-decoration: none; }
@media (max-width: 760px) {
  .site-frame { padding: 0 1rem 5rem; }
  .header { flex-direction: column-reverse; }
}
`;
}

export function createTemplateMain() {
  return `import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
`;
}

export function createTemplateTypes() {
  return `export type AssetRecord = {
  id: string;
  kind: "image" | "icon" | "favicon";
  name: string;
  mimeType: string;
  source: "upload" | "remote-fetch" | "manual-url";
  resolvedUrl?: string;
};

export type PortfolioSite = {
  version: 1;
  site: {
    siteName: string;
    pageTitle: string;
    tagline: string;
    university: string;
    major: string;
    contactEmail: string;
    faviconAssetId?: string;
    seo: {
      title: string;
      description: string;
      ogImageAssetId?: string;
    };
  };
  profile: {
    displayName: string;
    introHtml: string;
    avatarAssetId?: string;
    avatarHoverAssetId?: string;
    avatarTipsEnabled: true;
  };
  sections: {
    showExperience: boolean;
    showFeaturedProjects: boolean;
  };
  experience: Array<{
    id: string;
    company: string;
    role: string;
    period: string;
    href?: string;
    description?: string;
    logoAssetId?: string;
  }>;
  featuredProjects: Array<{
    id: string;
    title: string;
    subtitle: string;
    description: string;
    href: string;
  }>;
  social: {
    github?: string;
    linkedin?: string;
    customLinks: Array<{ id: string; label: string; href: string }>;
  };
  dock: {
    showThemeToggle: boolean;
    showAccessibilityMenu: boolean;
    homeLabel: string;
  };
  assets: {
    assets: AssetRecord[];
  };
};
`;
}

export function createTemplatePortfolioData(data: PortfolioSite) {
  return stableJson(data);
}

export function createTemplatePortfolioLoader() {
  return `import json from "./portfolio.json";
import { assetMap } from "../generated-assets";
import type { PortfolioSite } from "../types";

const portfolio = json as PortfolioSite;

portfolio.assets.assets = portfolio.assets.assets.map((asset) => ({
  ...asset,
  resolvedUrl: assetMap[asset.id] ?? asset.resolvedUrl,
}));

export { portfolio };
`;
}

export function createTemplateAssetManifest(assets: Array<{ id: string; fileName: string }>) {
  const imports = assets.map((asset, index) => `import asset${index} from "./${asset.fileName}";`).join("\n");
  const entries = assets.map((asset, index) => `  "${asset.id}": asset${index},`).join("\n");
  return `${imports}

export const assetMap: Record<string, string> = {
${entries}
};
`;
}

export function createTemplateApp() {
  return `import { portfolio } from "./data/portfolio";

function resolveAsset(assetId?: string) {
  return portfolio.assets.assets.find((asset) => asset.id === assetId)?.resolvedUrl;
}

export function App() {
  const avatar = resolveAsset(portfolio.profile.avatarAssetId);
  const avatarHover = resolveAsset(portfolio.profile.avatarHoverAssetId) ?? avatar;

  return (
    <div className="site-shell">
      <div className="site-topbar" />
      <div className="site-frame">
        <div className="content">
          <div className="header">
            <div>
              <div className="name">{portfolio.site.siteName}</div>
              <p>
                <span style={{ fontStyle: "italic" }}>{portfolio.site.tagline}</span>{" "}
                {portfolio.profile.introHtml}
              </p>
              <p className="muted">Contact me at: {portfolio.site.contactEmail}</p>
            </div>
            <div className="avatar">
              {avatar ? <img src={avatar} alt={portfolio.profile.displayName} className="base" /> : null}
              {avatarHover ? <img src={avatarHover} alt={portfolio.profile.displayName + " hover"} className="hover" /> : null}
            </div>
          </div>

          {portfolio.sections.showExperience ? (
            <section>
              <div className="section-title">Work Experience</div>
              <div>
                {portfolio.experience.map((item) => {
                  const logo = resolveAsset(item.logoAssetId);
                  return (
                    <a key={item.id} href={item.href} target="_blank" rel="noreferrer" className="project-link">
                      <div className="experience-row">
                        <div className="logo-row">
                          {logo ? <img src={logo} alt={item.company} /> : null}
                          <div>
                            <div className="project-heading">
                              <h3>{item.company}</h3>
                              <span className="muted">•</span>
                              <span className="muted">{item.role}</span>
                            </div>
                            <p className="muted">{item.period}</p>
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          ) : null}

          {portfolio.sections.showFeaturedProjects ? (
            <section>
              <div className="section-title">Featured Projects</div>
              <div>
                {portfolio.featuredProjects.map((item) => (
                  <a key={item.id} href={item.href} target="_blank" rel="noreferrer" className="project-link">
                    <div>
                      <div className="project-heading">
                        <h3>{item.title}</h3>
                        <span className="muted">•</span>
                        <span className="muted">{item.subtitle}</span>
                      </div>
                      <p className="muted">{item.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <footer className="dock">
          <span>{portfolio.dock.homeLabel}</span>
          {portfolio.social.github ? <a href={portfolio.social.github} target="_blank" rel="noreferrer">GitHub</a> : null}
          {portfolio.social.linkedin ? <a href={portfolio.social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> : null}
          {portfolio.dock.showAccessibilityMenu ? <span>Accessibility</span> : null}
          {portfolio.dock.showThemeToggle ? <span>Theme</span> : null}
        </footer>
      </div>
    </div>
  );
}
`;
}
