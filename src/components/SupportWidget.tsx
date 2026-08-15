"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "@/lib/i18n/context";
import { supportWidgetCopy } from "@/lib/i18n/support-widget-copy";

const TELEGRAM_URL = "https://t.me/Ihor_Kriazhev";
const WHATSAPP_URL = "https://wa.me/4915258400610";

const ALLOWED_PATHS = new Set(["/", "/tariffs"]);
const DEFAULT_OFFSET = 24;

type Position = { bottom: number; right: number };

export function SupportWidget() {
  const pathname = usePathname();
  const { locale } = useTranslation();
  const copy = supportWidgetCopy[locale] ?? supportWidgetCopy.de;
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position>({
    bottom: DEFAULT_OFFSET,
    right: DEFAULT_OFFSET,
  });
  const titleId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    originRight: number;
    originBottom: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;
      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        drag.moved = true;
      }

      const el = containerRef.current;
      const width = el?.offsetWidth ?? 0;
      const height = el?.offsetHeight ?? 0;
      const maxRight = Math.max(DEFAULT_OFFSET, window.innerWidth - width - DEFAULT_OFFSET);
      const maxBottom = Math.max(DEFAULT_OFFSET, window.innerHeight - height - DEFAULT_OFFSET);

      setPosition({
        right: Math.min(Math.max(DEFAULT_OFFSET, drag.originRight - deltaX), maxRight),
        bottom: Math.min(Math.max(DEFAULT_OFFSET, drag.originBottom - deltaY), maxBottom),
      });
    };

    const onMouseUp = () => {
      if (!dragRef.current) return;
      if (dragRef.current.moved) {
        suppressClickRef.current = true;
      }
      dragRef.current = null;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  if (!ALLOWED_PATHS.has(pathname)) {
    return null;
  }

  const beginDrag = (clientX: number, clientY: number) => {
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      originRight: position.right,
      originBottom: position.bottom,
      moved: false,
    };
  };

  const moveDrag = (clientX: number, clientY: number) => {
    const drag = dragRef.current;
    if (!drag) return;

    const deltaX = clientX - drag.startX;
    const deltaY = clientY - drag.startY;
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      drag.moved = true;
    }

    const el = containerRef.current;
    const width = el?.offsetWidth ?? 0;
    const height = el?.offsetHeight ?? 0;
    const maxRight = Math.max(DEFAULT_OFFSET, window.innerWidth - width - DEFAULT_OFFSET);
    const maxBottom = Math.max(DEFAULT_OFFSET, window.innerHeight - height - DEFAULT_OFFSET);

    setPosition({
      right: Math.min(Math.max(DEFAULT_OFFSET, drag.originRight - deltaX), maxRight),
      bottom: Math.min(Math.max(DEFAULT_OFFSET, drag.originBottom - deltaY), maxBottom),
    });
  };

  const endDrag = () => {
    if (dragRef.current?.moved) {
      suppressClickRef.current = true;
    }
    dragRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="fixed z-[9999] flex flex-col items-end gap-3"
      style={{ bottom: position.bottom, right: position.right }}
    >
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="flex max-h-[min(70vh,560px)] w-[min(calc(100vw-48px),380px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3 border-b border-gray-100 bg-gray-950 px-4 py-3">
            <h2 id={titleId} className="pr-2 text-base font-bold text-white">
              {copy.title}
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={copy.close}
              className="rounded-lg p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4">
            <Accordion type="single" collapsible className="w-full">
              {copy.faq.map((item, index) => (
                <AccordionItem key={`${locale}-${index}`} value={`faq-${index}`}>
                  <AccordionTrigger className="text-sm font-semibold text-gray-900 hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50 p-4">
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600"
            >
              {copy.telegram}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-gray-800"
            >
              {copy.whatsapp}
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          if (suppressClickRef.current) {
            suppressClickRef.current = false;
            return;
          }
          setOpen((prev) => !prev);
        }}
        onMouseDown={(event) => {
          if (event.button !== 0) return;
          beginDrag(event.clientX, event.clientY);
        }}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          if (!touch) return;
          beginDrag(touch.clientX, touch.clientY);
        }}
        onTouchMove={(event) => {
          if (!dragRef.current) return;
          const touch = event.touches[0];
          if (!touch) return;
          event.preventDefault();
          moveDrag(touch.clientX, touch.clientY);
        }}
        onTouchEnd={endDrag}
        onTouchCancel={endDrag}
        aria-expanded={open}
        className="touch-none inline-flex cursor-grab items-center gap-2 rounded-full bg-gray-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 transition-colors hover:bg-orange-500 hover:shadow-orange-500/30 active:cursor-grabbing"
      >
        <MessageCircle className="h-4 w-4" />
        {copy.button}
      </button>
    </div>
  );
}
