"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type Dispatch, type ReactNode } from "react";
import { swapizDemoData } from "@/data/swapiz-demo";
import { initialSwapizState, swapizReducer, type SwapizAction, type SwapizState } from "@/lib/swapiz/reducer";
import { selectDashboardSnapshot } from "@/lib/swapiz/selectors";
import type { DashboardSnapshot } from "@/types/swapiz";

interface SwapizContextValue {
  state: SwapizState;
  dispatch: Dispatch<SwapizAction>;
  snapshot: DashboardSnapshot;
}

const SwapizContext = createContext<SwapizContextValue | null>(null);
const isTheme = (value: string | null): value is SwapizState["theme"] => value === "light" || value === "dark" || value === "system";

function storedTheme(): SwapizState["theme"] {
  try {
    const saved = window.localStorage.getItem("swapiz-theme");
    if (isTheme(saved)) return saved;
  } catch { /* Browser storage may be unavailable. */ }
  return "system";
}

export function SwapizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(swapizReducer, initialSwapizState);
  const themeRestored = useRef(false);

  useEffect(() => {
    const saved = storedTheme();
    const frame = window.requestAnimationFrame(() => {
      themeRestored.current = true;
      dispatch({ type: "theme/changed", theme: saved });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const theme = themeRestored.current ? state.theme : storedTheme();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = (dark: boolean) => {
      document.documentElement.classList.toggle("dark", theme === "dark" || (theme === "system" && dark));
      document.documentElement.style.colorScheme = theme === "system" ? (dark ? "dark" : "light") : theme;
    };
    applyTheme(media.matches);
    try { window.localStorage.setItem("swapiz-theme", theme); } catch { /* Storage is optional. */ }
    const onChange = (event: MediaQueryListEvent) => applyTheme(event.matches);
    media.addEventListener("change", onChange);
    return () => {
      media.removeEventListener("change", onChange);
    };
  }, [state.theme]);

  const snapshot = useMemo(() => selectDashboardSnapshot({
    ...swapizDemoData, alerts: state.alerts, approvals: state.approvals, transactions: state.transactions,
  }, state.scopeId, state.dateRange), [state.alerts, state.approvals, state.transactions, state.scopeId, state.dateRange]);
  const value = useMemo(() => ({ state, dispatch, snapshot }), [state, snapshot]);
  return <SwapizContext.Provider value={value}>{children}</SwapizContext.Provider>;
}

export function useSwapiz() {
  const context = useContext(SwapizContext);
  if (!context) throw new Error("useSwapiz must be used within a SwapizProvider.");
  return context;
}

export type { SwapizState, SwapizAction };
