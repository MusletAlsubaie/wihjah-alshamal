"use client";

import { useState, type CSSProperties } from "react";
import BrandLogo from "./BrandLogo";

type LogoOrbitHubProps = {
  onReport: () => void;
  onSuggest: () => void;
  onTrack: () => void;
  onIdea: () => void;
  onStaff: () => void;
};

const ORBIT_ITEMS = [
  { key: "report", label: "إبلاغ", angle: -90 },
  { key: "suggest", label: "اقتراح", angle: -18 },
  { key: "track", label: "متابعة الطلب", angle: 54 },
  { key: "idea", label: "فكرة المشروع", angle: 126 },
  { key: "staff", label: "دخول الموظف", angle: 198 },
] as const;

export default function HomeLanding({
  onReport,
  onSuggest,
  onTrack,
  onIdea,
  onStaff,
}: LogoOrbitHubProps) {
  const [open, setOpen] = useState(false);

  function handleAction(key: (typeof ORBIT_ITEMS)[number]["key"]) {
    if (key === "report") onReport();
    else if (key === "suggest") onSuggest();
    else if (key === "track") onTrack();
    else if (key === "idea") onIdea();
    else onStaff();
  }

  return (
    <section className="orbit-stage" aria-label="وِجهة الشمال — القائمة الدائرية">
      <div className="orbit-atmosphere" aria-hidden />

      <div className={`orbit-board ${open ? "is-open" : ""}`}>
        <div className="orbit-ring" aria-hidden />
        <div className="orbit-ring orbit-ring--inner" aria-hidden />

        {ORBIT_ITEMS.map((item, index) => (
          <button
            key={item.key}
            type="button"
            className="orbit-node"
            style={
              {
                "--angle": `${item.angle}deg`,
                "--i": index,
              } as CSSProperties
            }
            tabIndex={open ? 0 : -1}
            aria-hidden={!open}
            disabled={!open}
            onClick={() => handleAction(item.key)}
          >
            <span className="orbit-node-disc">{item.label}</span>
          </button>
        ))}

        <button
          type="button"
          className={`orbit-core ${open ? "is-open" : ""}`}
          aria-expanded={open}
          aria-controls="orbit-nodes"
          aria-label={
            open
              ? "إخفاء خيارات وِجهة الشمال"
              : "إظهار خيارات وِجهة الشمال"
          }
          onClick={() => setOpen((v) => !v)}
        >
          <BrandLogo variant="primary" showTitle={false} priority />
          <span className="orbit-core-pulse" aria-hidden />
        </button>
      </div>

      <p className="orbit-hint" id="orbit-nodes">
        {open
          ? "اختر من الدوائر حول الشعار"
          : "اضغط شعار المشروع لإظهار الخيارات"}
      </p>
    </section>
  );
}
