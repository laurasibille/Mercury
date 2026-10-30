"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "../primitives/Button";
import { MercuryMark } from "../primitives/MercuryMark";

export function DemoBanner() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 hidden h-14 items-center justify-between bg-[var(--color-demo)] px-8 text-white md:flex">
      <div className="flex items-center gap-3">
        <MercuryMark className="h-8 w-8" />
        <span className="text-[15px]">Explore the Mercury Demo.</span>
        <button className="border-b border-white/60 text-[14px] text-white/80 hover:text-white">Customize your experience</button>
      </div>
      <div className="flex items-center gap-3">
        <Button className="bg-white/8 text-white hover:bg-white/15" size="sm">Viewing as Admin <ChevronDown size={14} /></Button>
        <Button variant="primary" size="sm" className="px-5">Open account</Button>
      </div>
    </div>
  );
}

