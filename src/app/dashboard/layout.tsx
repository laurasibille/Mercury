import type { ReactNode } from "react";
import { SwapizShell } from "@/components/swapiz/layout/SwapizShell";
import { SwapizProvider } from "@/components/swapiz/providers/SwapizProvider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <SwapizProvider><SwapizShell>{children}</SwapizShell></SwapizProvider>;
}
