/**
 * Хук для управления диалоговыми окнами
 */

import { useState, useCallback } from "react";

export function useDialog<T = void>() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback((dialogData?: T) => {
    if (dialogData !== undefined) {
      setData(dialogData as T);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
    setData,
  };
}

/**
 * Хук для управления множественными диалоговыми окнами
 */
export function useDialogs<T extends string>(dialogNames: T[]) {
  const [openDialogs, setOpenDialogs] = useState<Record<T, boolean>>(
    {} as Record<T, boolean>
  );

  const openDialog = useCallback((name: T) => {
    setOpenDialogs(prev => ({ ...prev, [name]: true }));
  }, []);

  const closeDialog = useCallback((name: T) => {
    setOpenDialogs(prev => ({ ...prev, [name]: false }));
  }, []);

  const toggleDialog = useCallback((name: T) => {
    setOpenDialogs(prev => ({ ...prev, [name]: !prev[name] }));
  }, []);

  const isDialogOpen = useCallback((name: T) => {
    return openDialogs[name] || false;
  }, [openDialogs]);

  return {
    openDialogs,
    openDialog,
    closeDialog,
    toggleDialog,
    isDialogOpen,
  };
}
