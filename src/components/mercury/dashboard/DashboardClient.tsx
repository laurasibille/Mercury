"use client";

import { useState } from "react";
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
  const [mobileNav, setMobileNav] = useState(false);
  return (
    <div className="min-h-screen bg-white">
      <DemoBanner />
      <Sidebar mobileOpen={mobileNav} onClose={() => setMobileNav(false)} />
      <Topbar privateMode={privateMode} onPrivateMode={() => setPrivateMode((value) => !value)} onMenu={() => setMobileNav(true)} />
      <main className="pt-12 min-[961px]:ml-[219px] min-[961px]:pt-32">
        <div className="mx-auto w-full max-w-[1032px] px-4 pb-32 min-[961px]:px-8">
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
      </main>
      <TryMercuryPanel />
    </div>
  );
}

