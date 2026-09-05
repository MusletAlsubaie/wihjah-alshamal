"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import BottomNav from "../components/BottomNav";
import HomeLanding from "../components/HomeLanding";
import ImageAttachField from "../components/ImageAttachField";
import LocationMapPicker, { type MapLocation } from "../components/LocationMapPicker";
import ProjectIdea from "../components/ProjectIdea";
import SiteHeader, { type AppScreen } from "../components/SiteHeader";
import SplashLanding from "../components/SplashLanding";
import StaffDashboard, { StaffLoginForm } from "../components/StaffDashboard";
import {
  DEMO_STAFF_REQUESTS,
  suggestSectors,
  type CitySector,
  type StaffRequest,
  type TicketKind,
} from "../lib/sectors";

type Screen = AppScreen | "splash" | "idea";
type Priority = "منخفضة" | "متوسطة" | "عالية";

const SUGGESTION_CATEGORIES = [
  "خدمات",
  "بنية تحتية",
  "تجربة مستفيد",
  "أخرى",
] as const;

function StatusChip({ status }: { status: string }) {
  return <span className="chip">{status}</span>;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [requestKind, setRequestKind] = useState<TicketKind>("report");

  const [title, setTitle] = useState("تجمع مياه بجانب مدرسة");
  const [description, setDescription] = useState(
    "يوجد تجمع مياه بجانب مدرسة في عرعر ويحتاج معالجة عاجلة"
  );
  const [priority, setPriority] = useState<Priority>("متوسطة");
  const [category, setCategory] = useState<(typeof SUGGESTION_CATEGORIES)[number]>("خدمات");
  const [followUp, setFollowUp] = useState(true);
  const [mapLocation, setMapLocation] = useState<MapLocation>({
    label: "عرعر - حي نموذجي",
    lat: 30.9756,
    lng: 41.0381,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("NB-2026-0142");
  const [ticketComment, setTicketComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);

  const [staffRequests, setStaffRequests] =
    useState<StaffRequest[]>(DEMO_STAFF_REQUESTS);
  const [staffLoggedIn, setStaffLoggedIn] = useState(false);
  const [staffName, setStaffName] = useState("");

  const navScreen: AppScreen =
    screen === "splash" || screen === "home"
      ? "home"
      : screen === "new" || screen === "result" || screen === "idea"
        ? "project"
        : screen;

  const trackStatus = useMemo(() => {
    const item = staffRequests.find((r) => r.id === requestId);
    if (item?.assignedSectors?.length) {
      return `تم التوجيه إلى ${item.assignedSectors.join("، ")}`;
    }
    if (submitted) return "بانتظار توجيه الموظف";
    return item?.status || "بانتظار التوجيه";
  }, [staffRequests, requestId, submitted]);

  const canSubmit =
    title.trim().length >= 3 && description.trim().length >= 8;

  function openForm(kind: TicketKind) {
    setRequestKind(kind);
    if (kind === "report") {
      setTitle("تجمع مياه بجانب مدرسة");
      setDescription("يوجد تجمع مياه بجانب مدرسة في عرعر ويحتاج معالجة عاجلة");
      setPriority("متوسطة");
    } else {
      setTitle("تحسين تجربة تقديم البلاغات");
      setDescription("أقترح إضافة تنبيهات فورية للمستفيد عند كل تحديث لحالة الطلب");
      setCategory("تجربة مستفيد");
      setFollowUp(true);
    }
    setScreen("new");
  }

  function submitTicket() {
    if (!canSubmit) return;

    const id = `NB-2026-${String(1400 + staffRequests.length + 1).padStart(4, "0")}`;
    const suggested = suggestSectors(`${title} ${description}`, requestKind);

    const incoming: StaffRequest = {
      id,
      title: title.trim(),
      text: description.trim(),
      kind: requestKind,
      category:
        requestKind === "suggestion" ? category : `إبلاغ — ${priority}`,
      priority: requestKind === "report" ? priority : "منخفضة",
      status: "بانتظار التوجيه",
      suggestedSectors: suggested,
      assignedSectors: [],
      followUp: requestKind === "suggestion" ? followUp : false,
    };

    setStaffRequests((prev) => [incoming, ...prev]);
    setRequestId(id);
    setSubmitted(true);
    setComments([]);
    setTicketComment("");
    setScreen("result");
  }

  function handleStaffRedirect(id: string, sectors: CitySector[]) {
    setStaffRequests((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              assignedSectors: sectors,
              status: `تم التوجيه إلى ${sectors.join("، ")}`,
            }
          : item
      )
    );
  }

  function addComment() {
    const value = ticketComment.trim();
    if (!value) return;
    setComments((prev) => [...prev, value]);
    setTicketComment("");
  }

  function navigate(next: AppScreen) {
    if (next === "project") {
      setScreen("home");
      return;
    }
    if (next === "dashboard") {
      setScreen("dashboard");
      return;
    }
    setScreen(next);
  }

  if (screen === "splash") {
    return (
      <main className="app-shell app-shell--splash">
        <SplashLanding onStart={() => setScreen("home")} />
      </main>
    );
  }

  if (screen === "home") {
    return (
      <main className="app-shell app-shell--orbit">
        <HomeLanding
          onReport={() => openForm("report")}
          onSuggest={() => openForm("suggestion")}
          onTrack={() => setScreen("track")}
          onIdea={() => setScreen("idea")}
          onStaff={() => setScreen("dashboard")}
        />
      </main>
    );
  }

  return (
    <main className="app-shell app-shell--nav">
      <SiteHeader onNavigate={navigate} />

      <section className="notice">
        نموذج أولي وفق مواصفات التطبيق — بيانات تجريبية فقط ولا يتصل بأي نظام حكومي
        فعلي. التفاصيل في <code>docs/SPEC.md</code>
      </section>

      {screen === "idea" && (
        <ProjectIdea
          onBack={() => setScreen("home")}
          onStartReport={() => openForm("report")}
        />
      )}

      {screen === "new" && (
        <section className="page-wrap">
          <div className="page-heading">
            <span className="eyebrow">
              {requestKind === "report" ? "إبلاغ" : "اقتراح"}
            </span>
            <h1>
              {requestKind === "report" ? "تقديم بلاغ جديد" : "تقديم اقتراح جديد"}
            </h1>
            <p>
              {requestKind === "report"
                ? "أدخل العنوان والوصف والأولوية والموقع إن وجد، ثم أرسل لاستلام رقم تذكرة."
                : "أدخل عنوان الاقتراح وتفاصيله والفئة، ويمكنك تفعيل المتابعة والتعليق."}
            </p>
          </div>

          <div className="card form-card">
            <label>
              <span>العنوان</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                placeholder="عنوان مختصر"
              />
            </label>

            <label>
              <span>{requestKind === "report" ? "الوصف" : "التفاصيل"}</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                maxLength={1000}
                placeholder="اشرح التفاصيل بوضوح..."
              />
              <small>{description.length}/1000</small>
            </label>

            {requestKind === "report" ? (
              <>
                <label>
                  <span>مستوى الأولوية</span>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                  >
                    <option value="منخفضة">منخفضة</option>
                    <option value="متوسطة">متوسطة</option>
                    <option value="عالية">عالية</option>
                  </select>
                </label>

                <LocationMapPicker value={mapLocation} onChange={setMapLocation} />
              </>
            ) : (
              <>
                <label>
                  <span>الفئة</span>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as (typeof SUGGESTION_CATEGORIES)[number])
                    }
                  >
                    {SUGGESTION_CATEGORIES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={followUp}
                    onChange={(e) => setFollowUp(e.target.checked)}
                  />
                  <span>أرغب بمتابعة الاقتراح والتعليق داخل التطبيق</span>
                </label>
              </>
            )}

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
              onClick={submitTicket}
              disabled={!canSubmit}
            >
              إرسال واستلام رقم تذكرة
            </button>
          </div>
        </section>
      )}

      {screen === "result" && (
        <section className="page-wrap">
          <div className="page-heading">
            <span className="eyebrow">تم الاستلام</span>
            <h1>تم إنشاء التذكرة بنجاح</h1>
            <p>احتفظ برقم التذكرة لمتابعة الحالة لاحقًا.</p>
          </div>

          <div className="card result-card">
            <div className="success-icon">✓</div>
            <h2>رقم التذكرة</h2>
            <strong className="ticket-id">{requestId}</strong>
            <p className="ticket-meta">
              النوع: {requestKind === "report" ? "إبلاغ" : "اقتراح"} — الحالة: بانتظار
              توجيه الموظف
            </p>

            <div className="actions" style={{ justifyContent: "center" }}>
              <button type="button" className="secondary" onClick={() => setScreen("project")}>
                العودة للمشروع
              </button>
              <button type="button" className="primary" onClick={() => setScreen("track")}>
                متابعة التذكرة
              </button>
            </div>
          </div>
        </section>
      )}

      {screen === "track" && (
        <section className="page-wrap">
          <div className="page-heading">
            <span className="eyebrow">متابعة موحدة</span>
            <h1>حالة التذكرة</h1>
            <p>
              {submitted
                ? "تم إنشاء التذكرة ووصولها لطابور الموظف."
                : "عرض تجريبي لتذكرة سابقة."}
            </p>
          </div>

          <div className="card tracking-card">
            <div className="request-summary">
              <div>
                <span>رقم التذكرة</span>
                <strong>{requestId}</strong>
              </div>
              <StatusChip status={trackStatus} />
            </div>

            <div className="timeline">
              {[
                ["تم الاستلام", true],
                ["تم التصنيف الأولي", true],
                ["بانتظار الموظف", true],
                [
                  "إعادة التوجيه للجهة",
                  Boolean(
                    staffRequests.find((r) => r.id === requestId)?.assignedSectors
                      ?.length
                  ),
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

            {followUp ||
            staffRequests.find((r) => r.id === requestId)?.followUp ||
            requestKind === "suggestion" ? (
              <div className="comments-box">
                <h3>التعليقات والمتابعة</h3>
                {comments.length === 0 ? (
                  <p className="muted">لا توجد تعليقات بعد.</p>
                ) : (
                  <ul className="comment-list">
                    {comments.map((c, i) => (
                      <li key={`${c}-${i}`}>{c}</li>
                    ))}
                  </ul>
                )}
                <label>
                  <span>أضف تعليقًا</span>
                  <textarea
                    rows={3}
                    value={ticketComment}
                    onChange={(e) => setTicketComment(e.target.value)}
                    placeholder="اكتب ملاحظتك للمتابعة..."
                  />
                </label>
                <button
                  type="button"
                  className="secondary full"
                  onClick={addComment}
                  disabled={!ticketComment.trim()}
                >
                  إرسال التعليق
                </button>
              </div>
            ) : null}

            <div className="info-box">
              يصل الطلب إلى لوحة الموظف ليراجع الجهة المقترحة ثم يؤكد إعادة التوجيه.
            </div>

            <button
              type="button"
              className="secondary full"
              onClick={() => setScreen("dashboard")}
            >
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
            onLogout={() => {
              setStaffLoggedIn(false);
              setStaffName("");
            }}
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

      <BottomNav active={navScreen} onNavigate={navigate} />
    </main>
  );
}
