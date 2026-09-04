"use client";

type ProjectHubProps = {
  onReport: () => void;
  onSuggest: () => void;
  onStaff: () => void;
  onTrack: () => void;
};

export default function ProjectHub({
  onReport,
  onSuggest,
  onStaff,
  onTrack,
}: ProjectHubProps) {
  return (
    <section className="page-wrap project-hub">
      <div className="page-heading">
        <span className="eyebrow">وِجهة الشمال</span>
        <h1>ماذا تريد أن تفعل؟</h1>
        <p>اختر الإبلاغ عن مشكلة، أو تقديم اقتراح، أو دخول لوحة الموظف.</p>
      </div>

      <div className="hub-grid">
        <button type="button" className="hub-card card" onClick={onReport}>
          <span className="hub-icon" aria-hidden>
            ⚠
          </span>
          <b>إبلاغ</b>
          <span>بلّغ عن مشكلة أو خلل خدمي مع رقم تذكرة للمتابعة</span>
        </button>

        <button type="button" className="hub-card card" onClick={onSuggest}>
          <span className="hub-icon" aria-hidden>
            ✦
          </span>
          <b>اقتراح</b>
          <span>قدّم فكرة أو تحسينًا مع إمكانية المتابعة والتعليق</span>
        </button>

        <button type="button" className="hub-card card hub-card--staff" onClick={onStaff}>
          <span className="hub-icon" aria-hidden>
            👤
          </span>
          <b>دخول الموظف</b>
          <span>إدارة البلاغات والاقتراحات وإعادة التوجيه للجهات</span>
        </button>

        <button type="button" className="hub-card card hub-card--muted" onClick={onTrack}>
          <span className="hub-icon" aria-hidden>
            ◷
          </span>
          <b>متابعة طلب</b>
          <span>اطّلع على حالة تذكرة سابقة والسجل الزمني</span>
        </button>
      </div>
    </section>
  );
}
