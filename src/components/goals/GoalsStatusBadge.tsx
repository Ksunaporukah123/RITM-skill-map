"use client";

import { cn } from "@/lib/utils";

export type GoalsLifecycleStatus =
  | "active"
  | "draft"
  | "development"
  | "development-alert";

export const GOALS_LIFECYCLE_STATUS_LABELS: Record<GoalsLifecycleStatus, string> = {
  active: "Активный",
  draft: "Черновик",
  development: "Разработка",
  "development-alert": "Разработка (!)",
};

const STATUS_CLASS: Record<GoalsLifecycleStatus, string> = {
  active:
    "bg-green-100 text-green-700 border-green-300 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800",
  draft:
    "bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800/60 dark:text-gray-300 dark:border-gray-600",
  development:
    "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
  "development-alert":
    "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-800",
};

const BADGE_BASE =
  "inline-flex min-w-[88px] items-center justify-center rounded border px-2 py-0.5 text-xs font-medium leading-tight whitespace-nowrap";

export function GoalsStatusBadge({
  status,
  className,
}: {
  status: GoalsLifecycleStatus;
  className?: string;
}) {
  return (
    <span className={cn(BADGE_BASE, STATUS_CLASS[status], className)}>
      {GOALS_LIFECYCLE_STATUS_LABELS[status]}
    </span>
  );
}

export const GOALS_LIFECYCLE_STATUS_OPTIONS: GoalsLifecycleStatus[] = [
  "active",
  "draft",
  "development",
  "development-alert",
];
