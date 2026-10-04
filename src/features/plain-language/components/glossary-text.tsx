"use client";

import { Fragment, useMemo } from "react";
import type { GlossaryTerm as GlossaryTermEntity } from "@/services/glossary/types";
import { useGlossary } from "../hooks/use-glossary";
import { GlossaryTerm } from "./glossary-term";

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

interface Segment {
  text: string;
  term: GlossaryTermEntity | null;
}

/**
 * Annotate un texte brut : chaque terme présent dans le glossaire devient
 * un <GlossaryTerm> dépliable (langage simple, D13).
 */
export function GlossaryText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const { data: terms } = useGlossary();

  const segments = useMemo<Segment[]>(() => {
    if (!terms?.length) return [{ text, term: null }];

    const sorted = [...terms].sort((a, b) => b.term.length - a.term.length);
    const pattern = new RegExp(
      `(?<![\\p{L}\\p{N}])(${sorted
        .map((term) => escapeRegExp(term.term))
        .join("|")})(?![\\p{L}\\p{N}])`,
      "giu",
    );

    return text
      .split(pattern)
      .filter(Boolean)
      .map((part) => {
        const matched = sorted.find(
          (term) => term.term.toLowerCase() === part.toLowerCase(),
        );
        return matched
          ? { text: part, term: matched }
          : { text: part, term: null };
      });
  }, [text, terms]);

  return (
    <span className={className}>
      {segments.map((segment, index) =>
        segment.term ? (
          <GlossaryTerm
            key={`${segment.term.id}-${index}`}
            term={segment.term.term}
            definition={segment.term.definition}
          />
        ) : (
          <Fragment key={index}>{segment.text}</Fragment>
        ),
      )}
    </span>
  );
}