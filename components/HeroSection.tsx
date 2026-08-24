import Image from "next/image";
import BrandLogo from "./BrandLogo";

type HeroSectionProps = {
  onStart: () => void;
  onTrack: () => void;
};

export default function HeroSection({ onStart, onTrack }: HeroSectionProps) {
  return (
    <div className="hero card">
      <div className="hero-media" aria-hidden="true">
        <Image
          src="/branding/hero-bg.png"
          alt=""
          fill
          priority
          sizes="(max-width: 850px) 100vw, 70vw"
          className="hero-media-img"
        />
        <div className="hero-overlay" />
      </div>

      <div className="hero-content">
        <BrandLogo variant="icon" className="hero-brand-icon" />
        <span className="eyebrow">رحلة مستفيد أكثر سهولة وفعالية</span>
        <h1>
          كل خدماتك تبدأ من <span>وِجهة</span>
        </h1>
        <p>
          صف احتياجك بلغة بسيطة، ودع النظام يساعدك على تصنيف الطلب واقتراح المسار
          المناسب ومتابعة حالته.
        </p>
        <div className="actions">
          <button className="primary" onClick={onStart}>
            ابدأ رحلتك
          </button>
          <button className="secondary" onClick={onTrack}>
            متابعة طلب
          </button>
        </div>
      </div>
    </div>
  );
}
