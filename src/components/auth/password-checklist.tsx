"use client";

import { Check } from "lucide-react";

const RULES = [
  { label: "8 caractères minimum", test: (value: string) => value.length >= 8 },
  { label: "1 majuscule", test: (value: string) => /[A-Z]/.test(value) },
  { label: "1 minuscule", test: (value: string) => /[a-z]/.test(value) },
  { label: "1 chiffre", test: (value: string) => /[0-9]/.test(value) },
];

export function PasswordChecklist({ password }: { password: string }) {
  const doneCount = RULES.filter((rule) => rule.test(password)).length;

  return (
    <div className="mt-3 space-y-2.5">
      <div className="flex gap-1.5" aria-hidden="true">
        {RULES.map((_, index) => (
          <span
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              index < doneCount
                ? "bg-gradient-to-r from-cyan-400 to-violet-500"
                : "bg-slate-700"
            }`}
          />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-1.5">
        {RULES.map((rule) => {
          const done = rule.test(password);
          return (
            <li
              key={rule.label}
              className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                done ? "text-cyan-300" : "text-slate-500"
              }`}
            >
              <Check
                className={`size-3 shrink-0 ${
                  done ? "text-emerald-400" : "text-slate-600"
                }`}
                aria-hidden="true"
              />
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}