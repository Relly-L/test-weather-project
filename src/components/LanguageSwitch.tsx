"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { dictionaries, localeMeta, locales, type Locale } from "../lib/i18n";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const flagSrc = (locale: Locale) => `${basePath}/flags/${localeMeta[locale].flag}.svg`;

/** Round flag button that opens a list of round flags. `disabled` is for static previews. */
export default function LanguageSwitch(props: {
  locale: Locale;
  onChange?: (locale: Locale) => void;
  disabled?: boolean;
}) {
  const { locale, onChange, disabled } = props;
  const t = dictionaries[locale];
  const popId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  // The 28 flag images are fetched only once the list has been opened.
  const [everOpened, setEverOpened] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle() {
    setEverOpened(true);
    setOpen((v) => !v);
  }

  function pick(next: Locale) {
    setOpen(false);
    if (next !== locale) onChange?.(next);
    buttonRef.current?.focus();
  }

  return (
    <div className="lang" ref={rootRef}>
      <div id={popId} className="lang-pop" data-open={open} role="group" aria-label={t.languageLabel} inert={!open}>
        {everOpened &&
          locales.map((l, i) => (
            <button
              key={l}
              type="button"
              className="lang-item"
              lang={l}
              dir={localeMeta[l].dir}
              aria-label={localeMeta[l].native}
              aria-current={l === locale ? "true" : undefined}
              title={localeMeta[l].native}
              style={{ "--i": i } as CSSProperties}
              onClick={() => pick(l)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={flagSrc(l)} alt="" width={40} height={40} draggable={false} />
            </button>
          ))}
      </div>
      <button
        ref={buttonRef}
        type="button"
        className="lang-btn"
        aria-label={`${t.languageLabel}: ${localeMeta[locale].native}`}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={popId}
        disabled={disabled}
        onClick={toggle}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={locale} className="lang-flag" src={flagSrc(locale)} alt="" width={34} height={34} draggable={false} />
      </button>
    </div>
  );
}
