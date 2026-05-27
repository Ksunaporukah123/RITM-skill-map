"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const RESPONSIBILITY_ZONE_OPTIONS = [
  "Группа целеполагания",
  "ССП",
  "ВСП1",
  "ВСП2",
  "ВСП3",
  "Виртуальное подразделение",
  "Индивидуальная",
] as const;

const COMPARISON_SIGN_OPTIONS = ["<", "≤", "=", "≥", ">"] as const;

export interface ScaleInterval {
  id: string;
  lowerBound: string;
  lowerSign: string;
  targetValue: string;
  upperSign: string;
  upperBound: string;
  assessment: string;
  useFormula: boolean;
  formula: string;
}

export interface ResponsibilityZonePair {
  id: string;
  responsibilityZone: string;
  intervals: ScaleInterval[];
}

function createEmptyInterval(): ScaleInterval {
  return {
    id: `interval-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    lowerBound: "",
    lowerSign: "",
    targetValue: "",
    upperSign: "",
    upperBound: "",
    assessment: "",
    useFormula: false,
    formula: "",
  };
}

const nativeSelectClass =
  "h-9 w-full min-w-[72px] rounded-md border border-input bg-background px-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

function SignSelect({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  id: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={nativeSelectClass}
    >
      <option value="">Знак</option>
      {COMPARISON_SIGN_OPTIONS.map((sign) => (
        <option key={sign} value={sign}>
          {sign}
        </option>
      ))}
    </select>
  );
}

function createInitialDraft(): Omit<ResponsibilityZonePair, "id"> {
  return {
    responsibilityZone: "",
    intervals: [createEmptyInterval()],
  };
}

function ResponsibilityZoneSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (zone: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = RESPONSIBILITY_ZONE_OPTIONS.filter((zone) =>
    zone.toLowerCase().includes(query.trim().toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayValue = open ? query : value;

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <Input
        value={displayValue}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setQuery(value);
          setOpen(true);
        }}
        placeholder="Введите данные"
        className="h-10 bg-background pr-8"
        autoComplete="off"
      />
      {open && (
        <ul
          className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border bg-popover py-1 shadow-md"
          role="listbox"
        >
          {filtered.length > 0 ? (
            filtered.map((zone) => (
              <li key={zone} role="option" aria-selected={value === zone}>
                <button
                  type="button"
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-muted",
                    value === zone && "bg-muted/60 font-medium"
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(zone);
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  {zone}
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              Ничего не найдено
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

interface ResponsibilityZoneScaleDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (pair: ResponsibilityZonePair) => void;
}

export function ResponsibilityZoneScaleDrawer({
  open,
  onOpenChange,
  onSave,
}: ResponsibilityZoneScaleDrawerProps) {
  const [responsibilityZone, setResponsibilityZone] = useState("");
  const [intervals, setIntervals] = useState<ScaleInterval[]>([
    createEmptyInterval(),
  ]);

  useEffect(() => {
    if (open) {
      const draft = createInitialDraft();
      setResponsibilityZone(draft.responsibilityZone);
      setIntervals(draft.intervals);
    }
  }, [open]);

  const addInterval = () => {
    setIntervals((prev) => [...prev, createEmptyInterval()]);
  };

  const removeInterval = (id: string) => {
    setIntervals((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((i) => i.id !== id);
    });
  };

  const updateInterval = (
    id: string,
    field: keyof ScaleInterval,
    value: string | boolean
  ) => {
    setIntervals((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSave = () => {
    if (!responsibilityZone) return;
    onSave({
      id: `zone-pair-${Date.now()}`,
      responsibilityZone,
      intervals,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "z-[60] flex h-full w-full flex-col gap-0 p-0 sm:max-w-[920px]",
          "[&>button]:hidden"
        )}
      >
        <SheetTitle className="sr-only">
          Добавление зоны ответственности и шкалы
        </SheetTitle>

        <div className="flex shrink-0 items-start justify-between border-b px-6 py-4">
          <h2 className="pr-4 text-lg font-semibold leading-snug">
            Добавление зоны ответственности и шкалы
          </h2>
          <div className="flex shrink-0 items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
              Отменить
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={!responsibilityZone}
            >
              Сохранить
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-6">
            <div>
              <Label className="mb-2 block text-sm font-normal">
                Зона ответственности:
              </Label>
              <ResponsibilityZoneSelect
                value={responsibilityZone}
                onChange={setResponsibilityZone}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <Label className="text-sm font-semibold">Шкала оценки</Label>
                <button
                  type="button"
                  className="text-sm text-sky-600 hover:text-sky-800 hover:underline"
                >
                  Выбрать из шаблона
                </button>
              </div>

              <div className="space-y-4">
                {intervals.map((interval, index) => (
                  <div
                    key={interval.id}
                    className="space-y-3 rounded-lg border bg-muted/10 p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Интервал {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => removeInterval(interval.id)}
                        disabled={intervals.length <= 1}
                        aria-label="Удалить интервал"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                      <div className="space-y-1">
                        <Label
                          htmlFor={`${interval.id}-lower`}
                          className="text-xs font-normal text-muted-foreground"
                        >
                          Нижняя граница
                        </Label>
                        <Input
                          id={`${interval.id}-lower`}
                          type="text"
                          inputMode="decimal"
                          value={interval.lowerBound}
                          onChange={(e) =>
                            updateInterval(
                              interval.id,
                              "lowerBound",
                              e.target.value
                            )
                          }
                          placeholder="Введите число"
                          className="h-9 bg-background"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label
                          htmlFor={`${interval.id}-lower-sign`}
                          className="text-xs font-normal text-muted-foreground"
                        >
                          Знак
                        </Label>
                        <SignSelect
                          id={`${interval.id}-lower-sign`}
                          value={interval.lowerSign}
                          onChange={(v) =>
                            updateInterval(interval.id, "lowerSign", v)
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <Label
                          htmlFor={`${interval.id}-target`}
                          className="flex items-center gap-1 text-xs font-normal text-muted-foreground"
                        >
                          Значение
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-white"
                                aria-label="Подсказка"
                              >
                                <Info className="h-2.5 w-2.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-xs">
                              Целевое значение для сравнения границ интервала
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <Input
                          id={`${interval.id}-target`}
                          type="text"
                          inputMode="decimal"
                          value={interval.targetValue}
                          onChange={(e) =>
                            updateInterval(
                              interval.id,
                              "targetValue",
                              e.target.value
                            )
                          }
                          placeholder="Введите число"
                          className="h-9 bg-background"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label
                          htmlFor={`${interval.id}-upper-sign`}
                          className="text-xs font-normal text-muted-foreground"
                        >
                          Знак
                        </Label>
                        <SignSelect
                          id={`${interval.id}-upper-sign`}
                          value={interval.upperSign}
                          onChange={(v) =>
                            updateInterval(interval.id, "upperSign", v)
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <Label
                          htmlFor={`${interval.id}-upper`}
                          className="text-xs font-normal text-muted-foreground"
                        >
                          Верхняя граница
                        </Label>
                        <Input
                          id={`${interval.id}-upper`}
                          type="text"
                          inputMode="decimal"
                          value={interval.upperBound}
                          onChange={(e) =>
                            updateInterval(
                              interval.id,
                              "upperBound",
                              e.target.value
                            )
                          }
                          placeholder="Введите число"
                          className="h-9 bg-background"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label
                          htmlFor={`${interval.id}-assessment`}
                          className="text-xs font-normal text-muted-foreground"
                        >
                          Оценка, %
                        </Label>
                        <Input
                          id={`${interval.id}-assessment`}
                          type="text"
                          inputMode="decimal"
                          value={interval.assessment}
                          onChange={(e) =>
                            updateInterval(
                              interval.id,
                              "assessment",
                              e.target.value
                            )
                          }
                          placeholder="Оценка"
                          className="h-9 bg-background"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-end gap-3 border-t border-dashed pt-3">
                      <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <Checkbox
                          checked={interval.useFormula}
                          onCheckedChange={(v) =>
                            updateInterval(interval.id, "useFormula", v === true)
                          }
                        />
                        Использовать формулу
                      </label>
                      <div className="min-w-[200px] flex-1 space-y-1">
                        <Label
                          htmlFor={`${interval.id}-formula`}
                          className="text-xs font-normal text-muted-foreground"
                        >
                          Формула расчёта
                        </Label>
                        <Input
                          id={`${interval.id}-formula`}
                          type="text"
                          value={interval.formula}
                          onChange={(e) =>
                            updateInterval(interval.id, "formula", e.target.value)
                          }
                          placeholder="Введите формулу"
                          className="h-9 bg-background"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button type="button" size="sm" onClick={addInterval}>
                + Добавить интервал
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
