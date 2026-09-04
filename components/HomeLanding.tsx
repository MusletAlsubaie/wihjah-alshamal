"use client";

import BrandLogo from "./BrandLogo";

type HomeLandingProps = {
  onOpenProject: () => void;
};

export default function HomeLanding({ onOpenProject }: HomeLandingProps) {
  return (
    <section className="page-wrap home-simple">
      <div className="page-heading home-simple-heading">
        <span className="eyebrow">منصة المستفيد</span>
        <h1>خدمات أوضح… من وِجهة واحدة</h1>
        <p>اضغط بطاقة المشروع للبدء في الإبلاغ أو الاقتراح أو متابعة طلبك.</p>
      </div>

      <button type="button" className="card project-entry" onClick={onOpenProject}>
        <div className="project-entry-logo">
          <BrandLogo variant="primary" showTitle={false} />
        </div>
        <div className="project-entry-copy">
          <b>وِجهة الشمال</b>
          <span>بلاغات واقتراحات ذكية مع توجيه للجهات المختصة</span>
          <em className="project-entry-cta">الدخول للمشروع ←</em>
        </div>
      </button>
    </section>
  );
}
