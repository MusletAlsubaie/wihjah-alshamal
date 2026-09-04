export const CITY_SECTORS = [
  "قطاع الكهرباء",
  "قطاع الاتصالات",
  "وزارة المياه",
  "الأمانة",
  "وزارة النقل",
  "كافة الدوائر الحكومية",
] as const;

export type CitySector = (typeof CITY_SECTORS)[number];

export type TicketKind = "report" | "suggestion";

export type StaffRequest = {
  id: string;
  text: string;
  title: string;
  kind: TicketKind;
  category: string;
  priority: "منخفضة" | "متوسطة" | "عالية";
  status: string;
  suggestedSector: CitySector;
  assignedSector: CitySector | null;
  followUp?: boolean;
};

export function suggestSector(
  text: string,
  kind: TicketKind = "report"
): CitySector {
  const value = text.trim().toLowerCase();

  if (
    value.includes("ماء") ||
    value.includes("مياه") ||
    value.includes("تسرب") ||
    value.includes("تصريف") ||
    value.includes("مجاري")
  ) {
    return "وزارة المياه";
  }

  if (
    value.includes("كهرب") ||
    value.includes("إنارة") ||
    value.includes("عمود") ||
    value.includes("لمبة") ||
    value.includes("انقطاع")
  ) {
    return "قطاع الكهرباء";
  }

  if (
    value.includes("اتصال") ||
    value.includes("انترنت") ||
    value.includes("شبكة") ||
    value.includes("جوال") ||
    value.includes("اتصالات")
  ) {
    return "قطاع الاتصالات";
  }

  if (
    value.includes("حفرة") ||
    value.includes("طريق") ||
    value.includes("شارع") ||
    value.includes("رصيف")
  ) {
    return "وزارة النقل";
  }

  if (
    value.includes("نفايات") ||
    value.includes("حاوية") ||
    value.includes("نظافة") ||
    value.includes("حديقة") ||
    value.includes("بلدي")
  ) {
    return "الأمانة";
  }

  return kind === "report" ? "الأمانة" : "كافة الدوائر الحكومية";
}

export const DEMO_STAFF_REQUESTS: StaffRequest[] = [
  {
    id: "NB-2026-0142",
    title: "تجمع مياه",
    text: "تجمع مياه بجانب مدرسة في عرعر",
    kind: "report",
    category: "خدمات عامة",
    priority: "متوسطة",
    status: "بانتظار التوجيه",
    suggestedSector: "وزارة المياه",
    assignedSector: null,
  },
  {
    id: "NB-2026-0143",
    title: "إنارة معطلة",
    text: "إنارة لا تعمل في شارع عام",
    kind: "report",
    category: "خدمات عامة",
    priority: "متوسطة",
    status: "بانتظار التوجيه",
    suggestedSector: "قطاع الكهرباء",
    assignedSector: null,
  },
  {
    id: "NB-2026-0144",
    title: "تحسين الحاويات",
    text: "اقتراح زيادة حاويات النظافة قرب الحديقة",
    kind: "suggestion",
    category: "بنية تحتية",
    priority: "منخفضة",
    status: "تحت المعالجة",
    suggestedSector: "الأمانة",
    assignedSector: "الأمانة",
    followUp: true,
  },
];
