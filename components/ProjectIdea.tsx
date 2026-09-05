"use client";

type ProjectIdeaProps = {
  onBack: () => void;
  onStartReport: () => void;
};

export default function ProjectIdea({ onBack, onStartReport }: ProjectIdeaProps) {
  return (
    <section className="page-wrap idea-page">
      <div className="page-heading">
        <span className="eyebrow">وِجهة الشمال</span>
        <h1>فكرة المشروع</h1>
        <p>
          منصة موحّدة للمستفيد يقدّم عبرها البلاغات والاقتراحات، فتُقترح الجهات
          المختصة ويُعاد التوجيه من لوحة الموظف بوضوح وسرعة.
        </p>
      </div>

      <div className="idea-points">
        <article className="idea-point">
          <b>بلاغ واضح</b>
          <span>وصف وموقع ومرفقات مع رقم تذكرة للمتابعة.</span>
        </article>
        <article className="idea-point">
          <b>اقتراح بنّاء</b>
          <span>تحسينات وخدمات مع إمكانية التعليق والمتابعة.</span>
        </article>
        <article className="idea-point">
          <b>توجيه ذكي</b>
          <span>مقترحات متعددة للجهات حسب نوع الطلب (مثل حريق مركبة).</span>
        </article>
        <article className="idea-point">
          <b>نظرة تشغيلية</b>
          <span>طوابير الانتظار والتوجيه وإحصاءات الجهات في لوحة واحدة.</span>
        </article>
      </div>

      <div className="idea-actions">
        <button type="button" className="primary" onClick={onStartReport}>
          ابدأ بإبلاغ
        </button>
        <button type="button" className="secondary" onClick={onBack}>
          العودة للشعار
        </button>
      </div>
    </section>
  );
}
