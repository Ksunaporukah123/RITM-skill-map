"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Inbox,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface KpiResponsibleEmployee {
  id: string;
  fullName: string;
  position: string;
  goalGroup: string;
  department: string;
}

const MOCK_EMPLOYEES: KpiResponsibleEmployee[] = [
  {
    id: "emp-antonenko",
    fullName: "Антоненко Ксения Павловна",
    position: "специалист",
    goalGroup: "Блок ИТ и ЦТ (Участник)",
    department:
      "Департамент автоматизации внутренних сервисов/Управление развития общекорпоративных систем / Отдел систем подбора и развития персонала",
  },
  {
    id: "emp-ivanov",
    fullName: "Иванов Иван Иванович",
    position: "Ведущий разработчик",
    goalGroup: "Блок ИТ и ЦТ (Участник)",
    department: "Департамент информационных технологий",
  },
  {
    id: "emp-petrova",
    fullName: "Петрова Анна Сергеевна",
    position: "Менеджер проектов",
    goalGroup: "Малый и средний бизнес (Участник)",
    department: "Управление проектами",
  },
  {
    id: "emp-sidorov",
    fullName: "Сидоров Алексей Петрович",
    position: "Аналитик данных",
    goalGroup: "Блок ИТ и ЦТ (Участник)",
    department: "Департамент аналитики",
  },
  {
    id: "emp-kozlova",
    fullName: "Козлова Мария Александровна",
    position: "HR-специалист",
    goalGroup: "Розничный бизнес (Участник)",
    department: "Управление персоналом",
  },
];

const DEPARTMENTS = [
  "Аналитический департамент",
  "Аппарат Правления",
  "Департамент автоматизации внутренних сервисов",
  "Департамент информационных технологий",
  "Департамент корпоративного кредитования",
  "Департамент розничного бизнеса",
  "Управление развития общекорпоративных систем",
  "Управление проектами",
];

function searchEmployees(query: string): KpiResponsibleEmployee[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return MOCK_EMPLOYEES.filter(
    (e) =>
      e.fullName.toLowerCase().includes(q) ||
      e.position.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q)
  );
}

function filterDepartments(query: string): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return DEPARTMENTS;
  return DEPARTMENTS.filter((d) => d.toLowerCase().includes(q));
}

function employeesByDepartment(dept: string): KpiResponsibleEmployee[] {
  return MOCK_EMPLOYEES.filter((e) =>
    e.department.toLowerCase().includes(dept.toLowerCase().split(" ")[0] ?? "")
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
      <Inbox className="mb-2 h-12 w-12 text-sky-400/70" />
      <span className="text-sm">Нет данных</span>
    </div>
  );
}

function EmployeeTable({
  employees,
  selectedIds,
  onToggle,
  onToggleAll,
  allSelected,
}: {
  employees: KpiResponsibleEmployee[];
  selectedIds: Set<string>;
  onToggle: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  allSelected: boolean;
}) {
  if (employees.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-auto max-h-[280px]">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(v) => onToggleAll(v === true)}
                aria-label="Выбрать все"
              />
            </TableHead>
            <TableHead className="text-xs">ФИО Сотрудника</TableHead>
            <TableHead className="text-xs">Должность</TableHead>
            <TableHead className="text-xs">Группа целеполагания</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((emp) => (
            <TableRow key={emp.id} className="hover:bg-muted/30">
              <TableCell>
                <Checkbox
                  checked={selectedIds.has(emp.id)}
                  onCheckedChange={(v) => onToggle(emp.id, v === true)}
                  aria-label={`Выбрать ${emp.fullName}`}
                />
              </TableCell>
              <TableCell className="text-xs">{emp.fullName}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {emp.position}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {emp.goalGroup}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface EmployeeSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: KpiResponsibleEmployee | null;
  onSave: (employee: KpiResponsibleEmployee | null) => void;
}

export function EmployeeSelectModal({
  open,
  onOpenChange,
  value,
  onSave,
}: EmployeeSelectModalProps) {
  const [searchTab, setSearchTab] = useState<"department" | "fio">("department");
  const [departmentQuery, setDepartmentQuery] = useState("");
  const [fioQuery, setFioQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [foundEmployees, setFoundEmployees] = useState<KpiResponsibleEmployee[]>(
    []
  );
  const [stagingSelected, setStagingSelected] = useState<KpiResponsibleEmployee[]>(
    []
  );
  const [checkedFound, setCheckedFound] = useState<Set<string>>(new Set());
  const [checkedStaging, setCheckedStaging] = useState<Set<string>>(new Set());

  const filteredDepartments = useMemo(
    () => filterDepartments(departmentQuery),
    [departmentQuery]
  );

  useEffect(() => {
    if (open) {
      setSearchTab("fio");
      setDepartmentQuery("");
      setFioQuery("");
      setSelectedDepartment(null);
      setFoundEmployees([]);
      setStagingSelected(value ? [value] : []);
      setCheckedFound(new Set());
      setCheckedStaging(new Set());
    }
  }, [open, value]);

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
  };

  const handleDepartmentSearch = () => {
    setSelectedDepartment(null);
    setFoundEmployees([]);
    setCheckedFound(new Set());
  };

  const handleSelectDepartment = (dept: string) => {
    setSelectedDepartment(dept);
    setFoundEmployees(employeesByDepartment(dept));
    setCheckedFound(new Set());
  };

  const handleFioSearch = () => {
    setFoundEmployees(searchEmployees(fioQuery));
    setCheckedFound(new Set());
  };

  const moveToSelected = () => {
    const toAdd = foundEmployees.filter((e) => checkedFound.has(e.id));
    if (toAdd.length === 0) return;
    setStagingSelected((prev) => {
      const ids = new Set(prev.map((e) => e.id));
      const merged = [...prev];
      toAdd.forEach((e) => {
        if (!ids.has(e.id)) merged.push(e);
      });
      return merged;
    });
    setCheckedFound(new Set());
  };

  const removeFromSelected = () => {
    setStagingSelected((prev) =>
      prev.filter((e) => !checkedStaging.has(e.id))
    );
    setCheckedStaging(new Set());
  };

  const handleSave = () => {
    onSave(stagingSelected[0] ?? null);
    onOpenChange(false);
  };

  const allFoundChecked =
    foundEmployees.length > 0 &&
    foundEmployees.every((e) => checkedFound.has(e.id));

  const allStagingChecked =
    stagingSelected.length > 0 &&
    stagingSelected.every((e) => checkedStaging.has(e.id));

  const toggleFound = (id: string, checked: boolean) => {
    setCheckedFound((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleStaging = (id: string, checked: boolean) => {
    setCheckedStaging((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const canMoveToSelected = checkedFound.size > 0;
  const canRemoveFromSelected = checkedStaging.size > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[min(1200px,98vw)] max-w-[min(1200px,98vw)] flex-col gap-0 overflow-hidden p-0 z-[60]">
        <DialogTitle className="sr-only">Выбор сотрудника</DialogTitle>

        <Tabs
          value={searchTab}
          onValueChange={(v) => setSearchTab(v as "department" | "fio")}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="shrink-0 border-b px-4 pt-4">
            <TabsList className="h-9 w-full justify-start gap-0 bg-transparent p-0">
              <TabsTrigger
                value="department"
                className="rounded-none rounded-t-md border border-b-0 px-4 text-xs data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=inactive]:bg-muted/40"
              >
                Поиск по департаментам и структуре
              </TabsTrigger>
              <TabsTrigger
                value="fio"
                className="rounded-none rounded-t-md border border-b-0 border-l-0 px-4 text-xs data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=inactive]:bg-muted/40"
              >
                Поиск по ФИО сотрудника
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="department"
            className="mt-0 flex flex-1 flex-col overflow-hidden data-[state=inactive]:hidden"
          >
            <div className="flex flex-wrap items-center gap-2 border-b bg-muted/20 px-4 py-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={departmentQuery}
                  onChange={(e) => setDepartmentQuery(e.target.value)}
                  placeholder="Введите название подразделения"
                  className="h-9 pl-9"
                  onKeyDown={(e) => e.key === "Enter" && handleDepartmentSearch()}
                />
              </div>
              <Button type="button" size="sm" onClick={handleDepartmentSearch}>
                Найти
              </Button>
            </div>
            <div className="flex items-center gap-1 border-b px-4 py-2 text-xs text-muted-foreground">
              <span>ГПБ АО</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">ГПБ (АО) (Головной офис)</span>
              {selectedDepartment && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-foreground">{selectedDepartment}</span>
                </>
              )}
            </div>
            <div className="grid flex-1 min-h-0 grid-cols-[220px_1fr_1fr] gap-0 overflow-hidden">
              <div className="overflow-y-auto border-r bg-background p-2">
                {filteredDepartments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => handleSelectDepartment(dept)}
                    className={cn(
                      "mb-0.5 w-full rounded px-2 py-1.5 text-left text-xs hover:bg-muted",
                      selectedDepartment === dept && "bg-sky-100 text-sky-900"
                    )}
                  >
                    {dept}
                  </button>
                ))}
              </div>
              <EmployeePanel
                title="Найденные сотрудники"
                employees={foundEmployees}
                selectedIds={checkedFound}
                onToggle={toggleFound}
                onToggleAll={(checked) => {
                  if (checked) setCheckedFound(new Set(foundEmployees.map((e) => e.id)));
                  else setCheckedFound(new Set());
                }}
                allSelected={allFoundChecked}
                footer={
                  <Button
                    type="button"
                    size="sm"
                    className="gap-1.5"
                    disabled={!canMoveToSelected}
                    onClick={moveToSelected}
                  >
                    Выбрать сотрудников
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                }
              />
              <EmployeePanel
                title="Выбранные сотрудники"
                employees={stagingSelected}
                selectedIds={checkedStaging}
                onToggle={toggleStaging}
                onToggleAll={(checked) => {
                  if (checked)
                    setCheckedStaging(new Set(stagingSelected.map((e) => e.id)));
                  else setCheckedStaging(new Set());
                }}
                allSelected={allStagingChecked}
                footer={
                  <div className="flex w-full items-center justify-between gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="gap-1.5"
                      disabled={!canRemoveFromSelected}
                      onClick={removeFromSelected}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Убрать из списка
                    </Button>
                    <Button type="button" size="sm" onClick={handleSave}>
                      Сохранить
                    </Button>
                  </div>
                }
                borderLeft
              />
            </div>
          </TabsContent>

          <TabsContent
            value="fio"
            className="mt-0 flex flex-1 flex-col overflow-hidden data-[state=inactive]:hidden"
          >
            <div className="flex flex-wrap items-center gap-2 border-b bg-muted/20 px-4 py-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={fioQuery}
                  onChange={(e) => setFioQuery(e.target.value)}
                  placeholder="Введите ФИО сотрудника"
                  className="h-9 pl-9"
                  onKeyDown={(e) => e.key === "Enter" && handleFioSearch()}
                />
              </div>
              <Button type="button" size="sm" onClick={handleFioSearch}>
                Найти
              </Button>
            </div>
            <div className="grid flex-1 min-h-[400px] grid-cols-2 gap-0 overflow-hidden">
              <EmployeePanel
                title="Найденные сотрудники"
                employees={foundEmployees}
                selectedIds={checkedFound}
                onToggle={toggleFound}
                onToggleAll={(checked) => {
                  if (checked) setCheckedFound(new Set(foundEmployees.map((e) => e.id)));
                  else setCheckedFound(new Set());
                }}
                allSelected={allFoundChecked}
                footer={
                  <Button
                    type="button"
                    size="sm"
                    className="gap-1.5"
                    disabled={!canMoveToSelected}
                    onClick={moveToSelected}
                  >
                    Выбрать сотрудников
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                }
              />
              <EmployeePanel
                title="Выбранные сотрудники"
                employees={stagingSelected}
                selectedIds={checkedStaging}
                onToggle={toggleStaging}
                onToggleAll={(checked) => {
                  if (checked)
                    setCheckedStaging(new Set(stagingSelected.map((e) => e.id)));
                  else setCheckedStaging(new Set());
                }}
                allSelected={allStagingChecked}
                footer={
                  <div className="flex w-full items-center justify-between gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="gap-1.5"
                      disabled={!canRemoveFromSelected}
                      onClick={removeFromSelected}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Убрать из списка
                    </Button>
                    <Button type="button" size="sm" onClick={handleSave}>
                      Сохранить
                    </Button>
                  </div>
                }
                borderLeft
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function EmployeePanel({
  title,
  employees,
  selectedIds,
  onToggle,
  onToggleAll,
  allSelected,
  footer,
  borderLeft,
}: {
  title: string;
  employees: KpiResponsibleEmployee[];
  selectedIds: Set<string>;
  onToggle: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  allSelected: boolean;
  footer: React.ReactNode;
  borderLeft?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden bg-background",
        borderLeft && "border-l"
      )}
    >
      <div className="shrink-0 border-b bg-muted/30 px-3 py-2 text-xs font-medium">
        {title}
      </div>
      <div className="flex-1 overflow-hidden p-2">
        <EmployeeTable
          employees={employees}
          selectedIds={selectedIds}
          onToggle={onToggle}
          onToggleAll={onToggleAll}
          allSelected={allSelected}
        />
      </div>
      <div className="shrink-0 border-t bg-muted/20 px-3 py-2">{footer}</div>
    </div>
  );
}

export function ResponsibleEmployeeCard({
  employee,
  onRemove,
}: {
  employee: KpiResponsibleEmployee;
  onRemove?: () => void;
}) {
  const initials = employee.fullName
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div className="mt-4 grid gap-4 rounded-lg border bg-muted/10 p-4 md:grid-cols-[1fr_1fr]">
      <div className="flex gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium">{employee.fullName}</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            {employee.position}
          </p>
        </div>
      </div>
      <div>
        <p className="mb-1 text-xs text-muted-foreground">Подразделение</p>
        <p className="text-xs leading-relaxed text-foreground">
          {employee.department}
        </p>
      </div>
      {onRemove && (
        <div className="md:col-span-2">
          <Button type="button" variant="outline" size="sm" onClick={onRemove}>
            Удалить
          </Button>
        </div>
      )}
    </div>
  );
}
