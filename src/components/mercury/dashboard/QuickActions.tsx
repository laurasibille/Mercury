"use client";

import { ArrowLeftToLine, ArrowUpFromLine, ChevronDown, MoveHorizontal, Paperclip, Plus, Send } from "lucide-react";
import { Button } from "../primitives/Button";

export function QuickActions() {
  return (
    <div className="mb-6 mt-2 flex items-center gap-3">
      <Button variant="primary" size="sm" icon={<Send size={13} />} className="max-[639px]:flex-1"><span className="max-[639px]:hidden">Send</span><span className="min-[640px]:hidden">Send money</span></Button>
      <div className="contents max-[639px]:hidden">
        <Button size="sm" icon={<MoveHorizontal size={13} />}>Transfer</Button><Button size="sm" icon={<Plus size={13} />}>Deposit</Button><Button size="sm" icon={<ArrowLeftToLine size={13} />}>Request</Button><Button size="sm" icon={<ArrowUpFromLine size={13} />}>Upload bill</Button>
      </div>
      <Button size="sm" className="min-[640px]:hidden">More <ChevronDown size={13} /></Button>
      <button className="ml-auto hidden h-8 items-center gap-2 rounded-full px-3 text-[14px] hover:bg-[var(--color-surface)] min-[640px]:flex"><Paperclip size={13} />Customize</button>
    </div>
  );
}

