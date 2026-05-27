"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  BookOpen,
  ClipboardList,
  GitBranch,
  Info,
  Layers,
  ListChecks,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  GOALS_HELP_DIALOG_TABS,
  GOALS_HELP_SECTIONS,
  type GoalsHelpSection,
  type GoalsHelpSectionId,
} from "@/lib/goals/help-content";

const INFO_BUTTON_CLASS =
  "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-muted-foreground/40 bg-background text-[10px] font-semibold leading-none text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

const TAB_ACCENT: Record<
  GoalsHelpSectionId,
  { icon: LucideIcon; chip: string; hero: string; ring: string }
> = {
  overview: {
    icon: BookOpen,
    chip: "bg-primary/15 text-primary",
    hero: "from-primary/10 via-primary/5 to-background",
    ring: "ring-primary/20",
  },
  "performance-map": {
    icon: ClipboardList,
    chip: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
    hero: "from-blue-500/10 via-blue-500/5 to-background",
    ring: "ring-blue-500/20",
  },
  "kpi-registry": {
    icon: Layers,
    chip: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
    hero: "from-violet-500/10 via-violet-500/5 to-background",
    ring: "ring-violet-500/20",
  },
  "pfk-table": {
    icon: GitBranch,
    chip: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    hero: "from-emerald-500/10 via-emerald-500/5 to-background",
    ring: "ring-emerald-500/20",
  },
  delegation: {
    icon: Users,
    chip: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
    hero: "from-amber-500/10 via-amber-500/5 to-background",
    ring: "ring-amber-500/20",
  },
};

type BlockVariant = "terms" | "howto" | "status" | "sections" | "roles" | "important" | "default";

function getBlockVariant(heading: string): BlockVariant {
  const h = heading.toLowerCase();
  if (h.includes("ключев")) return "terms";
  if (h.includes("как пользов")) return "howto";
  if (h.includes("статус")) return "status";
  if (h.includes("раздел")) return "sections";
  if (h.includes("рол")) return "roles";
  if (h.includes("важно")) return "important";
  return "default";
}

const BLOCK_STYLES: Record<
  BlockVariant,
  { card: string; border: string; title: string; icon: LucideIcon }
> = {
  terms: {
    card: "bg-blue-50/90 dark:bg-blue-950/25",
    border: "border-l-blue-500",
    title: "text-blue-900 dark:text-blue-200",
    icon: BookOpen,
  },
  howto: {
    card: "bg-slate-50/90 dark:bg-slate-900/40",
    border: "border-l-slate-500",
    title: "text-slate-900 dark:text-slate-200",
    icon: ListChecks,
  },
  status: {
    card: "bg-amber-50/90 dark:bg-amber-950/20",
    border: "border-l-amber-500",
    title: "text-amber-900 dark:text-amber-200",
    icon: Info,
  },
  sections: {
    card: "bg-violet-50/90 dark:bg-violet-950/25",
    border: "border-l-violet-500",
    title: "text-violet-900 dark:text-violet-200",
    icon: Layers,
  },
  roles: {
    card: "bg-indigo-50/90 dark:bg-indigo-950/25",
    border: "border-l-indigo-500",
    title: "text-indigo-900 dark:text-indigo-200",
    icon: Users,
  },
  important: {
    card: "bg-orange-50/90 dark:bg-orange-950/20",
    border: "border-l-orange-500",
    title: "text-orange-900 dark:text-orange-200",
    icon: AlertCircle,
  },
  default: {
    card: "bg-muted/50",
    border: "border-l-muted-foreground/40",
    title: "text-foreground",
    icon: Info,
  },
};

function HelpContentBlock({
  heading,
  paragraphs,
  bullets,
}: {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}) {
  const variant = getBlockVariant(heading);
  const style = BLOCK_STYLES[variant];
  const Icon = style.icon;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-border/60 shadow-sm",
        style.card,
        "border-l-4",
        style.border
      )}
    >
      <div className="flex items-center gap-2 border-b border-border/40 bg-white/40 px-4 py-2.5 dark:bg-white/5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-background/80 shadow-sm">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <h3 className={cn("text-sm font-semibold", style.title)}>{heading}</h3>
      </div>
      <div className="space-y-2 px-4 py-3">
        {paragraphs?.map((p) => (
          <p key={p} className="text-sm leading-relaxed text-muted-foreground">
            {p}
          </p>
        ))}
        {bullets && (
          <ul className="space-y-2">
            {bullets.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm leading-relaxed text-foreground/90"
              >
                <span
                  className={cn(
                    "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                    variant === "important"
                      ? "bg-orange-500"
                      : variant === "howto"
                        ? "bg-slate-500"
                        : "bg-primary/70"
                  )}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function GoalsHelpSectionBody({
  content,
  includeKeyTerms = true,
}: {
  content: GoalsHelpSection;
  /** Блок «Ключевые термины» только на вкладке «Целеполагание» */
  includeKeyTerms?: boolean;
}) {
  const sections = includeKeyTerms
    ? content.sections
    : content.sections.filter((block) => block.heading !== "Ключевые термины");

  return (
    <div className="space-y-3">
      {sections.map((block) => (
        <HelpContentBlock
          key={block.heading}
          heading={block.heading}
          paragraphs={block.paragraphs}
          bullets={block.bullets}
        />
      ))}
    </div>
  );
}

function GoalsHelpTabHero({ sectionId, content }: { sectionId: GoalsHelpSectionId; content: GoalsHelpSection }) {
  const accent = TAB_ACCENT[sectionId];
  const Icon = accent.icon;

  return (
    <div
      className={cn(
        "mb-4 overflow-hidden rounded-xl border bg-gradient-to-br p-4 shadow-sm ring-1 ring-inset",
        accent.hero,
        accent.ring
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm",
            accent.chip
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            {content.title}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {content.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

export function GoalsSectionHelpButton({
  sectionId,
  className,
  label,
}: {
  sectionId: GoalsHelpSectionId;
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const content = GOALS_HELP_SECTIONS[sectionId];
  const ariaLabel = label ?? `Справка: ${content.title}`;

  return (
    <>
      <button
        type="button"
        className={cn(INFO_BUTTON_CLASS, className)}
        aria-label={ariaLabel}
        title={ariaLabel}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        i
      </button>
      <GoalsSectionHelpDialog
        sectionId={sectionId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

export function GoalsSectionHelpDialog({
  sectionId,
  open,
  onOpenChange,
}: {
  sectionId: GoalsHelpSectionId;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isOverviewHub = sectionId === "overview";
  const [activeTab, setActiveTab] = useState<GoalsHelpSectionId>("overview");

  useEffect(() => {
    if (open) {
      setActiveTab(isOverviewHub ? "overview" : sectionId);
    }
  }, [open, sectionId, isOverviewHub]);

  const singleContent = GOALS_HELP_SECTIONS[sectionId];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex max-h-[88vh] flex-col gap-0 overflow-hidden p-0",
          isOverviewHub
            ? "w-[min(44rem,calc(100vw-2rem))] max-w-none"
            : "w-[min(42rem,calc(100vw-2rem))] max-w-none"
        )}
      >
        {isOverviewHub ? (
          <>
            <div className="shrink-0 border-b bg-gradient-to-r from-primary/10 via-background to-blue-500/5 px-6 py-4">
              <DialogHeader className="space-y-1 text-left">
                <DialogTitle className="text-lg">Справка по сервису</DialogTitle>
                <DialogDescription>
                  Выберите раздел — термины, инструкции и подсказки по работе в ЦОР
                </DialogDescription>
              </DialogHeader>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as GoalsHelpSectionId)}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="shrink-0 border-b bg-muted/30 px-4 py-3">
                <TabsList
                  variant="grid5"
                  className="h-auto w-full gap-1 bg-muted/50 p-1 [&_[data-slot=tabs-trigger]]:h-auto [&_[data-slot=tabs-trigger]]:whitespace-normal [&_[data-slot=tabs-trigger]]:px-1 [&_[data-slot=tabs-trigger]]:py-2 [&_[data-slot=tabs-trigger]]:text-[10px] [&_[data-slot=tabs-trigger]]:leading-tight sm:[&_[data-slot=tabs-trigger]]:text-[11px]"
                >
                  {GOALS_HELP_DIALOG_TABS.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto bg-muted/20 px-4 py-4 sm:px-5">
                {GOALS_HELP_DIALOG_TABS.map((tab) => {
                  const tabContent = GOALS_HELP_SECTIONS[tab.id];
                  return (
                    <TabsContent
                      key={tab.id}
                      value={tab.id}
                      className="mt-0 focus-visible:outline-none"
                    >
                      <GoalsHelpTabHero sectionId={tab.id} content={tabContent} />
                      <GoalsHelpSectionBody
                        content={tabContent}
                        includeKeyTerms={tab.id === "overview"}
                      />
                    </TabsContent>
                  );
                })}
              </div>
            </Tabs>
          </>
        ) : (
          <div className="max-h-[85vh] overflow-y-auto p-6">
            <GoalsHelpTabHero sectionId={sectionId} content={singleContent} />
            <GoalsHelpSectionBody
              content={singleContent}
              includeKeyTerms={sectionId === "overview"}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
