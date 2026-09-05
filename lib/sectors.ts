export const CITY_SECTORS = [
  "الدفاع المدني (المطافئ)",
  "الهلال الأحمر (الإسعاف)",
  "الشرطة",
  "المرور",
  "قطاع الكهرباء",
  "قطاع الاتصالات",
  "وزارة المياه",
  "الأمانة",
  "وزارة النقل",
  "وزارة الصحة",
  "وزارة التعليم",
  "الدفاع المدني — السلامة",
  "البيئة والمياه والزراعة",
  "الجوازات",
  "الدفاع المدني والإنقاذ",
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
  /** مقترحات متعددة حسب نوع الطلب */
  suggestedSectors: CitySector[];
  /** الجهات التي تم تأكيد التوجيه إليها */
  assignedSectors: CitySector[];
  followUp?: boolean;
};

/** للتوافق مع الشاشات التي تعرض مقترحًا رئيسيًا واحدًا */
export function primarySuggestion(sectors: CitySector[]): CitySector {
  return sectors[0] ?? "كافة الدوائر الحكومية";
}

/**
 * يعيد قائمة جهات مقترحة (قد تكون متعددة) حسب محتوى الطلب.
 * مثال: حريق مركبة في الطريق → مطافئ + إسعاف + شرطة (+ مرور أحيانًا)
 */
export function suggestSectors(
  text: string,
  kind: TicketKind = "report"
): CitySector[] {
  const value = text.trim().toLowerCase();
  const out: CitySector[] = [];

  function add(...sectors: CitySector[]) {
    for (const s of sectors) {
      if (!out.includes(s)) out.push(s);
    }
  }

  // حريق / اشتعال — تجنب مطابقة "نار" داخل "إنارة"
  const isFire =
    value.includes("حريق") ||
    value.includes("حرائق") ||
    value.includes("اشتعال") ||
    value.includes("احترق") ||
    value.includes("محترق") ||
    value.includes("بالنار") ||
    value.includes("على النار") ||
    /(^|[^اإ])النار/.test(value);
  const isVehicle =
    value.includes("مركبة") ||
    value.includes("سيارة") ||
    value.includes("شاحنة") ||
    value.includes("حافلة");
  const isRoad =
    value.includes("طريق") ||
    value.includes("شارع") ||
    value.includes("قارعة") ||
    value.includes("مسار") ||
    value.includes("دوار");

  if (isFire && (isVehicle || isRoad)) {
    add("الدفاع المدني (المطافئ)", "الهلال الأحمر (الإسعاف)", "الشرطة");
    if (isRoad) add("المرور");
    return out;
  }

  if (isFire) {
    add("الدفاع المدني (المطافئ)", "الهلال الأحمر (الإسعاف)");
    return out;
  }

  // حادث مروري / اصطدام
  if (
    value.includes("حادث") ||
    value.includes("اصطدام") ||
    value.includes("دهس") ||
    (isVehicle && (value.includes("انقلاب") || value.includes("تصادم")))
  ) {
    add("المرور", "الهلال الأحمر (الإسعاف)", "الشرطة");
    if (value.includes("حريق") || value.includes("اشتعال")) {
      add("الدفاع المدني (المطافئ)");
    }
    return out;
  }

  // إصابة / إسعاف
  if (
    value.includes("إسعاف") ||
    value.includes("إصابة") ||
    value.includes("مصاب") ||
    value.includes("إغماء")
  ) {
    add("الهلال الأحمر (الإسعاف)", "وزارة الصحة");
    return out;
  }

  // أمن / سرقة / شجار
  if (
    value.includes("سرقة") ||
    value.includes("مشاجرة") ||
    value.includes("اعتداء") ||
    value.includes("أمن")
  ) {
    add("الشرطة");
    return out;
  }

  if (
    value.includes("ماء") ||
    value.includes("مياه") ||
    value.includes("تسرب") ||
    value.includes("تصريف") ||
    value.includes("مجاري")
  ) {
    add("وزارة المياه", "الأمانة");
    return out;
  }

  if (
    value.includes("كهرب") ||
    value.includes("إنارة") ||
    value.includes("عمود") ||
    value.includes("لمبة") ||
    value.includes("انقطاع")
  ) {
    add("قطاع الكهرباء");
    if (isRoad) add("الأمانة");
    return out;
  }

  if (
    value.includes("اتصال") ||
    value.includes("انترنت") ||
    value.includes("شبكة") ||
    value.includes("جوال") ||
    value.includes("اتصالات")
  ) {
    add("قطاع الاتصالات");
    return out;
  }

  if (
    value.includes("حفرة") ||
    value.includes("رصيف") ||
    (isRoad && !isFire)
  ) {
    add("وزارة النقل", "الأمانة");
    if (value.includes("ازدحام") || value.includes("إشارة")) add("المرور");
    return out;
  }

  if (
    value.includes("نفايات") ||
    value.includes("حاوية") ||
    value.includes("نظافة") ||
    value.includes("حديقة") ||
    value.includes("بلدي")
  ) {
    add("الأمانة");
    return out;
  }

  if (value.includes("مدرس") || value.includes("تعليم") || value.includes("طالب")) {
    add("وزارة التعليم");
    return out;
  }

  if (value.includes("مستشف") || value.includes("عيادة") || value.includes("صحة")) {
    add("وزارة الصحة");
    return out;
  }

  if (value.includes("بيئة") || value.includes("تلوث") || value.includes("زراعة")) {
    add("البيئة والمياه والزراعة", "الأمانة");
    return out;
  }

  return kind === "report"
    ? (["الأمانة", "كافة الدوائر الحكومية"] as CitySector[])
    : (["كافة الدوائر الحكومية", "الأمانة"] as CitySector[]);
}

/** @deprecated استخدم suggestSectors — يُبقى للتوافق المؤقت */
export function suggestSector(
  text: string,
  kind: TicketKind = "report"
): CitySector {
  return primarySuggestion(suggestSectors(text, kind));
}

export const DEMO_STAFF_REQUESTS: StaffRequest[] = [
  {
    id: "NB-2026-0145",
    title: "حريق مركبة",
    text: "حريق مركبة في قارعة الطريق بحي النموذج في عرعر",
    kind: "report",
    category: "طوارئ",
    priority: "عالية",
    status: "بانتظار التوجيه",
    suggestedSectors: [
      "الدفاع المدني (المطافئ)",
      "الهلال الأحمر (الإسعاف)",
      "الشرطة",
      "المرور",
    ],
    assignedSectors: [],
  },
  {
    id: "NB-2026-0142",
    title: "تجمع مياه",
    text: "تجمع مياه بجانب مدرسة في عرعر",
    kind: "report",
    category: "خدمات عامة",
    priority: "متوسطة",
    status: "بانتظار التوجيه",
    suggestedSectors: ["وزارة المياه", "الأمانة"],
    assignedSectors: [],
  },
  {
    id: "NB-2026-0143",
    title: "إنارة معطلة",
    text: "إنارة لا تعمل في شارع عام",
    kind: "report",
    category: "خدمات عامة",
    priority: "متوسطة",
    status: "بانتظار التوجيه",
    suggestedSectors: ["قطاع الكهرباء", "الأمانة"],
    assignedSectors: [],
  },
  {
    id: "NB-2026-0146",
    title: "حادث مروري",
    text: "اصطدام مركبتين على دوار الملك فهد مع إصابات",
    kind: "report",
    category: "طوارئ",
    priority: "عالية",
    status: "تم التوجيه إلى المرور، الهلال الأحمر (الإسعاف)، الشرطة",
    suggestedSectors: [
      "المرور",
      "الهلال الأحمر (الإسعاف)",
      "الشرطة",
    ],
    assignedSectors: [
      "المرور",
      "الهلال الأحمر (الإسعاف)",
      "الشرطة",
    ],
  },
  {
    id: "NB-2026-0144",
    title: "تحسين الحاويات",
    text: "اقتراح زيادة حاويات النظافة قرب الحديقة",
    kind: "suggestion",
    category: "بنية تحتية",
    priority: "منخفضة",
    status: "تم التوجيه إلى الأمانة",
    suggestedSectors: ["الأمانة"],
    assignedSectors: ["الأمانة"],
    followUp: true,
  },
  {
    id: "NB-2026-0141",
    title: "انقطاع كهرباء",
    text: "انقطاع كهرباء في حي المساعدية",
    kind: "report",
    category: "خدمات عامة",
    priority: "متوسطة",
    status: "تم التوجيه إلى قطاع الكهرباء",
    suggestedSectors: ["قطاع الكهرباء"],
    assignedSectors: ["قطاع الكهرباء"],
  },
];
