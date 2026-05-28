"use client";

import { useEffect, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GOALS_HELP,
  OVERVIEW_HELP_MODAL_TABS,
  type GoalsHelpContent,
  type GoalsHelpSection,
  type OverviewHelpTabValue,
} from "@/lib/goals/help-content";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Info,
  LayoutGrid,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

interface GoalsHelpDialogProps {
  section: GoalsHelpSection;
  size?: "sm" | "md";
  className?: string;
}

function HelpBlock({
  title,
  icon,
  variant = "gray",
  children,
  className,
}: {
  title: string;
  icon?: ReactNode;
  variant?: "blue" | "gray" | "blue-muted";
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border p-4",
        variant === "blue" &&
          "border-sky-200 bg-gradient-to-br from-sky-50 to-sky-100/80 dark:border-sky-800 dark:from-sky-950/40 dark:to-sky-900/20",
        variant === "blue-muted" &&
          "border-sky-100 bg-sky-50/60 dark:border-sky-900 dark:bg-sky-950/25",
        variant === "gray" &&
          "border-slate-200 bg-slate-50/90 dark:border-slate-700 dark:bg-slate-900/40",
        className
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        {icon && (
          <span
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
              variant === "blue" && "bg-sky-600 text-white shadow-sm",
              variant === "blue-muted" && "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
              variant === "gray" && "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            )}
          >
            {icon}
          </span>
        )}
        <h3
          className={cn(
            "text-sm font-semibold tracking-tight",
            variant === "blue" && "text-sky-900 dark:text-sky-100",
            variant === "blue-muted" && "text-sky-800 dark:text-sky-200",
            variant === "gray" && "text-slate-800 dark:text-slate-100"
          )}
        >
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

function parseSectionLine(line: string): { label: string; description: string } {
  const sep = line.indexOf(" — ");
  if (sep === -1) return { label: line, description: "" };
  return {
    label: line.slice(0, sep),
    description: line.slice(sep + 3),
  };
}

function OverviewHelpBody({ content }: { content: GoalsHelpContent }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-sky-300 bg-gradient-to-r from-sky-600 to-sky-500 px-4 py-3.5 text-white shadow-sm dark:border-sky-700 dark:from-sky-700 dark:to-sky-600">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-sky-100">
              Сервис РИТМ
            </p>
            <p className="mt-1 text-sm leading-relaxed text-white/95">{content.intro}</p>
          </div>
        </div>
      </div>

      {content.serviceSections && content.serviceSections.length > 0 && (
        <HelpBlock
          title="Разделы сервиса"
          icon={<LayoutGrid className="h-4 w-4" />}
          variant="blue-muted"
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {content.serviceSections.map((item) => {
              const { label, description } = parseSectionLine(item);
              return (
                <div
                  key={item}
                  className="rounded-md border border-sky-100 bg-white/80 px-3 py-2.5 dark:border-sky-900/60 dark:bg-slate-950/30"
                >
                  <p className="text-xs font-semibold text-sky-800 dark:text-sky-200">
                    {label}
                  </p>
                  {description && (
                    <p className="mt-1 text-xs leading-snug text-slate-600 dark:text-slate-400">
                      {description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </HelpBlock>
      )}

      {content.terms.length > 0 && (
        <HelpBlock
          title="Ключевые термины"
          icon={<BookOpen className="h-4 w-4" />}
          variant="gray"
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {content.terms.map(({ term, definition }) => (
              <div
                key={term}
                className="rounded-md border border-slate-200/80 bg-white px-2.5 py-2 dark:border-slate-700 dark:bg-slate-950/50"
              >
                <span className="inline-flex rounded bg-slate-200/80 px-1.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {term}
                </span>
                <p className="mt-1.5 text-xs leading-snug text-slate-600 dark:text-slate-400">
                  {definition}
                </p>
              </div>
            ))}
          </div>
        </HelpBlock>
      )}

      {content.roleItems && content.roleItems.length > 0 && (
        <HelpBlock title="Роли" icon={<Users className="h-4 w-4" />} variant="gray">
          <ul className="space-y-2">
            {content.roleItems.map((item) => (
              <li
                key={item}
                className="flex gap-2 rounded-md border border-slate-200/60 bg-white px-3 py-2 text-xs leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-400"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </HelpBlock>
      )}

      {content.importantNote && (
        <HelpBlock title="Важно помнить" icon={<Info className="h-4 w-4" />} variant="blue">
          <p className="text-sm leading-relaxed text-sky-900/90 dark:text-sky-100/90">
            {content.importantNote}
          </p>
        </HelpBlock>
      )}
    </div>
  );
}

function SectionHelpBody({
  content,
  showIntro = false,
}: {
  content: GoalsHelpContent;
  showIntro?: boolean;
}) {
  return (
    <div className="space-y-4">
      {showIntro && content.intro && (
        <div className="rounded-lg border border-sky-200 bg-sky-50/80 px-4 py-3 dark:border-sky-800 dark:bg-sky-950/30">
          <p className="text-sm leading-relaxed text-sky-900 dark:text-sky-100">
            {content.intro}
          </p>
        </div>
      )}

      {content.howTo.length > 0 && (
        <HelpBlock title="Как пользоваться" icon={<BookOpen className="h-4 w-4" />} variant="blue-muted">
          {content.howToAsBullets ? (
            <ul className="space-y-2">
              {content.howTo.map((step) => (
                <li
                  key={step}
                  className="flex gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ol className="list-decimal space-y-2 pl-4 text-xs text-slate-600 dark:text-slate-400">
              {content.howTo.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          )}
        </HelpBlock>
      )}

      {content.bulletSections?.map((block) => (
        <HelpBlock
          key={block.heading}
          title={block.heading}
          icon={<Shield className="h-4 w-4" />}
          variant="gray"
        >
          <ul className="space-y-2">
            {block.items.map((item) => (
              <li
                key={item}
                className="rounded-md border border-slate-200/60 bg-white px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-400"
              >
                {item}
              </li>
            ))}
          </ul>
        </HelpBlock>
      ))}

      {content.statusItems && content.statusItems.length > 0 && (
        <HelpBlock
          title={content.statusHeading ?? "Статусы"}
          icon={<Shield className="h-4 w-4" />}
          variant="gray"
        >
          <ul className="space-y-2">
            {content.statusItems.map((item) => (
              <li
                key={item}
                className="rounded-md border border-slate-200/60 bg-white px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-400"
              >
                {item}
              </li>
            ))}
          </ul>
        </HelpBlock>
      )}

      {content.terms.length > 0 && !content.howTo.length && (
        <HelpBlock title="Ключевые термины" variant="gray">
          <div className="grid gap-2 sm:grid-cols-2">
            {content.terms.map(({ term, definition }) => (
              <div
                key={term}
                className="rounded-md border border-slate-200/80 bg-white px-2.5 py-2 dark:border-slate-700 dark:bg-slate-950/50"
              >
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {term}
                </span>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{definition}</p>
              </div>
            ))}
          </div>
        </HelpBlock>
      )}

      {!content.importantNote && content.tips && content.tips.length > 0 && (
        <HelpBlock
          title={content.tipsHeading ?? "Важно помнить"}
          icon={<Info className="h-4 w-4" />}
          variant="blue"
        >
          <ul className="space-y-2">
            {content.tips.map((tip) => (
              <li
                key={tip}
                className="flex gap-2 text-xs leading-relaxed text-sky-900/90 dark:text-sky-100/90"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </HelpBlock>
      )}
    </div>
  );
}

function OverviewHelpDialogContent({
  activeTab,
  onTabChange,
}: {
  activeTab: OverviewHelpTabValue;
  onTabChange: (tab: OverviewHelpTabValue) => void;
}) {
  const overview = GOALS_HELP.overview;

  return (
    <>
      <DialogHeader className="pb-2">
        <DialogTitle className="text-xl">Справка по сервису</DialogTitle>
      </DialogHeader>

      <Tabs
        value={activeTab}
        onValueChange={(v) => onTabChange(v as OverviewHelpTabValue)}
        className="w-full"
      >
        <TabsList className="mb-1 flex h-auto w-full flex-wrap gap-1.5 bg-slate-100/80 p-1.5 dark:bg-slate-900/60">
          {OVERVIEW_HELP_MODAL_TABS.map((tab) => {
            const isMain = tab.value === "overview";
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "flex-none rounded-md px-2.5 py-2 text-xs leading-tight transition-all",
                  isMain
                    ? cn(
                        "font-semibold",
                        "data-[state=inactive]:border data-[state=inactive]:border-sky-200 data-[state=inactive]:bg-sky-50 data-[state=inactive]:text-sky-800",
                        "dark:data-[state=inactive]:border-sky-800 dark:data-[state=inactive]:bg-sky-950/50 dark:data-[state=inactive]:text-sky-200",
                        "data-[state=active]:border-sky-600 data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-md",
                        "dark:data-[state=active]:border-sky-500 dark:data-[state=active]:bg-sky-600"
                      )
                    : cn(
                        "font-normal text-slate-600 dark:text-slate-400",
                        "data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm",
                        "dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-100"
                      )
                )}
              >
                {isMain && (
                  <Sparkles className="mr-1 inline h-3 w-3 shrink-0 opacity-90" />
                )}
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent
          value="overview"
          className="mt-3 max-h-[52vh] overflow-y-auto rounded-lg border border-sky-100 bg-slate-50/50 p-3 dark:border-sky-900/50 dark:bg-slate-950/30"
        >
          <OverviewHelpBody content={overview} />
        </TabsContent>

        {OVERVIEW_HELP_MODAL_TABS.filter((t) => t.value !== "overview").map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="mt-3 max-h-[52vh] overflow-y-auto rounded-lg border border-slate-200 bg-slate-50/30 p-3 dark:border-slate-800 dark:bg-slate-950/20"
          >
            <SectionHelpBody content={GOALS_HELP[tab.value]} showIntro />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}

export function GoalsHelpDialog({
  section,
  size = "sm",
  className,
}: GoalsHelpDialogProps) {
  const [open, setOpen] = useState(false);
  const [overviewTab, setOverviewTab] = useState<OverviewHelpTabValue>("overview");
  const content = GOALS_HELP[section];
  const isOverviewModal = section === "overview";

  useEffect(() => {
    if (!open) setOverviewTab("overview");
  }, [open]);

  const stopTabActivation = (e: MouseEvent | KeyboardEvent) => {
    e.stopPropagation();
  };

  const openDialog = (e: MouseEvent | KeyboardEvent) => {
    stopTabActivation(e);
    if ("key" in e && e.key !== "Enter" && e.key !== " ") return;
    if ("key" in e) e.preventDefault();
    setOpen(true);
  };

  const buttonSize = size === "md" ? "h-5 w-5 text-[11px]" : "h-4 w-4 text-[9px]";

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        aria-label={`Справка: ${content.title}`}
        onClick={openDialog}
        onKeyDown={openDialog}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full border border-muted-foreground/40 bg-background font-semibold italic leading-none text-muted-foreground transition-colors hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:hover:bg-sky-950/50 dark:hover:text-sky-300",
          buttonSize,
          className
        )}
      >
        i
      </span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            "gap-0 overflow-hidden p-6",
            isOverviewModal ? "max-h-[90vh] max-w-2xl" : "max-h-[90vh] max-w-lg overflow-y-auto"
          )}
        >
          {isOverviewModal ? (
            <OverviewHelpDialogContent
              activeTab={overviewTab}
              onTabChange={setOverviewTab}
            />
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{content.title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1">
                <div className="mb-4 rounded-lg border border-sky-200 bg-sky-50/80 px-4 py-3 dark:border-sky-800 dark:bg-sky-950/30">
                  <p className="text-sm text-sky-900 dark:text-sky-100">{content.intro}</p>
                </div>
                <SectionHelpBody content={content} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function GoalsTabLabel({
  label,
  section,
}: {
  label: string;
  section: GoalsHelpSection;
}) {
  return (
    <span className="inline-flex items-center justify-center gap-1.5">
      <span>{label}</span>
      <GoalsHelpDialog section={section} />
    </span>
  );
}
