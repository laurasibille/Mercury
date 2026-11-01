"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useSwapiz } from "../providers/SwapizProvider";
import { OperationChooser } from "./OperationChooser";
import { SendFlow } from "./SendFlow";
import { ReceiveFlow } from "./ReceiveFlow";
import { TransferFlow } from "./TransferFlow";
import { SwapFlow } from "./SwapFlow";
import { MassPayFlow } from "./MassPayFlow";
import { PaymentLinkFlow } from "./PaymentLinkFlow";

const flows = { send: SendFlow, receive: ReceiveFlow, transfer: TransferFlow, swap: SwapFlow, "mass-pay": MassPayFlow, "payment-link": PaymentLinkFlow };

export function MoveMoneyLayer() {
  const { state, dispatch } = useSwapiz();
  const origin = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (state.moveMoney.open) return;
    const remember = (event: FocusEvent) => {
      if (event.target instanceof HTMLElement && !event.target.closest('[role="dialog"], [role="menu"]')) origin.current = event.target;
    };
    document.addEventListener("focusin", remember);
    return () => document.removeEventListener("focusin", remember);
  }, [state.moveMoney.open]);
  const operation = state.moveMoney.operation;
  const Flow = operation ? flows[operation] : null;
  return <Dialog.Root open={state.moveMoney.open} onOpenChange={open => { if (!open) dispatch({ type: "move/close" }); }}>
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 z-[80] bg-[var(--swapiz-canvas)]" />
      <Dialog.Popup className="fixed inset-0 z-[81] flex h-[100dvh] min-h-[100dvh] w-full flex-col overflow-y-auto bg-[var(--swapiz-canvas)] text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]" initialFocus={element => element === "touch" ? true : document.querySelector<HTMLElement>('[data-move-close]') ?? true} finalFocus={() => origin.current?.isConnected ? origin.current : true}>
        <Dialog.Title className="sr-only">Move money</Dialog.Title>
        <Dialog.Description className="sr-only">Prepare a demo money movement request. No real funds are moved.</Dialog.Description>
        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-[var(--swapiz-canvas)] px-5 py-4 sm:px-9">
          <div className="flex items-center gap-2.5"><span className="flex size-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-lg font-semibold text-white" aria-hidden="true">S</span><span className="text-base font-medium tracking-tight">Swapiz</span><span className="ml-2 hidden rounded-md border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-ink-muted)] sm:block">Demo workspace</span></div>
          <Dialog.Close data-move-close className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm hover:bg-[var(--color-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"><span>Close</span><X aria-hidden="true" className="size-4" /></Dialog.Close>
        </div>
        <div className="w-full flex-1 px-5 pt-7 pb-12 sm:px-8 sm:pt-12">{Flow ? <Flow key={operation} /> : <OperationChooser />}</div>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>;
}
