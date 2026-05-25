"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, ChevronRight, CheckCircle2, StopCircle, Info, FileText, BarChart3 } from "lucide-react";
import { PerformanceMapsTab } from "@/components/goals/PerformanceMapsTab";

// --- Делегирование: типы и моковые данные ---
interface DelegationRoleAction {
  id: string;
  title: string;
}

interface DelegationRole {
  id: string;
  name: string;
  actions: DelegationRoleAction[];
}

interface DelegationEmployee {
  id: string;
  fullName: string;
  position: string;
  department: string;
}

interface SavedDelegation {
  id: string;
  roleId: string;
  roleName: string;
  employeeId: string;
  employeeName: string;
  /** Дата начала периода (YYYY-MM-DD) */
  periodFrom: string;
  /** Дата окончания периода (YYYY-MM-DD) или null — по текущее время */
  periodTo: string | null;
}

/** Роль, делегированная текущему пользователю другими */
interface DelegatedToMeRole {
  id: string;
  roleId: string;
  roleName: string;
  /** Кто делегировал (ФИО) */
  delegatorName: string;
  periodFrom: string;
  periodTo: string | null;
}

/** Форматирование даты для отображения (YYYY-MM-DD → DD.MM.YYYY) */
function formatDelegationDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return d && m && y ? `${d}.${m}.${y}` : iso;
}

/** Роли, делегированные текущему пользователю (мок) */
const ROLES_DELEGATED_TO_ME: DelegatedToMeRole[] = [
  { id: "dm1", roleId: "line-manager", roleName: "Линейный руководитель", delegatorName: "Смирнов А.В.", periodFrom: "2025-10-01", periodTo: null },
  { id: "dm2", roleId: "goal-group-leader", roleName: "Руководитель группы целеполагания (РГЦ)", delegatorName: "Кузнецова О.И.", periodFrom: "2025-08-15", periodTo: "2025-12-31" },
];

/** Роли пользователя в системе целеполагания и их действия (справочник — сценарии, реализуемые делегатами) */
const USER_DELEGATION_ROLES: DelegationRole[] = [
  {
    id: "goal-group-leader",
    name: "Руководитель группы целеполагания (РГЦ)",
    actions: [
      { id: "g1", title: "Утверждение проекта КПЭ Руководителем группы целеполагания" },
      { id: "g2", title: "Просмотр КР сотрудников Банка закрепленной ГЦ за все периоды ЦОР в списке КР" },
      { id: "g3", title: "Утверждение КР работника ФС закреплённой ГЦ" },
      { id: "g4", title: "Утверждение оценки результативности работника ФС закреплённой ГЦ" },
    ],
  },
  {
    id: "line-manager",
    name: "Линейный руководитель",
    actions: [
      { id: "l1", title: "Создание проекта КПЭ" },
      { id: "l2", title: "Копирование КПЭ для создания нового проекта КПЭ" },
      { id: "l3", title: "Редактирование КПЭ в статусе «Активный»" },
      { id: "l4", title: "Создание верхнеуровневой КР для одного сотрудника ГО прямого подчинения (через экран для РГЦ / ВДЛ / Руководителя ССП)" },
      { id: "l5", title: "Создание КР для одного сотрудника ГО прямого подчинения (через экран для Руководителя ВСП)" },
      { id: "l6", title: "Создание КР для одного сотрудника ГО прямого подчинения (через экран со списком КР всех работников прямого подчинения)" },
      { id: "l7", title: "Создание КР для сотрудника ГО путем переиспользования КР (в статусах «Черновик», «Разработка», «Активная», «Архивная»)" },
      { id: "l8", title: "Просмотр КР сотрудников своего функционального подчинения и непосредственного руководителя за все периоды в списке КР" },
      { id: "l9", title: "Редактирование КР сотрудников ГО прямого подчинения в статусе «Черновик»" },
      { id: "l10", title: "Перевод КР сотрудников ГО прямого подчинения из статуса «Черновик» в статус «Разработка»" },
      { id: "l11", title: "Утверждение КР работников ГО прямого подчинения" },
      { id: "l12", title: "Перевод КР сотрудников ГО прямого подчинения из статуса «Разработка» в статус «Черновик» (возврат на доработку)" },
      { id: "l13", title: "Редактирование КР сотрудника ГО прямого подчинения в статусе «Активная»" },
      { id: "l14", title: "Удаление КР сотрудника ГО прямого подчинения в статусе «Черновик»" },
      { id: "l15", title: "Утверждение оценки результативности работника ГО прямого подчинения" },
    ],
  },
];

/** Сотрудники, которым можно делегировать (подчинённые / доступные для выбора) */
const DELEGATION_EMPLOYEES: DelegationEmployee[] = [
  { id: "1", fullName: "Иванов Иван Иванович", position: "Ведущий разработчик", department: "Департамент информационных технологий" },
  { id: "2", fullName: "Петрова Анна Сергеевна", position: "Менеджер проектов", department: "Управление проектами" },
  { id: "3", fullName: "Сидоров Алексей Петрович", position: "Аналитик данных", department: "Департамент аналитики" },
  { id: "4", fullName: "Козлова Мария Александровна", position: "HR-специалист", department: "Управление персоналом" },
  { id: "5", fullName: "Николаев Дмитрий Владимирович", position: "Финансовый аналитик", department: "Финансовый департамент" },
  { id: "6", fullName: "Федорова Екатерина Игоревна", position: "Руководитель отдела", department: "Департамент информационных технологий" },
];

export default function GoalsPage() {
  // Делегирование
  const [delegationRoleId, setDelegationRoleId] = useState<string | null>(null);
  const [delegationEmployeeId, setDelegationEmployeeId] = useState<string | null>(null);
  const [delegationPeriodFrom, setDelegationPeriodFrom] = useState<string>("");
  const [delegationPeriodTo, setDelegationPeriodTo] = useState<string>("");
  const [savedDelegations, setSavedDelegations] = useState<SavedDelegation[]>([
    { id: "d-1", roleId: "line-manager", roleName: "Линейный руководитель", employeeId: "2", employeeName: "Петрова Анна Сергеевна", periodFrom: "2025-01-15", periodTo: "2025-06-30" },
    { id: "d-2", roleId: "goal-group-leader", roleName: "Руководитель группы целеполагания", employeeId: "6", employeeName: "Федорова Екатерина Игоревна", periodFrom: "2025-09-01", periodTo: null },
  ]);
  const [delegationSaved, setDelegationSaved] = useState(false);
  const [openRoleKeys, setOpenRoleKeys] = useState<Set<string>>(new Set());

  const toggleRoleCollapse = (key: string) => {
    setOpenRoleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSaveDelegation = () => {
    if (!delegationRoleId || !delegationEmployeeId) return;
    const role = USER_DELEGATION_ROLES.find((r) => r.id === delegationRoleId);
    const employee = DELEGATION_EMPLOYEES.find((e) => e.id === delegationEmployeeId);
    if (!role || !employee) return;
    const periodFrom = delegationPeriodFrom || new Date().toISOString().slice(0, 10);
    setSavedDelegations((prev) => [
      ...prev,
      {
        id: `d-${Date.now()}`,
        roleId: role.id,
        roleName: role.name,
        employeeId: employee.id,
        employeeName: employee.fullName,
        periodFrom,
        periodTo: delegationPeriodTo || null,
      },
    ]);
    setDelegationRoleId(null);
    setDelegationEmployeeId(null);
    setDelegationPeriodFrom("");
    setDelegationPeriodTo("");
    setDelegationSaved(true);
    setTimeout(() => setDelegationSaved(false), 3000);
  };

  const handleEndDelegation = (delegationId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setSavedDelegations((prev) =>
      prev.map((d) => (d.id === delegationId ? { ...d, periodTo: today } : d))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Целеполагание</h1>
          <p className="text-muted-foreground">
            Цели, оценка результативности и делегирование
          </p>
        </div>
      </div>

      <Tabs defaultValue="performance-map" className="w-full">
        <TabsList variant="grid4" className="w-full">
          <TabsTrigger value="performance-map">Карты результативности</TabsTrigger>
          <TabsTrigger value="kpi-registry">Реестр КПЭ</TabsTrigger>
          <TabsTrigger value="pfk-table">Таблица ПФК</TabsTrigger>
          <TabsTrigger value="delegation">Делегирование</TabsTrigger>
        </TabsList>

        <TabsContent value="performance-map" className="mt-6">
          <PerformanceMapsTab />
        </TabsContent>

        <TabsContent value="delegation" className="mt-4">
          <Card className="border rounded-lg">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base">Делегирование</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <Tabs defaultValue="my-roles" className="w-full">
                <TabsList variant="grid2" className="w-full mb-4">
                  <TabsTrigger value="my-roles">Мои роли</TabsTrigger>
                  <TabsTrigger value="delegation-management">Управление делегированием</TabsTrigger>
                </TabsList>
                <TabsContent value="my-roles" className="mt-0 space-y-4">
                  {/* Собственные роли пользователя */}
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">Мои роли</div>
                    <div className="space-y-2">
                      {USER_DELEGATION_ROLES.map((role) => {
                        const key = `role-${role.id}`;
                        const isOpen = openRoleKeys.has(key);
                        return (
                          <div
                            key={role.id}
                            className="rounded-md border bg-muted/30 overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={() => toggleRoleCollapse(key)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-left font-medium text-sm hover:bg-muted/50 transition-colors"
                            >
                              {isOpen ? (
                                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                              )}
                              {role.name}
                            </button>
                            {isOpen && (
                              <div className="px-3 pb-3 pt-0 pl-9">
                                <ul className="text-xs text-muted-foreground list-disc list-inside leading-relaxed">
                                  {role.actions.map((action) => (
                                    <li key={action.id}>{action.title}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Роли, делегированные мне другими */}
                  <div className="pt-2 border-t">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Делегировано мне</div>
                    <p className="text-xs text-muted-foreground mb-2">Роли, которые делегировали вам другие пользователи</p>
                    {ROLES_DELEGATED_TO_ME.length > 0 ? (
                      <div className="space-y-2">
                        {ROLES_DELEGATED_TO_ME.map((d) => {
                          const key = `delegated-${d.id}`;
                          const isOpen = openRoleKeys.has(key);
                          const roleDefinition = USER_DELEGATION_ROLES.find((r) => r.id === d.roleId);
                          const isActive = d.periodTo == null || d.periodTo >= new Date().toISOString().slice(0, 10);
                          return (
                            <div
                              key={d.id}
                              className="rounded-md border bg-muted/20 overflow-hidden border-l-4 border-l-primary/50"
                            >
                              <button
                                type="button"
                                onClick={() => toggleRoleCollapse(key)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted/30 transition-colors"
                              >
                                {isOpen ? (
                                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                                )}
                                <span className="font-medium text-sm">{d.roleName}</span>
                                <span className="text-xs text-muted-foreground">
                                  делегировал(а) {d.delegatorName}
                                </span>
                                <Badge variant={isActive ? "default" : "secondary"} className="text-xs ml-auto">
                                  {isActive ? "Активно" : "Завершено"}
                                </Badge>
                              </button>
                              {isOpen && (
                                <div className="px-3 pb-3 pt-0 pl-9 space-y-1">
                                  <div className="text-xs text-muted-foreground">
                                    Период: {formatDelegationDate(d.periodFrom)} — {d.periodTo ? formatDelegationDate(d.periodTo) : "по текущее время"}
                                  </div>
                                  {roleDefinition && (
                                    <ul className="text-xs text-muted-foreground list-disc list-inside leading-relaxed">
                                      {roleDefinition.actions.map((action) => (
                                        <li key={action.id}>{action.title}</li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground py-2">Вам пока не делегировали роли</p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="delegation-management" className="mt-0 space-y-4">
                  {/* Делегировать роль */}
                  <div className="flex flex-wrap items-end gap-3">
                    <div className="text-sm font-medium text-muted-foreground w-full flex items-center gap-1.5">
                      Делегировать роль
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-flex cursor-help text-muted-foreground hover:text-foreground">
                            <Info className="h-4 w-4" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          При делегировании передаётся весь функционал роли — сотрудник получает все действия выбранной роли.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="space-y-1.5 min-w-[200px]">
                      <Label htmlFor="delegation-role" className="text-xs">Роль</Label>
                      <Select
                        value={delegationRoleId ?? ""}
                        onValueChange={(v) => setDelegationRoleId(v || null)}
                      >
                        <SelectTrigger id="delegation-role" className="h-8 text-sm">
                          <SelectValue placeholder="Выберите роль" />
                        </SelectTrigger>
                        <SelectContent>
                          {USER_DELEGATION_ROLES.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 min-w-[220px]">
                      <Label htmlFor="delegation-employee" className="text-xs">Сотрудник</Label>
                      <Select
                        value={delegationEmployeeId ?? ""}
                        onValueChange={(v) => setDelegationEmployeeId(v || null)}
                      >
                        <SelectTrigger id="delegation-employee" className="h-8 text-sm">
                          <SelectValue placeholder="Выберите сотрудника" />
                        </SelectTrigger>
                        <SelectContent>
                          {DELEGATION_EMPLOYEES.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id}>
                              {emp.fullName} — {emp.position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 min-w-[130px]">
                      <Label htmlFor="delegation-period-from" className="text-xs">Период с</Label>
                      <Input
                        id="delegation-period-from"
                        type="date"
                        className="h-8 text-sm"
                        value={delegationPeriodFrom}
                        onChange={(e) => setDelegationPeriodFrom(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5 min-w-[130px]">
                      <Label htmlFor="delegation-period-to" className="text-xs">Период по (пусто — по текущее время)</Label>
                      <Input
                        id="delegation-period-to"
                        type="date"
                        className="h-8 text-sm"
                        value={delegationPeriodTo}
                        onChange={(e) => setDelegationPeriodTo(e.target.value)}
                      />
                    </div>
                    <Button
                      size="sm"
                      className="h-8"
                      onClick={handleSaveDelegation}
                      disabled={!delegationRoleId || !delegationEmployeeId}
                    >
                      {delegationSaved ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-1.5" />
                          Сохранено
                        </>
                      ) : (
                        "Сохранить"
                      )}
                    </Button>
                    {delegationSaved && (
                      <span className="text-xs text-muted-foreground">Делегирование сохранено</span>
                    )}
                  </div>

                  {/* История делегирований */}
                  <div className="pt-2 border-t">
                    <div className="text-sm font-medium text-muted-foreground mb-2">История делегирований</div>
                    <p className="text-xs text-muted-foreground mb-2">Кому и в какой период была делегирована роль</p>
                    {savedDelegations.length > 0 ? (
                      <div className="border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="py-2 text-xs font-medium">Роль</TableHead>
                              <TableHead className="py-2 text-xs font-medium">Кому делегировано</TableHead>
                              <TableHead className="w-[110px] py-2 text-xs font-medium">Период с</TableHead>
                              <TableHead className="w-[110px] py-2 text-xs font-medium">Период по</TableHead>
                              <TableHead className="w-[120px] py-2 text-xs font-medium text-right">Действия</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[...savedDelegations]
                              .sort((a, b) => (b.periodFrom.localeCompare(a.periodFrom)))
                              .map((d) => (
                                <TableRow key={d.id} className="hover:bg-muted/30">
                                  <TableCell className="py-2 text-sm font-medium">{d.roleName}</TableCell>
                                  <TableCell className="py-2 text-sm">{d.employeeName}</TableCell>
                                  <TableCell className="py-2 text-xs text-muted-foreground">{formatDelegationDate(d.periodFrom)}</TableCell>
                                  <TableCell className="py-2 text-xs text-muted-foreground">
                                    {d.periodTo ? formatDelegationDate(d.periodTo) : "по текущее время"}
                                  </TableCell>
                                  <TableCell className="py-2 text-right">
                                    {d.periodTo == null ? (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs"
                                        onClick={() => handleEndDelegation(d.id)}
                                      >
                                        <StopCircle className="h-4 w-4 mr-1" />
                                        Завершить
                                      </Button>
                                    ) : (
                                      <span className="text-xs text-muted-foreground">Завершено</span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground py-2">Нет записей в истории</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kpi-registry" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Реестр КПЭ
              </CardTitle>
              <CardDescription>
                Реестр ключевых показателей эффективности
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Раздел находится в разработке. Здесь будет отображаться реестр ключевых показателей эффективности.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pfk-table" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Таблица ПФК
              </CardTitle>
              <CardDescription>
                Таблица плановых, фактических и критических значений
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Раздел находится в разработке. Здесь будет отображаться таблица плановых, фактических и критических значений.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
