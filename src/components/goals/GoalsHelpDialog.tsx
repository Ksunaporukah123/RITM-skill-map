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
  SECTION_HELP_TABS,
  TABBED_GOALS_SECTIONS,
  type GoalsHelpContent,
  type GoalsHelpSection,
  type SectionHelpTab,
} from "@/lib/goals/help-content";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Filter,
  Info,
  LayoutGrid,
  Lightbulb,
  ListChecks,
  MousePointerClick,
  Shield,
  Sparkles,
  Table2,
  UserCog,
  Users,
} from "lucide-react";

interface GoalsHelpDialogProps {
  section: GoalsHelpSection;
  size?: "sm" | "md";
  className?: string;
}

const HELP_TAB_PANEL =
  "mt-3 max-h-[58vh] overflow-y-auto rounded-xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/80 p-4 shadow-inner dark:border-slate-800 dark:from-slate-950 dark:to-slate-900/50";

function HelpBlock({
  title,
  icon,
  variant = "gray",
  children,
  className,
}: {
  title: string;
  icon?: ReactNode;
  variant?: "blue" | "gray" | "blue-muted" | "white";
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border p-4 shadow-sm",
        variant === "blue" &&
          "border-sky-200/80 bg-gradient-to-br from-sky-50 via-sky-50/80 to-indigo-50/40 dark:border-sky-800 dark:from-sky-950/50 dark:to-indigo-950/20",
        variant === "blue-muted" &&
          "border-sky-100/80 bg-white/70 dark:border-sky-900/60 dark:bg-slate-950/40",
        variant === "gray" &&
          "border-slate-200/80 bg-white/80 dark:border-slate-700/80 dark:bg-slate-950/30",
        variant === "white" && "border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950/60",
        className
      )}
    >
      <div className="mb-3 flex items-center gap-2.5">
        {icon && (
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
              variant === "blue" && "bg-sky-600 text-white shadow-sm",
              variant === "blue-muted" &&
                "bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-sm",
              variant === "gray" && "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
              variant === "white" && "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            )}
          >
            {icon}
          </span>
        )}
        <h3
          className={cn(
            "text-sm font-semibold tracking-tight",
            variant === "blue" && "text-sky-900 dark:text-sky-100",
            variant === "blue-muted" && "text-slate-800 dark:text-slate-100",
            variant === "gray" && "text-slate-800 dark:text-slate-100",
            variant === "white" && "text-slate-800 dark:text-slate-100"
          )}
        >
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

function HelpHeroBanner({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow: string;
  title?: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-sky-400/30 bg-gradient-to-br from-sky-600 via-sky-600 to-indigo-600 px-5 py-4 text-white shadow-md dark:border-sky-500/30 dark:from-sky-700 dark:via-sky-700 dark:to-indigo-800">
      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 left-1/3 h-24 w-24 rounded-full bg-indigo-400/20 blur-2xl" />
      <div className="relative flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 shadow-lg ring-1 ring-white/25 backdrop-blur-sm">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-100/90">
            {eyebrow}
          </p>
          {title && (
            <p className="mt-0.5 text-base font-semibold leading-snug text-white">{title}</p>
          )}
          <p className="mt-1.5 text-sm leading-relaxed text-sky-50/95">{description}</p>
        </div>
      </div>
    </div>
  );
}

const WHAT_YOU_SEE_ICONS = [Table2, Filter, MousePointerClick, ListChecks, CheckCircle2] as const;

function WhatYouSeeGrid({ items }: { items: string[] }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {items.map((item, index) => {
        const Icon = WHAT_YOU_SEE_ICONS[index % WHAT_YOU_SEE_ICONS.length];
        return (
          <div
            key={item}
            className="group flex gap-3 rounded-lg border border-slate-200/70 bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700/70 dark:bg-slate-950/50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-100 transition-colors group-hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-400 dark:ring-sky-900">
              <Icon className="h-4 w-4" />
            </span>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{item}</p>
          </div>
        );
      })}
    </div>
  );
}

function InstructionTimeline({
  sections,
}: {
  sections: { heading: string; steps: string[] }[];
}) {
  return (
    <div className="space-y-0">
      {sections.map((section, sectionIndex) => (
        <div key={section.heading} className="relative flex gap-4 pb-8 last:pb-0">
          {sectionIndex < sections.length - 1 && (
            <span
              className="absolute left-[15px] top-9 bottom-0 w-px bg-gradient-to-b from-sky-300 via-sky-200 to-transparent dark:from-sky-700 dark:via-sky-800"
              aria-hidden
            />
          )}
          <div className="relative z-[1] flex shrink-0 flex-col items-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-sky-600 text-xs font-bold text-white shadow-md ring-4 ring-sky-100 dark:ring-sky-950">
              {sectionIndex + 1}
            </span>
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <h4 className="mb-3 text-sm font-semibold leading-snug text-slate-800 dark:text-slate-100">
              {section.heading}
            </h4>
            <div className="space-y-2">
              {section.steps.map((step, stepIndex) => (
                <div
                  key={step}
                  className="flex gap-3 rounded-lg border border-slate-200/60 bg-white px-3 py-2.5 shadow-sm dark:border-slate-700/60 dark:bg-slate-950/40"
                >
                  <span className="mt-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold tabular-nums text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {stepIndex + 1}
                  </span>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const STATUS_VISUAL: Record<string, { accent: string; badge: string; dot: string }> = {
  Черновик: {
    accent: "border-l-slate-400",
    badge: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300",
    dot: "bg-slate-400",
  },
  Разработка: {
    accent: "border-l-blue-500",
    badge: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950/50 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  "Разработка (!)": {
    accent: "border-l-amber-500",
    badge: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  Активная: {
    accent: "border-l-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  Активный: {
    accent: "border-l-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  Архивная: {
    accent: "border-l-yellow-500",
    badge: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950/50 dark:text-yellow-400",
    dot: "bg-yellow-500",
  },
  Архивный: {
    accent: "border-l-yellow-500",
    badge: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950/50 dark:text-yellow-400",
    dot: "bg-yellow-500",
  },
};

const SECTION_TAB_ICONS: Record<SectionHelpTab, ReactNode> = {
  about: <LayoutGrid className="h-3.5 w-3.5 shrink-0" />,
  "how-to": <BookOpen className="h-3.5 w-3.5 shrink-0" />,
  statuses: <Shield className="h-3.5 w-3.5 shrink-0" />,
  important: <Info className="h-3.5 w-3.5 shrink-0" />,
};

const SECTION_HERO_ICONS: Record<GoalsHelpSection, ReactNode> = {
  overview: <Sparkles className="h-5 w-5" />,
  "performance-map": <LayoutGrid className="h-5 w-5" />,
  "kpi-registry": <ListChecks className="h-5 w-5" />,
  "pfk-table": <Table2 className="h-5 w-5" />,
  delegation: <UserCog className="h-5 w-5" />,
};

const TAB_TRIGGER_ACTIVE_FIRST = cn(
  "font-semibold",
  "data-[state=inactive]:border data-[state=inactive]:border-sky-200/80 data-[state=inactive]:bg-white data-[state=inactive]:text-sky-800 data-[state=inactive]:shadow-sm",
  "dark:data-[state=inactive]:border-sky-800 dark:data-[state=inactive]:bg-slate-950/60 dark:data-[state=inactive]:text-sky-200",
  "data-[state=active]:border-sky-500 data-[state=active]:bg-gradient-to-br data-[state=active]:from-sky-500 data-[state=active]:to-sky-600 data-[state=active]:text-white data-[state=active]:shadow-md",
  "dark:data-[state=active]:from-sky-600 dark:data-[state=active]:to-sky-700"
);

const TAB_TRIGGER_ACTIVE_OTHER = cn(
  "font-medium text-slate-600 dark:text-slate-400",
  "data-[state=active]:border data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm",
  "dark:data-[state=active]:border-slate-700 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-100"
);

function StatusModelCards({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {items.map((item) => {
        const { label, description } = parseStatusLine(item);
        const visual = STATUS_VISUAL[label] ?? STATUS_VISUAL["Черновик"];
        return (
          <div
            key={item}
            className={cn(
              "rounded-xl border border-slate-200/70 border-l-4 bg-white p-4 shadow-sm dark:border-slate-700/70 dark:bg-slate-950/40",
              visual.accent
            )}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className={cn("h-2 w-2 shrink-0 rounded-full", visual.dot)} />
              <span
                className={cn(
                  "inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold",
                  visual.badge
                )}
              >
                {label}
              </span>
            </div>
            {description && (
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ImportantTipsGrid({ tips }: { tips: string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {tips.map((tip, index) => (
        <div
          key={tip}
          className="flex gap-3 rounded-xl border border-amber-200/70 bg-gradient-to-br from-amber-50/90 to-orange-50/50 p-3.5 shadow-sm dark:border-amber-900/50 dark:from-amber-950/30 dark:to-orange-950/20"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-400">
            {index === 0 ? (
              <Lightbulb className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
          </span>
          <p className="text-xs leading-relaxed text-amber-950/85 dark:text-amber-100/90">{tip}</p>
        </div>
      ))}
    </div>
  );
}

function ServiceSectionsGrid({ items }: { items: string[] }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {items.map((item) => {
        const { label, description } = parseSectionLine(item);
        return (
          <div
            key={item}
            className="rounded-lg border border-sky-100/80 bg-white p-3 shadow-sm dark:border-sky-900/50 dark:bg-slate-950/50"
          >
            <p className="text-xs font-semibold text-sky-800 dark:text-sky-200">{label}</p>
            {description && (
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TermsGrid({ terms }: { terms: { term: string; definition: string }[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {terms.map(({ term, definition }) => (
        <div
          key={term}
          className="rounded-lg border border-slate-200/80 bg-white px-3 py-2.5 shadow-sm dark:border-slate-700 dark:bg-slate-950/50"
        >
          <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {term}
          </span>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {definition}
          </p>
        </div>
      ))}
    </div>
  );
}

function RoleCards({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-2.5 rounded-lg border border-slate-200/70 bg-white px-3 py-2.5 shadow-sm dark:border-slate-700/70 dark:bg-slate-950/40"
        >
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400">
            <Users className="h-3 w-3" />
          </span>
          <span className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function StatusGroupsPanel({ groups }: { groups: { heading: string; items: string[] }[] }) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <HelpBlock
          key={group.heading}
          title={group.heading}
          icon={<Shield className="h-4 w-4" />}
          variant="white"
        >
          <ul className="space-y-2">
            {group.items.map((item) => (
              <li
                key={item}
                className="flex gap-2.5 rounded-lg border border-slate-200/60 bg-slate-50/80 px-3 py-2.5 text-xs leading-relaxed text-slate-600 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-400"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                {item}
              </li>
            ))}
          </ul>
        </HelpBlock>
      ))}
    </div>
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

function parseStatusLine(line: string): { label: string; description: string } {
  const dash = line.indexOf(" — ");
  const alt = line.indexOf(" – ");
  const sep = dash !== -1 ? dash : alt !== -1 ? alt : -1;
  if (sep === -1) return { label: line, description: "" };
  const offset = line[sep + 1] === "—" ? 3 : 2;
  return {
    label: line.slice(0, sep),
    description: line.slice(sep + offset),
  };
}

function SectionHelpAboutTab({ content, section }: { content: GoalsHelpContent; section: GoalsHelpSection }) {
  const eyebrow = section === "overview" ? "Сервис РИТМ" : "Раздел сервиса";

  return (
    <div className="space-y-5">
      <HelpHeroBanner
        eyebrow={eyebrow}
        title={content.title}
        description={content.intro}
        icon={SECTION_HERO_ICONS[section]}
      />

      {content.serviceSections && content.serviceSections.length > 0 && (
        <HelpBlock
          title="Разделы сервиса"
          icon={<LayoutGrid className="h-4 w-4" />}
          variant="blue-muted"
        >
          <ServiceSectionsGrid items={content.serviceSections} />
        </HelpBlock>
      )}

      {content.whatYouSee && content.whatYouSee.length > 0 && (
        <HelpBlock
          title={section === "overview" ? "Навигация по сервису" : "Что вы видите на экране"}
          icon={<Table2 className="h-4 w-4" />}
          variant="blue-muted"
        >
          <WhatYouSeeGrid items={content.whatYouSee} />
        </HelpBlock>
      )}
    </div>
  );
}

function SectionHelpStatusesTab({ content }: { content: GoalsHelpContent }) {
  return (
    <div className="space-y-4">
      {content.statusIntro && (
        <p className="rounded-lg border border-slate-200/80 bg-white/80 px-4 py-3 text-xs leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-400">
          {content.statusIntro}
        </p>
      )}

      {content.terms.length > 0 && (
        <HelpBlock title="Ключевые термины" icon={<BookOpen className="h-4 w-4" />} variant="gray">
          <TermsGrid terms={content.terms} />
        </HelpBlock>
      )}

      {content.roleItems && content.roleItems.length > 0 && (
        <HelpBlock title="Роли участников" icon={<Users className="h-4 w-4" />} variant="gray">
          <RoleCards items={content.roleItems} />
        </HelpBlock>
      )}

      {content.statusItems && content.statusItems.length > 0 && (
        <HelpBlock
          title={content.statusHeading ?? "Статусная модель"}
          icon={<Shield className="h-4 w-4" />}
          variant="white"
        >
          <StatusModelCards items={content.statusItems} />
        </HelpBlock>
      )}

      {content.statusGroups && content.statusGroups.length > 0 && (
        <StatusGroupsPanel groups={content.statusGroups} />
      )}
    </div>
  );
}

function SectionHelpTabsBody({
  section,
  activeTab: controlledTab,
  onTabChange: controlledOnTabChange,
  embedded = false,
}: {
  section: GoalsHelpSection;
  activeTab?: SectionHelpTab;
  onTabChange?: (tab: SectionHelpTab) => void;
  embedded?: boolean;
}) {
  const content = GOALS_HELP[section];
  const [internalTab, setInternalTab] = useState<SectionHelpTab>("about");
  const activeTab = embedded || controlledTab === undefined ? internalTab : controlledTab;
  const handleTabChange =
    embedded || controlledOnTabChange === undefined ? setInternalTab : controlledOnTabChange;

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => handleTabChange(v as SectionHelpTab)}
      className="w-full"
    >
      <TabsList
        variant="grid4"
        className="mb-1 h-auto gap-1 border-0 bg-slate-100/90 p-1.5 shadow-sm dark:bg-slate-900/80"
      >
        {SECTION_HELP_TABS.map((tab, index) => {
          const isFirst = index === 0;
          const label =
            tab.value === "about" && content.aboutTabLabel
              ? content.aboutTabLabel
              : tab.value === "statuses" && content.statusesTabLabel
                ? content.statusesTabLabel
                : tab.label;
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "flex min-w-0 w-full flex-col items-center justify-center gap-1 rounded-lg px-2 py-2.5 text-center text-xs leading-tight whitespace-normal transition-all sm:flex-row",
                isFirst ? TAB_TRIGGER_ACTIVE_FIRST : TAB_TRIGGER_ACTIVE_OTHER
              )}
            >
              {SECTION_TAB_ICONS[tab.value]}
              <span>{label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="about" className={HELP_TAB_PANEL}>
        <SectionHelpAboutTab content={content} section={section} />
      </TabsContent>

      <TabsContent value="how-to" className={HELP_TAB_PANEL}>
        {content.instructionSections && content.instructionSections.length > 0 ? (
          <div className="space-y-5">
            <div className="rounded-lg border border-sky-100 bg-sky-50/50 px-4 py-3 dark:border-sky-900/50 dark:bg-sky-950/30">
              <p className="text-xs leading-relaxed text-sky-900/90 dark:text-sky-100/90">
                Пошаговое руководство: следуйте блокам сверху вниз. В каждом блоке — пронумерованные
                действия по порядку.
              </p>
            </div>
            <InstructionTimeline sections={content.instructionSections} />
          </div>
        ) : content.howTo.length > 0 ? (
          <HelpBlock
            title="Инструкция пользователя"
            icon={<BookOpen className="h-4 w-4" />}
            variant="blue-muted"
          >
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
          </HelpBlock>
        ) : null}
      </TabsContent>

      <TabsContent value="statuses" className={HELP_TAB_PANEL}>
        <SectionHelpStatusesTab content={content} />
      </TabsContent>

      <TabsContent value="important" className={HELP_TAB_PANEL}>
        {content.tips && content.tips.length > 0 ? (
          <HelpBlock
            title={content.tipsHeading ?? "Важно помнить"}
            icon={<Lightbulb className="h-4 w-4" />}
            variant="blue"
          >
            <ImportantTipsGrid tips={content.tips} />
          </HelpBlock>
        ) : null}
      </TabsContent>
    </Tabs>
  );
}

function SectionHelpDialogContent({
  section,
  activeTab,
  onTabChange,
}: {
  section: GoalsHelpSection;
  activeTab: SectionHelpTab;
  onTabChange: (tab: SectionHelpTab) => void;
}) {
  const content = GOALS_HELP[section];

  return (
    <>
      <DialogHeader className="space-y-1 border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <DialogTitle className="text-xl font-semibold tracking-tight">{content.title}</DialogTitle>
        <p className="text-sm text-muted-foreground">
          Справка по разделу · выберите вкладку ниже
        </p>
      </DialogHeader>
      <div className="pt-4">
        <SectionHelpTabsBody section={section} activeTab={activeTab} onTabChange={onTabChange} />
      </div>
    </>
  );
}

function OverviewHelpDialogContent() {
  return (
    <>
      <DialogHeader className="border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <DialogTitle className="text-xl font-semibold tracking-tight">Справка по сервису</DialogTitle>
      </DialogHeader>

      <div className="pt-4">
        <SectionHelpTabsBody section="overview" />
      </div>
    </>
  );
}

export function GoalsHelpDialog({
  section,
  size = "sm",
  className,
}: GoalsHelpDialogProps) {
  const [open, setOpen] = useState(false);
  const [sectionSubTab, setSectionSubTab] = useState<SectionHelpTab>("about");
  const content = GOALS_HELP[section];
  const isOverviewModal = section === "overview";
  const isTabbedSectionModal =
    section !== "overview" && TABBED_GOALS_SECTIONS.includes(section);

  useEffect(() => {
    if (!open) setSectionSubTab("about");
  }, [open, section]);

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
            isOverviewModal || isTabbedSectionModal
              ? "max-h-[90vh] max-w-6xl"
              : "max-h-[90vh] max-w-lg overflow-y-auto"
          )}
        >
          {isOverviewModal ? (
            <OverviewHelpDialogContent />
          ) : isTabbedSectionModal ? (
            <SectionHelpDialogContent
              section={section}
              activeTab={sectionSubTab}
              onTabChange={setSectionSubTab}
            />
          ) : null}
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
