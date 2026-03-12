import { Bookmark, ChevronLeft, ChevronRight, ExternalLink, Heart, CheckCircle2, Search, ArrowUpRight, Flame, X, Check, Home } from "lucide-react";
import { startTransition, useDeferredValue, useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type JobCategory = "intern" | "new_grad" | "saved" | "doom";

type JobSource = {
  sourceId: string;
  sourcePostedText: string;
};

type Job = {
  id: string;
  category: JobCategory;
  company: string;
  role: string;
  location: string;
  applicationUrl: string;
  postedDate: string;
  isPostedToday: boolean;
  firstSeenAt: string;
  lastSeenAt: string;
  sources: JobSource[];
};

type JobSummary = Pick<
  Job,
  "id" | "category" | "company" | "role" | "location" | "applicationUrl" | "postedDate" | "isPostedToday"
>;
type JobsIndexResponse = {
  generatedAt: string;
  timezone: string;
  pageSize: number;
  totalJobs: number;
  jobs: JobSummary[];
};

type JobsMetaResponse = {
  generatedAt: string;
  timezone: string;
  activeJobCount: number;
  todayJobCount: number;
  parseWarnings: string[];
};

const FILTER_OPTIONS: Array<{ id: JobCategory; label: string; icon?: any }> = [
  { id: "intern", label: "Internships" },
  { id: "new_grad", label: "New Grad" },
  { id: "saved", label: "Saved" },
  { id: "doom", label: "Doom Scroll", icon: Flame },
];

function getTitleForFilter(filter: JobCategory): string {
  if (filter === "intern") return "Internships";
  if (filter === "new_grad") return "New Grad";
  if (filter === "saved") return "Saved Jobs";
  return "Doom Scroll";
}

function getDataUrl(fileName: string): string {
  return new URL(`data/${fileName}`, window.location.origin + import.meta.env.BASE_URL).toString();
}

async function fetchJson<T>(fileName: string): Promise<T> {
  const response = await fetch(getDataUrl(fileName));
  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok) {
    throw new Error(`Could not load ${fileName}.`);
  }

  if (!contentType.includes("application/json")) {
    throw new Error(`Expected JSON for ${fileName}, received ${contentType || "unknown content type"}.`);
  }

  return response.json() as Promise<T>;
}

function formatCategory(category: JobCategory): string {
  return category === "intern" ? "Internship" : "New Grad";
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function decodeHtml(html: string) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function sanitizeText(value: string): string {
  // Removes emojis and other non-standard characters, then trims
  const decoded = decodeHtml(value);
  return decoded
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE0F}]/gu, '')
    .trim();
}

export function JobsExplorer() {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [meta, setMeta] = useState<JobsMetaResponse | null>(null);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<JobCategory>("intern");
  const [doomPreference, setDoomPreference] = useState<"intern" | "new_grad" | null>(null);
  const [savedSubFilter, setSavedSubFilter] = useState<"all" | "applied" | "pending">("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("jobbie-saved-jobs");
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedIds, setAppliedIds] = useState<string[]>(() => {
    const applied = localStorage.getItem("jobbie-applied-jobs");
    return applied ? JSON.parse(applied) : [];
  });
  const [viewedIds, setViewedIds] = useState<Set<string>>(() => {
    const viewed = localStorage.getItem("jobbie-viewed-jobs");
    return viewed ? new Set(JSON.parse(viewed)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem("jobbie-saved-jobs", JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem("jobbie-applied-jobs", JSON.stringify(appliedIds));
  }, [appliedIds]);

  useEffect(() => {
    localStorage.setItem("jobbie-viewed-jobs", JSON.stringify(Array.from(viewedIds)));
  }, [viewedIds]);

  useEffect(() => {
    if (filter === "doom") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [filter]);

  const markAsViewed = useCallback((id: string) => {
    setViewedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    setPage(1);
  }, [savedSubFilter]);


  const toggleSave = useCallback((id: string) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  const toggleApplied = useCallback((id: string) => {
    setAppliedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  useEffect(() => {
    if (filter === "doom") {
      const header = document.querySelector("header");
      if (header) {
        header.style.display = "none";
      }
      return () => {
        if (header) {
          header.style.display = "";
        }
      };
    }
  }, [filter]);

  const clearAllData = useCallback(() => {
    if (confirm("Reset everything? This will clear all saved, applied, and viewed jobs.")) {
      localStorage.removeItem("jobbie-saved-jobs");
      localStorage.removeItem("jobbie-applied-jobs");
      localStorage.removeItem("jobbie-viewed-jobs");
      window.location.reload();
    }
  }, []);

  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      try {
        const [jobsPayload, metaPayload] = await Promise.all([
          fetchJson<JobsIndexResponse>("jobs-index.json"),
          fetchJson<JobsMetaResponse>("jobs-meta.json"),
        ]);

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setJobs(jobsPayload.jobs);
          setPageSize(jobsPayload.pageSize);
          setMeta(metaPayload);
          setLoading(false);
        });
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Could not load jobs data.");
        setLoading(false);
      }
    }

    loadJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  const query = deferredSearch.trim().toLowerCase();
  const pageTitle = getTitleForFilter(filter);
  const filteredJobs = jobs.filter((job) => {
    // Hide viewed jobs unless we are in some specific view where it doesn't matter
    if (filter === "doom") {
      if (viewedIds.has(job.id)) return false;
      if (doomPreference && job.category !== doomPreference) return false;
    }

    // If it's the saved tab, only show saved ones
    if (filter === "saved") {
      if (!savedIds.includes(job.id)) return false;
      
      const isApplied = appliedIds.includes(job.id);
      if (savedSubFilter === "applied" && !isApplied) return false;
      if (savedSubFilter === "pending" && isApplied) return false;
    } else if (filter !== "doom") {
      // For other tabs, check category
      if (job.category !== filter) return false;
      // Hide applied jobs from main lists
      if (appliedIds.includes(job.id)) return false;
    }

    if (!query) return true;

    const haystack = `${job.company} ${job.role} ${job.location} ${job.applicationUrl}`.toLowerCase();
    return haystack.includes(query);
  });

  useEffect(() => {
    setPage(1);
  }, [filter, query]);

  useEffect(() => {
    if (filter !== "doom" || filteredJobs.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const topJob = filteredJobs[0];
      if (!topJob) return;

      if (e.key === "ArrowLeft") {
        markAsViewed(topJob.id);
      } else if (e.key === "ArrowRight") {
        toggleSave(topJob.id);
        markAsViewed(topJob.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filter, filteredJobs, markAsViewed, toggleSave]);

  let internships = 0;
  let newGrad = 0;
  for (const job of jobs) {
    if (job.category === "intern") {
      internships += 1;
    } else {
      newGrad += 1;
    }
  }

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageJobs = filteredJobs.slice(pageStart, pageStart + pageSize);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (filter === "doom") {
    return (
      <div className="fixed inset-0 z-[999] bg-background flex flex-col overflow-hidden select-none">
        <div className="flex-1 relative flex flex-col items-center justify-center px-6 overflow-hidden mt-8 pt-16 pb-12">
          {!doomPreference ? (
             <div className="w-full max-w-sm flex flex-col gap-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">What are you looking for?</h2>
                  <p className="text-xs text-muted-foreground/60 uppercase font-bold tracking-widest">Select a path to start swiping</p>
                </div>
                <div className="flex flex-col gap-4">
                   <button 
                     onClick={() => setDoomPreference("intern")}
                     className="group relative h-24 overflow-hidden rounded-[2rem] border border-border/50 bg-card p-6 transition-all hover:border-border hover:bg-muted/10 active:scale-95"
                   >
                     <div className="flex items-center justify-between">
                        <div className="text-left">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Student</span>
                           <h3 className="text-xl font-black uppercase tracking-tight">Internships</h3>
                        </div>
                        <ChevronRight className="h-6 w-6 text-muted-foreground/20 group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                     </div>
                   </button>
                   <button 
                     onClick={() => setDoomPreference("new_grad")}
                     className="group relative h-24 overflow-hidden rounded-[2rem] border border-border/50 bg-card p-6 transition-all hover:border-border hover:bg-muted/10 active:scale-95"
                   >
                     <div className="flex items-center justify-between">
                        <div className="text-left">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Graduate</span>
                           <h3 className="text-xl font-black uppercase tracking-tight">New Grad</h3>
                        </div>
                        <ChevronRight className="h-6 w-6 text-muted-foreground/20 group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                     </div>
                   </button>
                </div>
             </div>
          ) : (
            <>
              <div className="relative w-full max-w-[440px] aspect-[9/15] flex items-center justify-center mb-16">
                <AnimatePresence mode="popLayout">
                  {filteredJobs.slice(0, 3).reverse().map((job, idx) => {
                    const stackSize = Math.min(filteredJobs.length, 3);
                    return (
                      <DoomCard 
                        key={job.id} 
                        job={job} 
                        isTop={idx === stackSize - 1} 
                        onSwipeLeft={() => markAsViewed(job.id)}
                        onSwipeRight={() => {
                          toggleSave(job.id);
                          markAsViewed(job.id);
                        }}
                      />
                    );
                  })}
                </AnimatePresence>
                {filteredJobs.length === 0 && (
                  <div className="flex flex-col items-center gap-6 text-center animate-in fade-in zoom-in duration-500">
                     <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/10 border border-border/5">
                        <Check className="h-10 w-10 text-muted-foreground/40" />
                      </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">End of the line.</h3>
                      <p className="text-sm text-muted-foreground/60 max-w-[200px]">You've seen all the active opportunities in this category.</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="rounded-full px-8 h-12 font-black text-[10px] uppercase tracking-widest border-border/50"
                      onClick={() => setViewedIds(new Set())}
                    >
                      Reset Swipes
                    </Button>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              {filteredJobs.length > 0 && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 z-[110]">
                   <button 
                    onClick={() => {
                      const topJob = filteredJobs[0];
                      if (topJob) markAsViewed(topJob.id);
                    }}
                    className="flex h-20 w-20 items-center justify-center rounded-full border border-border/10 bg-card shadow-2xl transition-all hover:scale-110 active:scale-90 group"
                   >
                     <X className="h-10 w-10 text-red-500 group-hover:rotate-12 transition-transform" />
                   </button>
                   
                   <button 
                    onClick={() => {
                      setFilter("intern");
                      setDoomPreference(null);
                    }}
                    className="flex h-16 w-16 items-center justify-center rounded-full border border-border/10 bg-card/50 backdrop-blur-md shadow-xl transition-all hover:scale-110 active:scale-90 text-muted-foreground hover:text-foreground"
                   >
                     <Home className="h-7 w-7" />
                   </button>

                   <button 
                    onClick={() => {
                      const topJob = filteredJobs[0];
                      if (topJob) {
                        toggleSave(topJob.id);
                        markAsViewed(topJob.id);
                      }
                    }}
                    className="flex h-20 w-20 items-center justify-center rounded-full border border-border/10 bg-card shadow-2xl transition-all hover:scale-110 active:scale-90 group"
                   >
                     <Check className="h-10 w-10 text-emerald-500 group-hover:-rotate-12 transition-transform" />
                   </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-3">
        <h1 className="max-w-4xl font-inter text-4xl font-bold tracking-tight sm:text-6xl text-foreground">
          {pageTitle}
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
          The best internship and new grad software engineering roles, updated in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-card/50 p-6 backdrop-blur-sm transition-all hover:bg-card/80 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">New Today</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight">{meta?.todayJobCount ?? jobs.filter((job) => job.isPostedToday).length}</span>
            <span className="text-sm text-emerald-500 font-medium">↑ Fresh</span>
          </div>
        </div>
        <div className="rounded-2xl border bg-card/50 p-6 backdrop-blur-sm transition-all hover:bg-card/80 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Total Listings</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight">{jobs.length}</span>
            <span className="text-sm text-muted-foreground font-medium">Active</span>
          </div>
        </div>
        <div className="rounded-2xl border bg-card/50 p-6 backdrop-blur-sm transition-all hover:bg-card/80 shadow-sm flex flex-col justify-between">
          <div className="flex -space-x-2 overflow-hidden mb-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="inline-block h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
          </div>
          <p className="text-xs text-muted-foreground">Across multiple platforms</p>
        </div>
      </div>

      <div className="space-y-6 px-1">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between py-2">
            <div className="relative w-full lg:max-w-sm group">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search roles or companies..."
                className="h-12 w-full rounded-2xl border border-border/50 bg-card pl-12 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all group-hover:border-border"
              />
            </div>

            <div className="flex items-center gap-1 rounded-2xl border border-border/40 bg-card p-1 shadow-sm h-12">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setFilter(option.id)}
                  className={cn(
                    "flex-1 whitespace-nowrap rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center justify-center gap-2",
                    filter === option.id
                      ? "bg-foreground text-background shadow-md"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  {option.icon && <option.icon className="h-3 w-3" />}
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {filter === "saved" && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
               <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/30 px-2 mr-1">Status:</span>
              {(["all", "applied", "pending"] as const).map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSavedSubFilter(sub)}
                  className={cn(
                    "rounded-lg px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all",
                    savedSubFilter === sub
                      ? "border-foreground bg-foreground/5 text-foreground"
                      : "border-border/30 text-muted-foreground hover:border-border/60 hover:text-foreground"
                  )}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30 border-b border-border/10 pb-4">
          <span>{jobs.length} Opportunities</span>
          <div className="h-1 w-1 rounded-full bg-border/50" />
          <span className="text-muted-foreground/60">{filteredJobs.length} matches</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-transparent" />
            <p className="text-xs font-medium text-muted-foreground animate-pulse tracking-widest uppercase">Fetching...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center rounded-3xl border border-border bg-muted/5 mt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">{error}</p>
            <Button variant="outline" size="sm" className="rounded-xl border-border/50" onClick={() => window.location.reload()}>Try again</Button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-24 text-center animate-in fade-in zoom-in duration-500">
             <div className="mx-auto w-12 h-12 rounded-2xl bg-muted/10 flex items-center justify-center mb-4 border border-border/50">
               <Search className="h-5 w-5 text-muted-foreground/30" />
             </div>
            <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest mb-4">No results for "{search}"</p>
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-xl border-border/50 text-[10px] font-black uppercase tracking-widest"
              onClick={() => setSearch("")}
            >
              Reset Search
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {pageJobs.map((job, idx) => {
              const isSaved = savedIds.includes(job.id);
              const isApplied = appliedIds.includes(job.id);
              
              return (
                <div 
                  key={job.id} 
                  onDoubleClick={() => toggleSave(job.id)}
                  className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-border hover:bg-muted/5 animate-in fade-in slide-in-from-bottom-2 overflow-hidden min-w-0 cursor-pointer select-none"
                  style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
                >
                  {/* Visual Accent */}
                  <div className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-colors",
                    isSaved ? "bg-red-400" : "bg-border/30 group-hover:bg-slate-400"
                  )} />

                  <div className="flex-1 min-w-0 overflow-hidden flex flex-col gap-1 sm:pl-3">
                    <div className="flex items-center gap-2">
                       <h3 className="font-bold text-foreground text-sm sm:text-base tracking-tight leading-snug truncate" title={sanitizeText(job.role)}>
                        {sanitizeText(job.role)}
                      </h3>
                      {isApplied && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                      {isSaved && <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400 shrink-0" />}
                    </div>
                   
                    <div className="flex items-center gap-x-3 text-xs font-medium text-muted-foreground/60 min-w-0">
                      <span className="flex items-center gap-1.5 shrink-0">
                        <div className="h-1 w-1 rounded-full bg-slate-400/50" />
                        {sanitizeText(job.company)}
                      </span>
                      <span className="hidden sm:block text-border/40 font-light shrink-0">|</span>
                      <span className="truncate">
                        {job.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex w-full sm:w-auto shrink-0 items-center justify-between sm:justify-end gap-6 sm:gap-10 border-t sm:border-t-0 border-border/10 pt-4 sm:pt-0">
                    <div className="flex flex-col sm:items-end gap-1">
                      <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/20">Posted</span>
                      <span className="text-xs font-bold text-muted-foreground/40">{formatDate(job.postedDate)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                         onClick={(e) => { e.stopPropagation(); toggleSave(job.id); }}
                         className={cn(
                           "flex h-10 w-10 items-center justify-center rounded-xl border transition-colors",
                           isSaved ? "border-red-500/30 bg-red-500/5 text-red-400" : "border-border/50 text-muted-foreground hover:text-foreground"
                         )}
                      >
                        <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
                      </button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            className="h-10 px-8 rounded-xl bg-foreground text-background font-bold uppercase tracking-widest text-[10px] transition-transform active:scale-95 group-hover:shadow-lg group-hover:shadow-foreground/5"
                          >
                            Apply
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-2xl border-border/50 bg-card p-2 shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 duration-200">
                          <DropdownMenuItem 
                            className="flex items-center justify-between rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer focus:bg-muted/50"
                            onClick={() => window.open(job.applicationUrl, "_blank", "noopener,noreferrer")}
                          >
                            Visit Site
                            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className={cn(
                              "flex items-center justify-between rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer",
                              isApplied ? "focus:bg-red-500/10 focus:text-red-400" : "focus:bg-emerald-500/10 focus:text-emerald-500"
                            )}
                            onClick={() => toggleApplied(job.id)}
                          >
                            {isApplied ? "I didn't apply" : "I've Applied"}
                            {isApplied ? (
                              <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5 opacity-50" />
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredJobs.length > pageSize && (
          <div className="flex items-center justify-center gap-2 pt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-xl border-border/50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-4">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-xl border-border/50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex justify-center pt-24 pb-12">
            <button 
              onClick={clearAllData}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/5 hover:text-red-500/20 transition-colors"
            >
              Reset Environment
            </button>
        </div>
      </div>
    </section>
  );
}

function DoomCard({ job, isTop, onSwipeLeft, onSwipeRight }: {
  job: JobSummary;
  isTop: boolean;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  // Numeric opacity values for icons to avoid string overlap issues
  const opacityLike = useTransform(x, [50, 150], [0, 1]);
  const opacityPass = useTransform(x, [-150, -50], [1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipeRight();
    } else if (info.offset.x < -100) {
      onSwipeLeft();
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity, zIndex: isTop ? 10 : 0 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.05 }}
      exit={{ x: x.get() < 0 ? -500 : 500, opacity: 0, transition: { duration: 0.3 } }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing select-none"
    >
      <div className="relative h-full w-full overflow-hidden rounded-[3rem] border-2 border-border/50 bg-card p-8 sm:p-12 shadow-2xl flex flex-col justify-between">
        {/* Swiping Indicators */}
        <motion.div style={{ opacity: opacityLike }} className="absolute inset-0 bg-emerald-500/10 pointer-events-none flex items-center justify-center z-50 transition-colors">
            <div className="rounded-full border-4 border-emerald-400 p-8 bg-background/80 backdrop-blur-sm shadow-xl">
                <Check className="h-16 w-16 text-emerald-500" />
            </div>
        </motion.div>
        <motion.div style={{ opacity: opacityPass }} className="absolute inset-0 bg-red-500/10 pointer-events-none flex items-center justify-center z-50 transition-colors">
             <div className="rounded-full border-4 border-red-400 p-8 bg-background/80 backdrop-blur-sm shadow-xl">
                <X className="h-16 w-16 text-red-500" />
            </div>
        </motion.div>

        <div className="space-y-10 pt-4">
          <div className="space-y-3">
            <h2 className="text-[2.2rem] font-black leading-[1.1] tracking-tighter text-foreground break-words">
              {sanitizeText(job.role)}
            </h2>
          </div>

          <div className="space-y-6">
             <div className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/50" />
                <span className="text-xl font-bold text-muted-foreground/80">{sanitizeText(job.company)}</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-400/20" />
                <span className="text-base font-medium text-muted-foreground/40">{job.location}</span>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-10 border-t border-border/10">
             <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/20">Category</span>
                <span className="block text-xs font-bold text-muted-foreground/40">{job.category}</span>
             </div>
             <div className="space-y-1 text-right">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/20">Posted</span>
                <span className="block text-xs font-bold text-muted-foreground/40">{formatDate(job.postedDate)}</span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
