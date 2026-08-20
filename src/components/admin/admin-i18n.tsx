"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ADMIN_LOCALE_STORAGE_KEY,
  getAdminCopy,
  type AdminCopy,
} from "@/lib/admin/i18n";
import { DEFAULT_LOCALE, type Locale, isLocale } from "@/lib/i18n/config";

type AdminI18nValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  copy: AdminCopy;
  ready: boolean;
};

const AdminI18nContext = createContext<AdminI18nValue | null>(null);

export function AdminI18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(ADMIN_LOCALE_STORAGE_KEY);
    const next = stored && isLocale(stored) ? stored : DEFAULT_LOCALE;
    setLocaleState(next);
    setReady(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(ADMIN_LOCALE_STORAGE_KEY, next);
  }, []);

  const copy = useMemo(() => getAdminCopy(ready ? locale : DEFAULT_LOCALE), [locale, ready]);

  const value = useMemo(
    () => ({ locale, setLocale, copy, ready }),
    [locale, setLocale, copy, ready],
  );

  return <AdminI18nContext.Provider value={value}>{children}</AdminI18nContext.Provider>;
}

export function useAdminI18n() {
  const ctx = useContext(AdminI18nContext);
  if (!ctx) {
    throw new Error("useAdminI18n must be used within AdminI18nProvider");
  }
  return ctx;
}
