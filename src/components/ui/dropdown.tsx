"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type DropdownProps = {
  name: string;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
};

/**
 * A native <select> cannot carry the Figma panel — the option list is drawn by
 * the OS. This is a listbox with the same keyboard contract: arrows move the
 * active option, Enter/Space commits, Escape closes, Home/End jump.
 *
 * The chosen value rides in a hidden input so the surrounding <form> still sees
 * a normal field.
 */
export function Dropdown({
  name,
  label,
  options,
  value,
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const commit = (index: number) => {
    onChange(options[index]);
    setOpen(false);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        const step = event.key === "ArrowDown" ? 1 : -1;
        setActive((i) => (i + step + options.length) % options.length);
        return;
      }
      case "Home":
        if (open) {
          event.preventDefault();
          setActive(0);
        }
        return;
      case "End":
        if (open) {
          event.preventDefault();
          setActive(options.length - 1);
        }
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) commit(active);
        else setOpen(true);
        return;
      case "Escape":
        setOpen(false);
        return;
      case "Tab":
        setOpen(false);
    }
  };

  return (
    <div ref={root} className="relative">
      <input type="hidden" name={name} value={value} />

      {/* Open state is one continuous shell, not a pill with a panel stuck
          underneath: its sides run straight from the top corners down past the
          options, and the trigger's own pill outline sits inside it. The top
          radius equals the pill's, so the two outlines coincide up there.
          Going absolute lifts the shell out of the grid, so a spacer below
          holds the cell's height. */}
      <div
        className={cn(
          open &&
            "absolute inset-x-0 top-0 z-30 overflow-hidden rounded-t-[clamp(1.125rem,1.285vw,1.6rem)] rounded-b-[clamp(0.75rem,1.4vw,1.75rem)] border border-line bg-paper shadow-lg",
        )}
      >
        <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={label}
        onClick={() => {
          setOpen((o) => !o);
          setActive(Math.max(0, options.indexOf(value)));
        }}
        onKeyDown={onKeyDown}
          className={cn(
            "flex h-[clamp(2.25rem,2.57vw,3.2rem)] w-full items-center justify-between gap-2 rounded-full border border-line bg-paper",
            "pr-[clamp(0.5rem,0.83vw,1.05rem)] pl-[clamp(0.625rem,0.9vw,1.1rem)]",
            "font-mono text-[clamp(0.6875rem,0.83vw,1.05rem)] focus-visible:border-ink focus-visible:outline-none",
            value ? "text-ink" : "text-muted",
          )}
        >
          <span className="truncate">{value || label}</span>
          <ChevronDown
            aria-hidden
            className={cn(
              "size-[clamp(0.75rem,1vw,1.25rem)] shrink-0 text-ink transition-transform",
              open && "rotate-180",
            )}
          />
        </button>

        {open && (
          <ul
            id={listId}
            role="listbox"
            aria-label={label}
            className="max-h-[min(60vh,24rem)] overflow-y-auto pb-[clamp(0.375rem,0.6vw,0.75rem)]"
          >
            {options.map((option, i) => (
              <li key={option}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option === value}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => commit(i)}
                  className={cn(
                    "block w-full px-[clamp(0.625rem,0.9vw,1.1rem)] py-[clamp(0.5rem,0.7vw,0.9rem)] text-left",
                    "font-mono text-[clamp(0.6875rem,0.83vw,1.05rem)] text-ink",
                    i === active && "bg-select-active",
                  )}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {open && (
        <div
          aria-hidden
          className="h-[clamp(2.25rem,2.57vw,3.2rem)]"
        />
      )}
    </div>
  );
}
