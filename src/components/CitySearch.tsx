"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { searchCities, type CitySuggestion } from "../lib/geocoding";
import { dictionaries, type Locale } from "../lib/i18n";

type Status = "idle" | "loading" | "done" | "error";

/** Accessible city autocomplete (combobox + listbox). `disabled` is for static previews. */
export default function CitySearch(props: {
  locale: Locale;
  onSelect?: (city: CitySuggestion) => void;
  disabled?: boolean;
}) {
  const { locale, onSelect, disabled } = props;
  const t = dictionaries[locale];
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<CitySuggestion[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const trimmed = query.trim();

  useEffect(() => {
    if (trimmed.length < 2) {
      setItems([]);
      setStatus("idle");
      return;
    }
    const controller = new AbortController();
    setStatus("loading");
    const timer = setTimeout(async () => {
      try {
        const found = await searchCities(trimmed, locale, controller.signal);
        setItems(found);
        setActive(-1);
        setStatus("done");
      } catch {
        if (!controller.signal.aborted) setStatus("error");
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed, locale]);

  function choose(city: CitySuggestion) {
    onSelect?.(city);
    setQuery("");
    setItems([]);
    setStatus("idle");
    setOpen(false);
    setActive(-1);
    inputRef.current?.blur();
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" && items.length > 0) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp" && items.length > 0) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i <= 0 ? items.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      const pick = items[active] ?? (status === "done" ? items[0] : undefined);
      if (pick) {
        e.preventDefault();
        choose(pick);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  }

  const showList = open && items.length > 0;
  const note =
    open && trimmed.length >= 2
      ? status === "error"
        ? t.searchError
        : status === "done" && items.length === 0
          ? t.searchEmpty
          : null
      : null;

  return (
    <div className="search">
      <input
        ref={inputRef}
        className="search-input"
        type="text"
        role="combobox"
        aria-label={t.searchLabel}
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
        placeholder={t.searchPlaceholder}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        maxLength={80}
        disabled={disabled}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      />
      <ul id={listId} role="listbox" className="search-list" hidden={!showList}>
        {items.map((c, i) => (
          <li
            key={c.id}
            id={`${listId}-${i}`}
            role="option"
            aria-selected={i === active}
            className="search-option"
            style={{ "--i": i } as CSSProperties}
            onMouseDown={(e) => {
              e.preventDefault();
              choose(c);
            }}
            onMouseEnter={() => setActive(i)}
          >
            {c.name}
            {c.detail && <small>{c.detail}</small>}
          </li>
        ))}
      </ul>
      {note && (
        <p className="search-note" role="status">
          {note}
        </p>
      )}
    </div>
  );
}
