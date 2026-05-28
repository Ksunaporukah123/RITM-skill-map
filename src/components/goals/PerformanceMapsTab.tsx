"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  History,
  ListFilter,
  Search,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  GoalsStatusBadge,
  GOALS_LIFECYCLE_STATUS_LABELS,
  GOALS_LIFECYCLE_STATUS_OPTIONS,
  type GoalsLifecycleStatus,
} from "@/components/goals/GoalsStatusBadge";
import { GoalsHelpDialog } from "@/components/goals/GoalsHelpDialog";

type PerformanceMapStatus = GoalsLifecycleStatus;

interface PerformanceMapRecord {
  id: string;
  status: PerformanceMapStatus;
  goalGroup: string;
  fullName: string;
  position: string;
  ssp: string;
  vsp: string;
  period: string;
  performanceScore: number | null;
}

const BASE_PERFORMANCE_MAPS: Omit<PerformanceMapRecord, "id">[] = [
  {
    status: "draft",
    goalGroup: "HR",
    fullName: "Терпигорева Ольга Алексеевна",
    position: "начальник Департамента",
    ssp: "Департамент по работе с персоналом",
    vsp: "",
    period: "2026",
    performanceScore: null,
  },
  {
    status: "draft",
    goalGroup: "HR",
    fullName: "Терпигорева Ольга Алексеевна",
    position: "начальник Департамента",
    ssp: "Департамент по работе с персоналом",
    vsp: "",
    period: "3Q2026",
    performanceScore: null,
  },
  {
    status: "development",
    goalGroup: "HR",
    fullName: "Терпигорева Ольга Алексеевна",
    position: "начальник Департамента",
    ssp: "Департамент по работе с персоналом",
    vsp: "",
    period: "1Q2027",
    performanceScore: null,
  },
  {
    status: "draft",
    goalGroup: "Клиентские операции на финансовых рынках",
    fullName: "Терпигорева Ольга Алексеевна",
    position: "Первый Вице-Президент",
    ssp: "Руководство",
    vsp: "",
    period: "2026",
    performanceScore: null,
  },
  {
    status: "development",
    goalGroup: "Блок ИТ и ЦТ",
    fullName: "Терпигорева Ольга Алексеевна",
    position: "главный инженер разработки",
    ssp: "Департамент информационных технологий",
    vsp: "Управление открытых систем",
    period: "2026",
    performanceScore: null,
  },
  {
    status: "development",
    goalGroup: "Блок ИТ и ЦТ",
    fullName: "Терпигорева Ольга Алексеевна",
    position: "главный инженер разработки",
    ssp: "Департамент информационных технологий",
    vsp: "Управление открытых систем",
    period: "3Q2026",
    performanceScore: null,
  },
  {
    status: "active",
    goalGroup: "Блок ИТ и ЦТ",
    fullName: "Терпигорева Ольга Алексеевна",
    position: "главный инженер разработки",
    ssp: "Департамент информационных технологий",
    vsp: "Управление открытых систем",
    period: "1Q2027",
    performanceScore: null,
  },
  {
    status: "draft",
    goalGroup: "Блок ИТ и ЦТ",
    fullName: "Терпигорева Ольга Алексеевна",
    position: "специалист",
    ssp: "Департамент информационных технологий",
    vsp: "Управление открытых систем",
    period: "2026",
    performanceScore: null,
  },
  {
    status: "development",
    goalGroup: "Блок ИТ и ЦТ",
    fullName: "Терпигорева Ольга Алексеевна",
    position: "специалист",
    ssp: "Департамент информационных технологий",
    vsp: "Управление открытых систем",
    period: "3Q2026",
    performanceScore: null,
  },
  {
    status: "development-alert",
    goalGroup: "HR",
    fullName: "Терпигорева Ольга Алексеевна",
    position: "начальник Департамента",
    ssp: "Департамент по работе с персоналом",
    vsp: "",
    period: "2Q2026",
    performanceScore: null,
  },
  {
    status: "active",
    goalGroup: "Блок ИТ и ЦТ",
    fullName: "Терпигорева Ольга Алексеевна",
    position: "специалист",
    ssp: "Департамент информационных технологий",
    vsp: "Управление открытых систем",
    period: "1Q2027",
    performanceScore: null,
  },
];

const TOTAL_RECORDS = 375;

const MOCK_PERFORMANCE_MAPS: PerformanceMapRecord[] = Array.from(
  { length: TOTAL_RECORDS },
  (_, i) => ({
    id: String(i + 1),
    ...BASE_PERFORMANCE_MAPS[i % BASE_PERFORMANCE_MAPS.length],
  })
);

const wrapCell =
  "align-top py-3 text-sm whitespace-normal break-words leading-snug";

function getPaginationItems(
  current: number,
  total: number
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    const items: (number | "ellipsis")[] = [];
    for (let p = 1; p <= Math.min(5, total); p++) items.push(p);
    if (total > 6) {
      items.push("ellipsis");
      items.push(total);
    }
    return items;
  }
  if (current >= total - 3) {
    return [
      1,
      "ellipsis",
      total - 4,
      total - 3,
      total - 2,
      total - 1,
      total,
    ];
  }
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

function toggleSetValue<T>(set: Set<T>, value: T, checked: boolean): Set<T> {
  const next = new Set(set);
  if (checked) next.add(value);
  else next.delete(value);
  return next;
}

function ColumnFilterHead({
  label,
  className,
  options,
  selected,
  onSelectedChange,
  formatOption = (v) => String(v),
  requiredMark,
}: {
  label: React.ReactNode;
  className?: string;
  options: string[];
  selected: Set<string>;
  onSelectedChange: (next: Set<string>) => void;
  formatOption?: (value: string) => string;
  requiredMark?: boolean;
}) {
  const isActive = selected.size > 0;

  return (
    <TableHead className={cn("text-xs font-medium text-muted-foreground", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex w-full items-start gap-1 whitespace-normal leading-snug text-left hover:text-foreground"
          >
            <span>
              {label}
              {requiredMark && <span className="text-destructive">*</span>}
            </span>
            <ListFilter
              className={cn(
                "h-3.5 w-3.5 shrink-0 mt-0.5",
                isActive ? "text-primary opacity-100" : "opacity-60"
              )}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto w-56">
          <DropdownMenuLabel className="text-xs">Фильтр</DropdownMenuLabel>
          <DropdownMenuItem
            className="text-xs"
            onSelect={(e) => {
              e.preventDefault();
              onSelectedChange(new Set(options));
            }}
          >
            Выбрать все
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-xs"
            onSelect={(e) => {
              e.preventDefault();
              onSelectedChange(new Set());
            }}
          >
            Сбросить
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option}
              className="text-xs"
              checked={selected.size === 0 || selected.has(option)}
              onCheckedChange={(checked) => {
                if (selected.size === 0) {
                  const all = new Set(options);
                  all.delete(option);
                  onSelectedChange(checked ? new Set(options) : all);
                  return;
                }
                onSelectedChange(toggleSetValue(selected, option, checked === true));
              }}
              onSelect={(e) => e.preventDefault()}
            >
              {formatOption(option)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </TableHead>
  );
}

function ColumnSearchHead({
  label,
  className,
  value,
  onChange,
  placeholder = "Поиск...",
}: {
  label: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const isActive = value.trim().length > 0;

  return (
    <TableHead className={cn("text-xs font-medium text-muted-foreground", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex w-full items-start gap-1 whitespace-normal leading-snug text-left hover:text-foreground"
          >
            <span>{label}</span>
            <Search
              className={cn(
                "h-3.5 w-3.5 shrink-0 mt-0.5",
                isActive ? "text-primary opacity-100" : "opacity-60"
              )}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-56 p-2"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuLabel className="text-xs">Поиск</DropdownMenuLabel>
          <div className="relative px-1 pb-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="h-8 pl-8 text-xs"
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
          {isActive && (
            <DropdownMenuItem
              className="text-xs"
              onSelect={(e) => {
                e.preventDefault();
                onChange("");
              }}
            >
              Сбросить
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </TableHead>
  );
}

const UNIQUE_FILTER_OPTIONS = {
  statuses: GOALS_LIFECYCLE_STATUS_OPTIONS.map((s) => ({
    value: s,
    label: GOALS_LIFECYCLE_STATUS_LABELS[s],
  })),
  goalGroups: [...new Set(MOCK_PERFORMANCE_MAPS.map((r) => r.goalGroup))].sort(),
  ssps: [...new Set(MOCK_PERFORMANCE_MAPS.map((r) => r.ssp))].sort(),
  vsps: [...new Set(MOCK_PERFORMANCE_MAPS.map((r) => r.vsp || ""))].sort(),
  periods: [...new Set(MOCK_PERFORMANCE_MAPS.map((r) => r.period))].sort(),
};

export function PerformanceMapsTab() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set());
  const [goalGroupFilter, setGoalGroupFilter] = useState<Set<string>>(new Set());
  const [sspFilter, setSspFilter] = useState<Set<string>>(new Set());
  const [vspFilter, setVspFilter] = useState<Set<string>>(new Set());
  const [periodFilter, setPeriodFilter] = useState<Set<string>>(new Set());
  const [fullNameSearch, setFullNameSearch] = useState("");
  const [positionSearch, setPositionSearch] = useState("");

  const filteredData = useMemo(() => {
    const nameQuery = fullNameSearch.trim().toLowerCase();
    const positionQuery = positionSearch.trim().toLowerCase();

    return MOCK_PERFORMANCE_MAPS.filter((record) => {
      if (statusFilter.size > 0 && !statusFilter.has(record.status)) return false;
      if (goalGroupFilter.size > 0 && !goalGroupFilter.has(record.goalGroup)) return false;
      if (sspFilter.size > 0 && !sspFilter.has(record.ssp)) return false;
      if (vspFilter.size > 0 && !vspFilter.has(record.vsp || "")) return false;
      if (periodFilter.size > 0 && !periodFilter.has(record.period)) return false;
      if (nameQuery && !record.fullName.toLowerCase().includes(nameQuery)) return false;
      if (positionQuery && !record.position.toLowerCase().includes(positionQuery)) return false;
      return true;
    });
  }, [
    statusFilter,
    goalGroupFilter,
    sspFilter,
    vspFilter,
    periodFilter,
    fullNameSearch,
    positionSearch,
  ]);

  const totalRecords = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));
  const effectivePage = Math.min(currentPage, totalPages);
  const startIndex = (effectivePage - 1) * itemsPerPage;
  const pageData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const paginationItems = useMemo(
    () => getPaginationItems(effectivePage, totalPages),
    [effectivePage, totalPages]
  );

  const allPageSelected =
    pageData.length > 0 && pageData.every((r) => selectedIds.has(r.id));

  const toggleAllPage = (checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      pageData.forEach((r) => {
        if (checked) next.add(r.id);
        else next.delete(r.id);
      });
      return next;
    });
  };

  const toggleRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-0">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-wide uppercase">
              КАРТЫ РЕЗУЛЬТАТИВНОСТИ
            </h2>
            <GoalsHelpDialog section="performance-map" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1 text-xs font-normal">
                  Действия с КР...
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Утвердить выбранные</DropdownMenuItem>
                <DropdownMenuItem>Отправить на доработку</DropdownMenuItem>
                <DropdownMenuItem>Экспорт выбранных</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <Download className="h-4 w-4" />
              Экспорт
            </Button>
            <Button size="sm" className="h-8">
              + Создать
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="table-fixed min-w-[1280px]">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 border-b">
                <TableHead className="w-10 pl-4">
                  <Checkbox
                    checked={allPageSelected}
                    onCheckedChange={(v) => toggleAllPage(v === true)}
                    aria-label="Выбрать все на странице"
                  />
                </TableHead>
                <ColumnFilterHead
                  className="w-[100px]"
                  label="Статус"
                  options={UNIQUE_FILTER_OPTIONS.statuses.map((s) => s.value)}
                  selected={statusFilter}
                  onSelectedChange={(next) => {
                    setStatusFilter(next);
                    setCurrentPage(1);
                  }}
                  formatOption={(v) =>
                    GOALS_LIFECYCLE_STATUS_LABELS[v as PerformanceMapStatus] ?? v
                  }
                />
                <ColumnFilterHead
                  className="w-[150px]"
                  label="Группа целеполагания"
                  requiredMark
                  options={UNIQUE_FILTER_OPTIONS.goalGroups}
                  selected={goalGroupFilter}
                  onSelectedChange={(next) => {
                    setGoalGroupFilter(next);
                    setCurrentPage(1);
                  }}
                />
                <ColumnSearchHead
                  className="w-[200px]"
                  label="ФИО"
                  value={fullNameSearch}
                  onChange={(v) => {
                    setFullNameSearch(v);
                    setCurrentPage(1);
                  }}
                  placeholder="Поиск по ФИО..."
                />
                <ColumnSearchHead
                  className="w-[130px]"
                  label="Должность"
                  value={positionSearch}
                  onChange={(v) => {
                    setPositionSearch(v);
                    setCurrentPage(1);
                  }}
                  placeholder="Поиск по должности..."
                />
                <ColumnFilterHead
                  className="w-[200px]"
                  label="ССП"
                  options={UNIQUE_FILTER_OPTIONS.ssps}
                  selected={sspFilter}
                  onSelectedChange={(next) => {
                    setSspFilter(next);
                    setCurrentPage(1);
                  }}
                />
                <ColumnFilterHead
                  className="w-[150px]"
                  label="ВСП"
                  options={UNIQUE_FILTER_OPTIONS.vsps}
                  selected={vspFilter}
                  onSelectedChange={(next) => {
                    setVspFilter(next);
                    setCurrentPage(1);
                  }}
                  formatOption={(v) => (v ? v : "—")}
                />
                <ColumnFilterHead
                  className="w-[72px]"
                  label="Период"
                  options={UNIQUE_FILTER_OPTIONS.periods}
                  selected={periodFilter}
                  onSelectedChange={(next) => {
                    setPeriodFilter(next);
                    setCurrentPage(1);
                  }}
                />
                <TableHead className="w-[120px] text-xs font-medium text-muted-foreground">
                  <span className="whitespace-normal leading-snug">
                    Оценка результативности, %
                  </span>
                </TableHead>
                <TableHead className="w-[100px] text-xs font-medium text-muted-foreground text-center pr-4">
                  Действие
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="py-10 text-center text-muted-foreground text-sm"
                  >
                    Нет записей по выбранным фильтрам
                  </TableCell>
                </TableRow>
              ) : (
              pageData.map((record) => (
                <TableRow key={record.id} className="hover:bg-muted/20">
                  <TableCell className="pl-4">
                    <Checkbox
                      checked={selectedIds.has(record.id)}
                      onCheckedChange={(v) => toggleRow(record.id, v === true)}
                      aria-label={`Выбрать ${record.fullName}`}
                    />
                  </TableCell>
                  <TableCell className={cn("w-[100px]", wrapCell)}>
                    <GoalsStatusBadge status={record.status} />
                  </TableCell>
                  <TableCell className={cn("w-[150px]", wrapCell)}>
                    {record.goalGroup}
                  </TableCell>
                  <TableCell className={cn("w-[200px]", wrapCell)}>
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 hover:underline text-left whitespace-normal"
                    >
                      {record.fullName}
                    </button>
                  </TableCell>
                  <TableCell className={cn("w-[130px]", wrapCell)}>
                    {record.position}
                  </TableCell>
                  <TableCell className={cn("w-[200px] text-muted-foreground", wrapCell)}>
                    {record.ssp}
                  </TableCell>
                  <TableCell className={cn("w-[150px] text-muted-foreground", wrapCell)}>
                    {record.vsp || ""}
                  </TableCell>
                  <TableCell className={cn("w-[72px]", wrapCell)}>
                    {record.period}
                  </TableCell>
                  <TableCell className={cn("w-[120px] text-muted-foreground", wrapCell)}>
                    {record.performanceScore != null ? `${record.performanceScore}%` : ""}
                  </TableCell>
                  <TableCell className="w-[100px] align-top py-3 pr-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 border-blue-200 text-blue-600 hover:bg-blue-50"
                        aria-label="История"
                      >
                        <History className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 border-red-200 text-red-600 hover:bg-red-50"
                        aria-label="Удалить"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm">
          <span className="text-muted-foreground">Всего {totalRecords}</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={effectivePage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {paginationItems.map((item, idx) =>
              item === "ellipsis" ? (
                <span key={`e-${idx}`} className="px-1 text-muted-foreground">
                  ...
                </span>
              ) : (
                <Button
                  key={item}
                  variant={item === effectivePage ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-8 w-8 text-xs",
                    item === effectivePage && "pointer-events-none"
                  )}
                  onClick={() => setCurrentPage(item)}
                >
                  {item}
                </Button>
              )
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={effectivePage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(v) => {
              setItemsPerPage(Number(v));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10/на стран...</SelectItem>
              <SelectItem value="20">20/на стран...</SelectItem>
              <SelectItem value="50">50/на стран...</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
