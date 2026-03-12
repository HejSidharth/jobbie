import { useState } from "react";
import type { ReactNode } from "react";
import { FileDropzoneField } from "@/components/builder/FileDropzoneField";
import { Switch } from "@/components/ui/switch";
import { exportPortfolioSite } from "@/lib/exportSite";
import { fetchIconAsset } from "@/lib/icon";
import { createId } from "@/lib/ids";
import { validatePortfolio } from "@/lib/validation";
import { useBuilderStore } from "@/state/store";
import type { AssetRecord } from "@/types/portfolio";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function SwitchField({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function EditorPanel() {
  const {
    portfolio,
    selectedSection,
    updatePortfolio,
    addExperience,
    removeExperience,
    addFeaturedProject,
    removeFeaturedProject,
    addCustomLink,
    upsertAsset,
    removeAsset,
  } = useBuilderStore();
  const [busyKey, setBusyKey] = useState<string>();
  const [exportState, setExportState] = useState<string>();
  const validation = validatePortfolio(portfolio);

  const assignUploadedAsset = async (
    file: File,
    kind: AssetRecord["kind"],
    onAssetId: (assetId: string) => void,
  ) => {
    const dataUrl = await readFileAsDataUrl(file);
    const asset: AssetRecord = {
      id: createId("asset"),
      kind,
      name: file.name,
      mimeType: file.type || "application/octet-stream",
      source: "upload",
      dataUrl,
      resolvedUrl: dataUrl,
    };
    upsertAsset(asset);
    onAssetId(asset.id);
  };

  const handleDownload = async () => {
    try {
      setExportState("Building ZIP...");
      const result = await exportPortfolioSite(portfolio);
      const url = URL.createObjectURL(result.zipBlob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = result.fileName;
      anchor.click();
      URL.revokeObjectURL(url);
      setExportState(result.warnings.length > 0 ? `Exported with warnings: ${result.warnings.join(" ")}` : "Export complete.");
    } catch (error) {
      setExportState(error instanceof Error ? error.message : "Export failed.");
    }
  };

  const site = (
    <div className="editor-stack">
      <Field label="Site name">
        <input placeholder="Sidharth Rao Hejamadi" value={portfolio.site.siteName} onChange={(event) => updatePortfolio((draft) => {
          draft.site.siteName = event.target.value;
          return draft;
        })} />
      </Field>
      <Field label="Page title">
        <input placeholder="Sidharth Hejamadi - Portfolio" value={portfolio.site.pageTitle} onChange={(event) => updatePortfolio((draft) => {
          draft.site.pageTitle = event.target.value;
          return draft;
        })} />
      </Field>
      <Field label="Tagline">
        <textarea placeholder="Coding, designing, and building." value={portfolio.site.tagline} onChange={(event) => updatePortfolio((draft) => {
          draft.site.tagline = event.target.value;
          return draft;
        })} />
      </Field>
      <Field label="University">
        <input placeholder="University of Illinois at Urbana-Champaign" value={portfolio.site.university} onChange={(event) => updatePortfolio((draft) => {
          draft.site.university = event.target.value;
          return draft;
        })} />
      </Field>
      <Field label="Major">
        <input placeholder="Computer Science and Statistics" value={portfolio.site.major} onChange={(event) => updatePortfolio((draft) => {
          draft.site.major = event.target.value;
          return draft;
        })} />
      </Field>
      <Field label="Contact email">
        <input placeholder="hejamadisidharth@gmail.com" value={portfolio.site.contactEmail} onChange={(event) => updatePortfolio((draft) => {
          draft.site.contactEmail = event.target.value;
          return draft;
        })} />
      </Field>
      <Field label="SEO title">
        <input placeholder="Sidharth Hejamadi - Portfolio" value={portfolio.site.seo.title} onChange={(event) => updatePortfolio((draft) => {
          draft.site.seo.title = event.target.value;
          return draft;
        })} />
      </Field>
      <Field label="SEO description">
        <textarea placeholder="Portfolio site for a builder-friendly clone of your homepage." value={portfolio.site.seo.description} onChange={(event) => updatePortfolio((draft) => {
          draft.site.seo.description = event.target.value;
          return draft;
        })} />
      </Field>
    </div>
  );

  const profile = (
    <div className="editor-stack">
      <Field label="Display name">
        <input placeholder="Sidharth Rao Hejamadi" value={portfolio.profile.displayName} onChange={(event) => updatePortfolio((draft) => {
          draft.profile.displayName = event.target.value;
          return draft;
        })} />
      </Field>
      <Field label="Intro copy">
        <textarea placeholder="This is what I do. I am ... studying ..." value={portfolio.profile.introHtml} onChange={(event) => updatePortfolio((draft) => {
          draft.profile.introHtml = event.target.value;
          return draft;
        })} />
      </Field>
      <Field label="Primary avatar">
        <FileDropzoneField
          emptyLabel="Drag & drop your primary avatar"
          helperText="Transparent PNG/WebP recommended, max 5MB"
          onFileChange={async (file) => {
            if (!file) return;
            await assignUploadedAsset(file, "image", (assetId) => updatePortfolio((draft) => {
              draft.profile.avatarAssetId = assetId;
              return draft;
            }));
          }}
        />
      </Field>
      <Field label="Hover avatar">
        <FileDropzoneField
          emptyLabel="Drag & drop your hover avatar"
          helperText="Upload a second face to reproduce the hover swap"
          onFileChange={async (file) => {
            if (!file) return;
            await assignUploadedAsset(file, "image", (assetId) => updatePortfolio((draft) => {
              draft.profile.avatarHoverAssetId = assetId;
              return draft;
            }));
          }}
        />
      </Field>
    </div>
  );

  const experience = (
    <div className="editor-stack">
      <SwitchField
        label="Show work experience section"
        checked={portfolio.sections.showExperience}
        onCheckedChange={(checked) => updatePortfolio((draft) => {
          draft.sections.showExperience = checked;
          return draft;
        })}
      />
      {!portfolio.sections.showExperience ? null : (
        <>
      <button type="button" className="secondary-button" onClick={addExperience}>Add experience</button>
      {portfolio.experience.map((item, index) => (
        <div key={item.id} className="editor-card space-y-4">
          <div className="editor-card-header mb-0 flex items-center justify-between gap-3">
            <strong>{item.company || `Experience ${index + 1}`}</strong>
            <button type="button" className="text-button" onClick={() => removeExperience(item.id)}>
              Delete
            </button>
          </div>
          <Field label="Company">
            <input placeholder="WhatNot" value={item.company} onChange={(event) => updatePortfolio((draft) => {
              draft.experience[index].company = event.target.value;
              return draft;
            })} />
          </Field>
          <Field label="Role">
            <input placeholder="Incoming SWE Intern" value={item.role} onChange={(event) => updatePortfolio((draft) => {
              draft.experience[index].role = event.target.value;
              return draft;
            })} />
          </Field>
          <Field label="Period">
            <input placeholder="Summer 2026" value={item.period} onChange={(event) => updatePortfolio((draft) => {
              draft.experience[index].period = event.target.value;
              return draft;
            })} />
          </Field>
          <Field label="Company URL">
            <input placeholder="https://company.com" value={item.href ?? ""} onChange={(event) => updatePortfolio((draft) => {
              draft.experience[index].href = event.target.value;
              return draft;
            })} />
          </Field>
          <Field label="Logo">
            <FileDropzoneField
              emptyLabel="Drop a company logo"
              helperText="Upload one image file, max 5MB"
              onFileChange={async (file) => {
                if (!file) return;
                await assignUploadedAsset(file, "icon", (assetId) => updatePortfolio((draft) => {
                  draft.experience[index].logoAssetId = assetId;
                  return draft;
                }));
              }}
            />
          </Field>
        </div>
      ))}
        </>
      )}
    </div>
  );

  const featured = (
    <div className="editor-stack">
      <SwitchField
        label="Show featured projects section"
        checked={portfolio.sections.showFeaturedProjects}
        onCheckedChange={(checked) => updatePortfolio((draft) => {
          draft.sections.showFeaturedProjects = checked;
          return draft;
        })}
      />
      {!portfolio.sections.showFeaturedProjects ? null : (
        <>
      <button type="button" className="secondary-button" onClick={addFeaturedProject}>Add featured project</button>
      {portfolio.featuredProjects.map((item, index) => (
        <div key={item.id} className="editor-card space-y-4">
          <div className="editor-card-header mb-0 flex items-center justify-between gap-3">
            <strong>{item.title || `Project ${index + 1}`}</strong>
            <button type="button" className="text-button" onClick={() => removeFeaturedProject(item.id)}>
              Delete
            </button>
          </div>
          <Field label="Title">
            <input placeholder="SlideBoard" value={item.title} onChange={(event) => updatePortfolio((draft) => {
              draft.featuredProjects[index].title = event.target.value;
              return draft;
            })} />
          </Field>
          <Field label="Subtitle">
            <input placeholder="Whiteboard Presentations" value={item.subtitle} onChange={(event) => updatePortfolio((draft) => {
              draft.featuredProjects[index].subtitle = event.target.value;
              return draft;
            })} />
          </Field>
          <Field label="Description">
            <textarea placeholder="A short description of what this project does." value={item.description} onChange={(event) => updatePortfolio((draft) => {
              draft.featuredProjects[index].description = event.target.value;
              return draft;
            })} />
          </Field>
          <Field label="Project URL">
            <input placeholder="https://example.com" value={item.href} onChange={(event) => updatePortfolio((draft) => {
              draft.featuredProjects[index].href = event.target.value;
              return draft;
            })} />
          </Field>
        </div>
      ))}
        </>
      )}
    </div>
  );

  const social = (
    <div className="editor-stack">
      <Field label="GitHub">
        <input placeholder="https://github.com/yourusername" value={portfolio.social.github ?? ""} onChange={(event) => updatePortfolio((draft) => {
          draft.social.github = event.target.value;
          return draft;
        })} />
      </Field>
      <Field label="LinkedIn">
        <input placeholder="https://www.linkedin.com/in/yourname" value={portfolio.social.linkedin ?? ""} onChange={(event) => updatePortfolio((draft) => {
          draft.social.linkedin = event.target.value;
          return draft;
        })} />
      </Field>
      <SwitchField
        label="Show accessibility menu label"
        checked={portfolio.dock.showAccessibilityMenu}
        onCheckedChange={(checked) => updatePortfolio((draft) => {
          draft.dock.showAccessibilityMenu = checked;
          return draft;
        })}
      />
      <SwitchField
        label="Show theme toggle label"
        checked={portfolio.dock.showThemeToggle}
        onCheckedChange={(checked) => updatePortfolio((draft) => {
          draft.dock.showThemeToggle = checked;
          return draft;
        })}
      />
      <Field label="Home dock label">
        <input placeholder="Home" value={portfolio.dock.homeLabel} onChange={(event) => updatePortfolio((draft) => {
          draft.dock.homeLabel = event.target.value;
          return draft;
        })} />
      </Field>
      <button type="button" className="secondary-button" onClick={addCustomLink}>Add custom social link</button>
      {portfolio.social.customLinks.map((link, index) => (
        <div key={link.id} className="editor-card">
          <Field label="Label">
            <input placeholder="Twitter" value={link.label} onChange={(event) => updatePortfolio((draft) => {
              draft.social.customLinks[index].label = event.target.value;
              return draft;
            })} />
          </Field>
          <Field label="URL">
            <input placeholder="https://example.com" value={link.href} onChange={(event) => updatePortfolio((draft) => {
              draft.social.customLinks[index].href = event.target.value;
              return draft;
            })} />
          </Field>
        </div>
      ))}
    </div>
  );

  const assets = (
    <div className="editor-stack">
      {portfolio.experience.map((item, index) => (
        <div key={item.id} className="editor-card">
          <div className="editor-card-header">
            <strong>{item.company}</strong>
          </div>
          <Field label="Fetch icon by website">
            <div className="fetch-row">
              <input
                placeholder="https://company.com"
                defaultValue={item.href ?? ""}
                onBlur={async (event) => {
                  const input = event.target.value.trim();
                  if (!input) return;
                  try {
                    setBusyKey(item.id);
                    const { asset, source } = await fetchIconAsset(input);
                    upsertAsset(asset);
                    updatePortfolio((draft) => {
                      draft.experience[index].logoAssetId = asset.id;
                      draft.experience[index].logoSource = source;
                      return draft;
                    });
                  } catch (error) {
                    setExportState(error instanceof Error ? error.message : "Could not fetch icon.");
                  } finally {
                    setBusyKey(undefined);
                  }
                }}
              />
              <span className="inline-status">{busyKey === item.id ? "Fetching..." : "Blur field to fetch"}</span>
            </div>
          </Field>
          <Field label="Upload replacement">
            <FileDropzoneField
              emptyLabel="Drop a replacement icon"
              helperText="Use this to override the auto-fetched favicon"
              onFileChange={async (file) => {
                if (!file) return;
                await assignUploadedAsset(file, "icon", (assetId) => updatePortfolio((draft) => {
                  draft.experience[index].logoAssetId = assetId;
                  return draft;
                }));
              }}
            />
          </Field>
          <Field label="Manual icon URL">
            <input
              placeholder="https://cdn.example.com/logo.png"
              onBlur={(event) => {
                const value = event.target.value.trim();
                if (!value) return;
                const asset: AssetRecord = {
                  id: createId("asset"),
                  kind: "icon",
                  name: `${item.company} manual icon`,
                  mimeType: "image/png",
                  source: "manual-url",
                  remoteUrl: value,
                  resolvedUrl: value,
                };
                upsertAsset(asset);
                updatePortfolio((draft) => {
                  draft.experience[index].logoAssetId = asset.id;
                  return draft;
                });
              }}
            />
          </Field>
        </div>
      ))}
      <div className="asset-grid">
        {portfolio.assets.assets.map((asset) => (
          <article key={asset.id} className="asset-card">
            <img src={asset.resolvedUrl ?? asset.dataUrl ?? asset.remoteUrl} alt={asset.name} />
            <div>
              <strong>{asset.name}</strong>
              <p className="muted">{asset.source}</p>
              <button type="button" className="text-button" onClick={() => removeAsset(asset.id)}>Remove asset</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );

  const exportPanel = (
    <div className="editor-stack">
      <div className="callout">
        <strong>Export</strong>
        <p>The ZIP includes a standalone Vite source project and a README with Netlify deployment steps.</p>
      </div>
      {validation.errors.length > 0 ? (
        <div className="validation-list error">
          {validation.errors.map((issue) => (
            <p key={issue}>{issue}</p>
          ))}
        </div>
      ) : null}
      {validation.warnings.length > 0 ? (
        <div className="validation-list warning">
          {validation.warnings.map((issue) => (
            <p key={issue}>{issue}</p>
          ))}
        </div>
      ) : null}
      <button type="button" className="primary-button" onClick={handleDownload}>
        Export source ZIP
      </button>
      {exportState ? <p className="muted">{exportState}</p> : null}
    </div>
  );

  switch (selectedSection) {
    case "profile":
      return profile;
    case "experience":
      return experience;
    case "featured":
      return featured;
    case "social":
      return social;
    case "assets":
      return assets;
    case "export":
      return exportPanel;
    case "site":
    default:
      return site;
  }
}
