"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import BrandLogo from "../components/BrandLogo";
import HeroSection from "../components/HeroSection";
import ImageAttachField from "../components/ImageAttachField";
import LocationMapPicker, { type MapLocation } from "../components/LocationMapPicker";
import SiteHeader, { type AppScreen } from "../components/SiteHeader";
import SplashLanding from "../components/SplashLanding";
import StaffDashboard, { StaffLoginForm } from "../components/StaffDashboard";
import {
  DEMO_STAFF_REQUESTS,
  suggestSector,
  type CitySector,
  type StaffRequest,
} from "../lib/sectors";

type Screen = AppScreen | "splash";
type RequestKind = "service" | "report";

type Classification = {
  category: string;
  subcategory: string;
  priority: "منخفضة" | "متوسطة" | "عالية";
  route: string;
  confidence: number;
};

function StatusChip({ status }: { status: string }) {
  return <span className="chip">{status}</span>;
}

function classify(text: string, kind: RequestKind): Classification {
  const value = text.trim().toLowerCase();
  const sector = suggestSector(text, kind);

  if (value.includes("ماء") || value.includes("مياه") || value.includes("تسرب")) {
    return {
      category: "خدمات عامة",
      subcategory: "مياه وتصريف",
      priority: "متوسطة",
      route: sector,
      confidence: 92,
    };
  }

  if (value.includes("إنارة") || value.includes("عمود") || value.includes("لمبة") || value.includes("كهرب")) {
    return {
      category: "خدمات عامة",
      subcategory: "إنارة / كهرباء",
      priority: "متوسطة",
      route: sector,
      confidence: 90,
    };
  }

  if (value.includes("حفرة") || value.includes("طريق") || value.includes("شارع")) {
    return {
      category: "طرق",
      subcategory: "صيانة الطرق",
      priority: "عالية",
      route: sector,
      confidence: 89,
    };
  }

  if (value.includes("نفايات") || value.includes("حاوية") || value.includes("نظافة")) {
    return {
      category: "خدمات بلدية",
      subcategory: "النظافة",
      priority: "متوسطة",
      route: sector,
      confidence: 91,
    };
  }

  if (value.includes("اتصال") || value.includes("انترنت") || value.includes("شبكة")) {
    return {
      category: "اتصالات",
      subcategory: "خدمات الاتصالات",
      priority: "متوسطة",
      route: sector,
      confidence: 88,
    };
  }

  return {
    category: kind === "report" ? "بلاغ عام" : "خدمة مستفيد",
    subcategory: "طلب عام",
    priority: "منخفضة",
    route: sector,
    confidence: 73,
  };
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [requestKind, setRequestKind] = useState<RequestKind>("service");
  const [description, setDescription] = useState("يوجد تجمع مياه بجانب مدرسة في عرعر");
  const [mapLocation, setMapLocation] = useState<MapLocation>({
    label: "عرعر - حي نموذجي",
    lat: 30.9756,
    lng: 41.0381,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [classification, setClassification] = useState<Classification | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("NB-2026-0142");
  const [staffRequests, setStaffRequests] = useState<StaffRequest[]>(DEMO_STAFF_REQUESTS);
  const [staffLoggedIn, setStaffLoggedIn] = useState(false);
  const [staffName, setStaffName] = useState("");

  const trackStatus = useMemo(() => {
    const item = staffRequests.find((r) => r.id === requestId);
    if (item?.assignedSector) return `تم التوجيه إلى ${item.assignedSector}`;
    if (submitted) return "بانتظار توجيه الموظف";
    return item?.status || "تم التوجيه";
  }, [staffRequests, requestId, submitted]);

  function openRequest(kind: RequestKind) {
    setRequestKind(kind);
    setScreen("new");
  }

  function openDashboard() {
    setScreen("dashboard");
  }

  function runClassification() {
    setClassification(classify(description, requestKind));
    setScreen("result");
  }

  function submitRequest() {
    const id = `NB-2026-${String(1400 + staffRequests.length + 1).padStart(4, "0")}`;
    const result = classification || classify(description, requestKind);
    const suggested = suggestSector(description, requestKind);

    const incoming: StaffRequest = {
      id,
      text: description.trim(),
      kind: requestKind,
      category: result.category,
      priority: result.priority,
      status: "بانتظار التوجيه",
      suggestedSector: suggested,
      assignedSector: null,
    };

    setStaffRequests((prev) => [incoming, ...prev]);
    setRequestId(id);
    setSubmitted(true);
    setScreen("track");
  }

  function handleStaffRedirect(id: string, sector: CitySector) {
    setStaffRequests((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              assignedSector: sector,
              status: `تم التوجيه إلى ${sector}`,
            }
          : item
      )
    );
  }

  function handleStaffLogout() {
    setStaffLoggedIn(false);
    setStaffName("");
  }

  if (screen === "splash") {
    return (
      <main className="app-shell app-shell--splash">
        <SplashLanding onStart={() => setScreen("home")} />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <SiteHeader
        onNavigate={(next) => {
          if (next === "new") openRequest("service");
          else if (next === "dashboard") openDashboard();
          else setScreen(next);
        }}
      />

      <section className="notice">
        نموذج أولي داعم لفكرة الإنباثون — يستخدم بيانات تجريبية فقط ولا يتصل بأي نظام
        حكومي فعلي.
      </section>

      {screen === "home" && (
        <section className="home-grid">
          <HeroSection
            onStart={() => openRequest("service")}
            onTrack={() => setScreen("track")}
          />

          <div className="card value-card">
            <div className="value-brand">
              <BrandLogo variant="primary" />
            </div>
            <h2>الفكرة في 4 خطوات</h2>
            <ol className="steps">
              <li>
                <span>1</span> المستفيد يصف احتياجه
              </li>
              <li>
                <span>2</span> النظام يقترح التصنيف
              </li>
              <li>
                <span>3</span> الطلب يوجّه للمسار المناسب
              </li>
              <li>
                <span>4</span> المستفيد يتابع الحالة
              </li>
            </ol>
          </div>

          <div className="quick-grid">
            <button type="button" className="quick card" onClick={() => openRequest("service")}>
              <b>طلب خدمة</b>
              <span>ابدأ رحلة جديدة</span>
            </button>
            <button type="button" className="quick card" onClick={() => openRequest("report")}>
              <b>بلاغ</b>
              <span>صف المشكلة مباشرة</span>
            </button>
            <button type="button" className="quick card" onClick={() => setScreen("track")}>
              <b>استفسار</b>
              <span>تابع حالة طلبك</span>
            </button>
            <button type="button" className="quick card" onClick={openDashboard}>
              <b>لوحة الموظف</b>
              <span>دخول ثم إعادة التوجيه</span>
            </button>
          </div>
        </section>
      )}

      {screen === "new" && (
        <section className="page-wrap">
          <div className="page-heading">
            <span className="eyebrow">الخطوة 1 من 3</span>
            <h1>{requestKind === "report" ? "تقديم بلاغ" : "تقديم طلب خدمة"}</h1>
            <p>
              {requestKind === "report"
                ? "صف المشكلة وحدد موقعها وأرفق صورة إن أمكن."
                : "اشرح احتياجك وحدد الموقع وأرفق صورة داعمة إن رغبت."}
            </p>
          </div>

          <div className="card form-card">
            <label>
              <span>{requestKind === "report" ? "صف البلاغ" : "صف ما تحتاجه"}</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="مثال: يوجد تجمع مياه بجانب مدرسة..."
              />
              <small>{description.length}/500</small>
            </label>

            <LocationMapPicker value={mapLocation} onChange={setMapLocation} />

            <ImageAttachField
              previewUrl={imagePreview}
              fileName={imageName}
              onChange={({ previewUrl, fileName }) => {
                setImagePreview(previewUrl);
                setImageName(fileName);
              }}
            />

            <button
              type="button"
              className="primary full"
              onClick={runClassification}
              disabled={description.trim().length < 8}
            >
              تحليل الطلب
            </button>
          </div>
        </section>
      )}

      {screen === "result" && classification && (
        <section className="page-wrap">
          <div className="page-heading">
            <span className="eyebrow">الخطوة 2 من 3</span>
            <h1>تم تحليل طلبك</h1>
            <p>هذه نتيجة تجريبية قابلة للمراجعة قبل الإرسال.</p>
          </div>

          <div className="card result-card">
            <div className="success-icon">✓</div>
            <h2>التصنيف المقترح</h2>

            <div className="result-grid">
              <div>
                <span>التصنيف</span>
                <b>{classification.category}</b>
              </div>
              <div>
                <span>التصنيف الفرعي</span>
                <b>{classification.subcategory}</b>
              </div>
              <div>
                <span>الأولوية</span>
                <b>{classification.priority}</b>
              </div>
              <div>
                <span>الجهة المقترحة</span>
                <b>{classification.route}</b>
              </div>
            </div>

            <div className="confidence">
              <span>درجة ثقة النموذج التجريبي</span>
              <strong>{classification.confidence}%</strong>
            </div>

            <div className="actions">
              <button type="button" className="secondary" onClick={() => setScreen("new")}>
                تعديل
              </button>
              <button type="button" className="primary" onClick={submitRequest}>
                إرسال الطلب
              </button>
            </div>
          </div>
        </section>
      )}

      {screen === "track" && (
        <section className="page-wrap">
          <div className="page-heading">
            <span className="eyebrow">متابعة موحدة</span>
            <h1>حالة الطلب</h1>
            <p>
              {submitted
                ? "تم إنشاء الطلب ووصوله لطابور الموظف."
                : "عرض تجريبي لطلب سابق."}
            </p>
          </div>

          <div className="card tracking-card">
            <div className="request-summary">
              <div>
                <span>رقم الطلب</span>
                <strong>{requestId}</strong>
              </div>
              <StatusChip status={trackStatus} />
            </div>

            <div className="timeline">
              {[
                ["تم الاستلام", true],
                ["تم التصنيف", true],
                ["بانتظار الموظف", true],
                [
                  "إعادة التوجيه للجهة",
                  Boolean(staffRequests.find((r) => r.id === requestId)?.assignedSector),
                ],
                ["مكتمل", false],
              ].map(([label, done], idx) => (
                <div
                  className={`timeline-row ${done ? "done" : ""}`}
                  key={String(label)}
                >
                  <span className="dot">{done ? "✓" : idx + 1}</span>
                  <div>
                    <b>{label}</b>
                    <small>
                      {done ? "تم تحديث الحالة تجريبيًا" : "بانتظار التحديث"}
                    </small>
                  </div>
                </div>
              ))}
            </div>

            <div className="info-box">
              يصل الطلب إلى لوحة الموظف ليراجع الجهة المقترحة (مثل قطاع المياه عند بلاغ
              تسرب) ثم يؤكد إعادة التوجيه.
            </div>

            <button type="button" className="secondary full" onClick={openDashboard}>
              فتح لوحة الموظف
            </button>
          </div>
        </section>
      )}

      {screen === "dashboard" &&
        (staffLoggedIn ? (
          <StaffDashboard
            requests={staffRequests}
            staffName={staffName}
            onRedirect={handleStaffRedirect}
            onLogout={handleStaffLogout}
          />
        ) : (
          <StaffLoginForm
            onSuccess={(name) => {
              setStaffName(name);
              setStaffLoggedIn(true);
            }}
          />
        ))}

      <footer>
        <div className="footer-inner">
          <a
            className="footer-enbthon"
            href="https://enb.gov.sa/enbthon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ENBTHON 2026"
          >
            <Image
              src="/branding/ENBTHON.jpeg"
              alt="ENBTHON 2026"
              width={120}
              height={120}
              className="footer-enbthon-img"
            />
          </a>
        </div>
      </footer>
    </main>
  );
}
