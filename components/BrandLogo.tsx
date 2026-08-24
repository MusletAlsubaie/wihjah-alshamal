import Image from "next/image";

type BrandLogoVariant = "horizontal" | "primary" | "icon";

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  className?: string;
  priority?: boolean;
  showTitle?: boolean;
};

const ASSETS: Record<
  BrandLogoVariant,
  { src: string; alt: string; width: number; height: number }
> = {
  horizontal: {
    // تم استبدال الشعار الأفقي بأيقونة favicon-32 حسب الطلب
    src: "/branding/favicon-32.png",
    alt: "شعار وِجهة الشمال",
    width: 32,
    height: 32,
  },
  primary: {
    src: "/branding/logo-primary.png",
    alt: "الهوية البصرية لوِجهة الشمال",
    width: 280,
    height: 320,
  },
  icon: {
    src: "/branding/logo-icon.png",
    alt: "أيقونة وِجهة الشمال",
    width: 64,
    height: 64,
  },
};

export default function BrandLogo({
  variant = "horizontal",
  className = "",
  priority = false,
  showTitle = variant === "horizontal",
}: BrandLogoProps) {
  const asset = ASSETS[variant];

  return (
    <span className={`brand-logo brand-logo--${variant} ${className}`.trim()}>
      <Image
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        priority={priority}
        sizes={
          variant === "horizontal"
            ? "40px"
            : variant === "primary"
              ? "(max-width: 560px) 160px, 220px"
              : "40px"
        }
      />
      {showTitle ? (
        <span className="brand-logo-title">
          <strong>وِجهة الشمال</strong>
          <small>Wihjah Al-Shamal</small>
        </span>
      ) : null}
    </span>
  );
}
