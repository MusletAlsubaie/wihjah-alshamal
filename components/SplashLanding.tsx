"use client";

import Image from "next/image";

type SplashLandingProps = {
  onStart: () => void;
};

export default function SplashLanding({ onStart }: SplashLandingProps) {
  return (
    <section className="splash" aria-label="واجهة وِجهة الشمال">
      <div className="splash-frame">
        <Image
          src="/branding/social-story.png"
          alt="وِجهة الشمال — ابدأ رحلتك"
          fill
          priority
          sizes="(max-width: 768px) 100vw, min(100vw, 560px)"
          className="splash-media-img"
        />

        <div className="splash-actions">
          <button type="button" className="splash-start" onClick={onStart}>
            ابدأ
          </button>
        </div>
      </div>
    </section>
  );
}
