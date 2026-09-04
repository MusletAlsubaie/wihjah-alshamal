"use client";

import type { AppScreen } from "./SiteHeader";

type BottomNavProps = {
  active: AppScreen;
  onNavigate: (screen: AppScreen) => void;
};

const ITEMS: { screen: AppScreen; label: string; icon: string }[] = [
  { screen: "home", label: "الرئيسية", icon: "⌂" },
  { screen: "project", label: "المشروع", icon: "◎" },
  { screen: "track", label: "متابعة", icon: "◷" },
  { screen: "dashboard", label: "الموظف", icon: "👤" },
];

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="التنقل السفلي">
      {ITEMS.map((item) => (
        <button
          key={item.screen}
          type="button"
          className={`bottom-nav-item ${active === item.screen ? "is-active" : ""}`}
          onClick={() => onNavigate(item.screen)}
        >
          <span className="bottom-nav-icon" aria-hidden>
            {item.icon}
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
