"use client";

import { useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AccountsSection } from "./AccountsSection";
import { BalanceCard } from "./BalanceCard";
import { BillPayModule } from "./BillPayModule";
import { CreditCardModule } from "./CreditCardModule";
import { InvoicingModule } from "./InvoicingModule";
import { MoneyMovement } from "./MoneyMovement";
import { QuickActions } from "./QuickActions";
import { TransactionsTable } from "./TransactionsTable";
import { TryMercuryPanel } from "./TryMercuryPanel";
import { DemoBanner } from "../layout/DemoBanner";
import { Sidebar } from "../layout/Sidebar";
import { Topbar } from "../layout/Topbar";

export function DashboardClient() {
  const [privateMode, setPrivateMode] = useState(false);
  return (
    <SidebarProvider className="pt-0 md:pt-14">
      <DemoBanner />
      <Sidebar />
      <SidebarInset className="min-w-0 bg-white">
        <Topbar privateMode={privateMode} onPrivateMode={() => setPrivateMode((value) => !value)} />
        <div className="flex-1 pt-5 md:pt-2">
          <div className="mx-auto w-full max-w-[1032px] px-4 pb-32 md:px-8">
            <h1 className="text-[28px] font-normal leading-9 tracking-[-0.02em]">Welcome, Jane</h1>
            <QuickActions />
            <div className="grid grid-cols-1 gap-6 min-[700px]:grid-cols-2">
              <BalanceCard privateMode={privateMode} />
              <AccountsSection privateMode={privateMode} />
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 min-[640px]:grid-cols-3">
              <CreditCardModule privateMode={privateMode} />
              <BillPayModule privateMode={privateMode} />
              <InvoicingModule privateMode={privateMode} />
            </div>
            <div className="mt-10"><MoneyMovement privateMode={privateMode} /></div>
            <div className="mt-10"><TransactionsTable privateMode={privateMode} /></div>
          </div>
        </div>
      </SidebarInset>
      <TryMercuryPanel />
    </SidebarProvider>
  );
}

