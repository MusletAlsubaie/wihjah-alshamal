"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  CITY_SECTORS,
  primarySuggestion,
  type CitySector,
  type StaffRequest,
} from "../lib/sectors";

type StaffDashboardProps = {
  requests: StaffRequest[];
  onRedirect: (id: string, sectors: CitySector[]) => void;
  onLogout: () => void;
  staffName: string;
};

type ListFilter = "waiting" | "routed" | "all" | "sectors";

type SectorStat = {
  sector: CitySector;
  assigned: number;
  waiting: number;
  total: number;
  completion: number;
};

function StatusChip({ status }: { status: string }) {
  return <span className="chip">{status}</span>;
}

function isWaiting(r: StaffRequest) {
  return r.assignedSectors.length === 0;
}

function isRouted(r: StaffRequest) {
  return r.assignedSectors.length > 0;
}

export function StaffLoginForm({
  onSuccess,
}: {
  onSuccess: (username: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(event: FormEvent) {
    event.preventDefault();
    const user = username.trim();
    const pass = password.trim();

    if (
      (user === "موظف" || user === "staff" || user === "admin") &&
      (pass === "1234" || pass === "staff")
    ) {
      setError("");
      onSuccess(user);
      return;
    }

    setError("اسم المستخدم أو كلمة المرور غير صحيحة");
  }

  return (
    <section className="page-wrap">
      <div className="page-heading">
        <span className="eyebrow">دخول الموظف</span>
        <h1>لوحة الموظف</h1>
        <p>أدخل بيانات الدخول التجريبية للوصول إلى الطلبات وإعادة التوجيه.</p>
      </div>

      <form className="card form-card staff-login-card" onSubmit={handleLogin}>
        <label>
          <span>اسم المستخدم</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="موظف"
            autoComplete="username"
          />
        </label>

        <label>
          <span>كلمة المرور</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••"
            autoComplete="current-password"
          />
        </label>

        {error ? <p className="staff-login-error">{error}</p> : null}

        <button type="submit" className="primary full" disabled={!username || !password}>
          الدخول
        </button>

        <div className="info-box staff-login-hint">
          للتجربة استخدم: المستخدم <b>موظف</b> وكلمة المرور <b>1234</b>
        </div>
      </form>
    </section>
  );
}

function RequestCard({
  request,
  choice,
  done,
  onToggle,
  onConfirm,
}: {
  request: StaffRequest;
  choice: CitySector[];
  done: boolean;
  onToggle: (sector: CitySector, base: CitySector[]) => void;
  onConfirm: () => void;
}) {
  return (
    <article className="request-row staff-request-row">
      <div>
        <div className="staff-request-top">
          <strong>{request.id}</strong>
          <StatusChip status={request.status} />
        </div>
        <p>
          <b>{request.title}</b> — {request.text}
        </p>
        <div className="request-meta staff-request-tags">
          <span>{request.kind === "report" ? "إبلاغ" : "اقتراح"}</span>
          <span>{request.category}</span>
          <span>{request.priority}</span>
        </div>
        <div className="staff-suggest">
          <div>المقترحات حسب نوع الطلب:</div>
          <div className="suggest-chips">
            {request.suggestedSectors.map((s) => (
              <span className="chip chip--suggest" key={s}>
                {s}
              </span>
            ))}
          </div>
          {done ? (
            <div className="assigned-line">
              تم التوجيه إلى: <b>{request.assignedSectors.join("، ")}</b>
            </div>
          ) : null}
        </div>
      </div>

      <div className="staff-redirect">
        {done ? (
          <>
            <span className="staff-redirect-label">الجهات المستلمة</span>
            <div className="suggest-chips">
              {request.assignedSectors.map((s) => (
                <span className="chip chip--assigned" key={s}>
                  {s}
                </span>
              ))}
            </div>
            <button type="button" className="primary" disabled>
              تم التوجيه
            </button>
          </>
        ) : (
          <>
            <span className="staff-redirect-label">اختر جهة أو أكثر للتوجيه</span>
            <div className="sector-check-grid">
              {CITY_SECTORS.map((sector) => {
                const checked = choice.includes(sector);
                const isSuggested = request.suggestedSectors.includes(sector);
                return (
                  <label
                    key={sector}
                    className={`sector-check ${isSuggested ? "is-suggested" : ""} ${checked ? "is-checked" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(sector, request.suggestedSectors)}
                    />
                    <span>
                      {sector}
                      {isSuggested ? " ★" : ""}
                    </span>
                  </label>
                );
              })}
            </div>
            <button
              type="button"
              className="primary"
              disabled={choice.length === 0}
              onClick={onConfirm}
            >
              {`تأكيد إعادة التوجيه (${choice.length})`}
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default function StaffDashboard({
  requests,
  onRedirect,
  onLogout,
  staffName,
}: StaffDashboardProps) {
  const [selected, setSelected] = useState<Record<string, CitySector[]>>({});
  const [flash, setFlash] = useState("");
  const [listFilter, setListFilter] = useState<ListFilter>("waiting");

  const waitingList = useMemo(() => requests.filter(isWaiting), [requests]);
  const routedList = useMemo(() => requests.filter(isRouted), [requests]);

  const sectorStats = useMemo((): SectorStat[] => {
    return CITY_SECTORS.map((sector) => {
      const assigned = requests.filter((r) =>
        r.assignedSectors.includes(sector)
      ).length;
      const waiting = requests.filter(
        (r) => isWaiting(r) && r.suggestedSectors.includes(sector)
      ).length;
      const total = assigned + waiting;
      const completion = total === 0 ? 0 : Math.round((assigned / total) * 100);
      return { sector, assigned, waiting, total, completion };
    }).sort((a, b) => b.total - a.total || b.assigned - a.assigned);
  }, [requests]);

  const activeSectors = useMemo(
    () => sectorStats.filter((s) => s.total > 0),
    [sectorStats]
  );

  const visibleRequests = useMemo(() => {
    if (listFilter === "waiting") return waitingList;
    if (listFilter === "routed") return routedList;
    if (listFilter === "sectors") return [];
    return requests;
  }, [listFilter, waitingList, routedList, requests]);

  const listTitle =
    listFilter === "waiting"
      ? "بانتظار التوجيه"
      : listFilter === "routed"
        ? "تم التوجيه"
        : listFilter === "sectors"
          ? "الجهات المتاحة"
          : "كل الطلبات";

  const listCountLabel =
    listFilter === "sectors"
      ? `${CITY_SECTORS.length} جهة`
      : `${visibleRequests.length} سجلات`;

  const overallPct = requests.length
    ? Math.round((routedList.length / requests.length) * 100)
    : 0;

  function sectorsFor(request: StaffRequest): CitySector[] {
    if (Object.prototype.hasOwnProperty.call(selected, request.id)) {
      return selected[request.id];
    }
    if (request.assignedSectors.length) return request.assignedSectors;
    return request.suggestedSectors.length
      ? request.suggestedSectors
      : [primarySuggestion([])];
  }

  function toggleSector(
    requestId: string,
    sector: CitySector,
    base: CitySector[]
  ) {
    const current = selected[requestId] ?? base;
    const next = current.includes(sector)
      ? current.filter((s) => s !== sector)
      : [...current, sector];
    setSelected((prev) => ({ ...prev, [requestId]: next }));
  }

  function confirmRedirect(request: StaffRequest) {
    const sectors = sectorsFor(request);
    if (!sectors.length) {
      setFlash("اختر جهة واحدة على الأقل قبل التأكيد");
      return;
    }
    onRedirect(request.id, sectors);
    setFlash(
      `تم تأكيد إعادة توجيه ${request.id} إلى: ${sectors.join("، ")}`
    );
    setListFilter("routed");
  }

  return (
    <section className="page-wrap wide">
      <div className="page-heading staff-heading">
        <div>
          <span className="eyebrow">لوحة الموظف</span>
          <h1>نظرة تشغيلية موحدة</h1>
          <p>
            مرحبًا {staffName} — تابع الطوابير والجهات ثم أكّد التوجيه لجهة أو
            أكثر.
          </p>
        </div>
        <button type="button" className="secondary" onClick={onLogout}>
          تسجيل الخروج
        </button>
      </div>

      {flash ? <div className="staff-flash">{flash}</div> : null}

      <div className="stats-grid">
        <button
          type="button"
          className={`card stat stat-btn ${listFilter === "waiting" ? "is-active" : ""}`}
          onClick={() => setListFilter("waiting")}
        >
          <strong>{waitingList.length}</strong>
          <span>بانتظار التوجيه</span>
        </button>
        <button
          type="button"
          className={`card stat stat-btn ${listFilter === "routed" ? "is-active" : ""}`}
          onClick={() => setListFilter("routed")}
        >
          <strong>{routedList.length}</strong>
          <span>تم التوجيه</span>
        </button>
        <button
          type="button"
          className={`card stat stat-btn ${listFilter === "all" ? "is-active" : ""}`}
          onClick={() => setListFilter("all")}
        >
          <strong>{requests.length}</strong>
          <span>إجمالي المعروض</span>
        </button>
        <button
          type="button"
          className={`card stat stat-btn ${listFilter === "sectors" ? "is-active" : ""}`}
          onClick={() => setListFilter("sectors")}
        >
          <strong>{CITY_SECTORS.length}</strong>
          <span>الجهات المتاحة</span>
        </button>
      </div>

      <div className="card table-card">
        <div className="table-title">
          <h2>{listTitle}</h2>
          <span>
            {listFilter === "sectors"
              ? `${activeSectors.length} عليها طلبات · إنجاز ${overallPct}%`
              : listCountLabel}
          </span>
        </div>

        <div className="ops-tabs" role="tablist" aria-label="تصفية العرض">
          {(
            [
              ["waiting", "بانتظار التوجيه", waitingList.length],
              ["routed", "تم التوجيه", routedList.length],
              ["all", "الكل", requests.length],
              ["sectors", "الجهات المتاحة", CITY_SECTORS.length],
            ] as const
          ).map(([key, label, count]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={listFilter === key}
              className={`ops-tab ${listFilter === key ? "is-active" : ""}`}
              onClick={() => setListFilter(key)}
            >
              {label}
              <em>{count}</em>
            </button>
          ))}
        </div>

        {listFilter === "sectors" ? (
          <div className="request-list sector-list">
            {sectorStats.map((row) => (
              <article key={row.sector} className="request-row sector-list-row">
                <div>
                  <div className="staff-request-top">
                    <strong className="sector-list-name">{row.sector}</strong>
                    <StatusChip
                      status={
                        row.total === 0
                          ? "بدون طلبات"
                          : row.waiting > 0
                            ? "يوجد بانتظار"
                            : "مكتمل التوجيه"
                      }
                    />
                  </div>
                  <div className="sector-board-bar sector-list-bar">
                    <span style={{ width: `${row.completion}%` }} />
                  </div>
                  <div className="sector-board-meta">
                    <span>موجّه: {row.assigned}</span>
                    <span>بانتظار: {row.waiting}</span>
                    <span>الإجمالي: {row.total}</span>
                    <span>الإنجاز: {row.completion}%</span>
                  </div>
                </div>
                <div className="staff-redirect sector-list-side">
                  <span className="staff-redirect-label">ملخص الجهة</span>
                  <strong className="sector-list-pct">{row.completion}%</strong>
                  <span className="sector-list-side-hint">
                    {row.waiting
                      ? `${row.waiting} بانتظار التوجيه`
                      : row.assigned
                        ? `${row.assigned} تم توجيهها`
                        : "لا طلبات مرتبطة حاليًا"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="request-list">
            {visibleRequests.length === 0 ? (
              <p className="ops-empty">لا توجد طلبات في هذا القسم حاليًا.</p>
            ) : (
              visibleRequests.map((r) => {
                const done = isRouted(r);
                return (
                  <RequestCard
                    key={r.id}
                    request={r}
                    choice={sectorsFor(r)}
                    done={done}
                    onToggle={(sector, base) =>
                      toggleSector(r.id, sector, base)
                    }
                    onConfirm={() => confirmRedirect(r)}
                  />
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
}
