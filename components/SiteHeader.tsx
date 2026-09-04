"use client";

import { useEffect, useId, useState } from "react";
import BrandLogo from "./BrandLogo";

export type AppScreen =
  | "home"
  | "project"
  | "new"
  | "result"
  | "track"
  | "dashboard";

type SiteHeaderProps = {
  onNavigate: (screen: AppScreen) => void;
};

const NAV_ITEMS: { screen: AppScreen; label: string }[] = [
  { screen: "home", label: "الرئيسية" },
  { screen: "project", label: "المشروع" },
  { screen: "track", label: "متابعة" },
  { screen: "dashboard", label: "الموظف" },
];

export default function SiteHeader({ onNavigate }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function go(screen: AppScreen) {
    onNavigate(screen);
    setMenuOpen(false);
  }

  return (
    <header className="topbar">
      <button
        type="button"
        className="brand"
        onClick={() => go("home")}
        aria-label="وِجهة الشمال — العودة للرئيسية"
      >
        <BrandLogo variant="horizontal" priority />
      </button>

      <nav className="desktop-nav" aria-label="التنقل الرئيسي">
        {NAV_ITEMS.map((item) => (
          <button type="button" key={item.screen} onClick={() => go(item.screen)}>
            {item.label}
          </button>
        ))}
      </nav>

      <button
        type="button"
        className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
        aria-expanded={menuOpen}
        aria-controls={menuId}
        aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        className={`mobile-nav-backdrop ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      />

      <nav
        id={menuId}
        className={`mobile-nav ${menuOpen ? "is-open" : ""}`}
        aria-label="التنقل للجوال"
        aria-hidden={!menuOpen}
      >
        {NAV_ITEMS.map((item) => (
          <button type="button" key={item.screen} onClick={() => go(item.screen)}>
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
