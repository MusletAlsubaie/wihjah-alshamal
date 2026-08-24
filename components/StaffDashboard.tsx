"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  CITY_SECTORS,
  type CitySector,
  type StaffRequest,
} from "../lib/sectors";

type StaffDashboardProps = {
  requests: StaffRequest[];
  onRedirect: (id: string, sector: CitySector) => void;
  onLogout: () => void;
  staffName: string;
};

function StatusChip({ status }: { status: string }) {
  return <span className="chip">{status}</span>;
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

    // بيانات تجريبية للعرض فقط
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

export default function StaffDashboard({
  requests,
  onRedirect,
  onLogout,
  staffName,
}: StaffDashboardProps) {
  const [selected, setSelected] = useState<Record<string, CitySector>>({});
  const [flash, setFlash] = useState<string>("");

  const stats = useMemo(() => {
    const waiting = requests.filter((r) => !r.assignedSector).length;
    const routed = requests.filter((r) => r.assignedSector).length;
    return [
      [String(waiting), "بانتظار التوجيه"],
      [String(routed), "تم التوجيه"],
      [String(requests.length), "إجمالي المعروض"],
      ["4", "قطاعات متاحة"],
    ] as const;
  }, [requests]);

  function sectorFor(request: StaffRequest): CitySector {
    return selected[request.id] || request.assignedSector || request.suggestedSector;
  }

  function confirmRedirect(request: StaffRequest) {
    const sector = sectorFor(request);
    onRedirect(request.id, sector);
    setFlash(`تم تأكيد إعادة توجيه ${request.id} إلى ${sector}`);
  }

  return (
    <section className="page-wrap wide">
      <div className="page-heading staff-heading">
        <div>
          <span className="eyebrow">لوحة الموظف</span>
          <h1>نظرة تشغيلية موحدة</h1>
          <p>
            مرحبًا {staffName} — راجع الطلبات واقترح الجهة ثم أكّد إعادة التوجيه.
          </p>
        </div>
        <button type="button" className="secondary" onClick={onLogout}>
          تسجيل الخروج
        </button>
      </div>

      {flash ? <div className="staff-flash">{flash}</div> : null}

      <div className="stats-grid">
        {stats.map(([value, label]) => (
          <div className="card stat" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="card table-card">
        <div className="table-title">
          <h2>الطلبات الأخيرة</h2>
          <span>{requests.length} سجلات</span>
        </div>

        <div className="request-list">
          {requests.map((r) => {
            const choice = sectorFor(r);
            const done = Boolean(r.assignedSector);

            return (
              <article key={r.id} className="request-row staff-request-row">
                <div>
                  <div className="staff-request-top">
                    <strong>{r.id}</strong>
                    <StatusChip status={r.status} />
                  </div>
                  <p>{r.text}</p>
                  <div className="request-meta staff-request-tags">
                    <span>{r.kind === "report" ? "بلاغ" : "طلب خدمة"}</span>
                    <span>{r.category}</span>
                    <span>{r.priority}</span>
                  </div>
                  <div className="staff-suggest">
                    المقترح حسب نوع الطلب: <b>{r.suggestedSector}</b>
                    {r.assignedSector ? (
                      <>
                        {" "}
                        — تم التوجيه إلى <b>{r.assignedSector}</b>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="staff-redirect">
                  <label>
                    <span>إعادة التوجيه إلى</span>
                    <select
                      value={choice}
                      disabled={done}
                      onChange={(e) =>
                        setSelected((prev) => ({
                          ...prev,
                          [r.id]: e.target.value as CitySector,
                        }))
                      }
                    >
                      {CITY_SECTORS.map((sector) => (
                        <option key={sector} value={sector}>
                          {sector}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="button"
                    className="primary"
                    disabled={done}
                    onClick={() => confirmRedirect(r)}
                  >
                    {done ? "تم التوجيه" : "تأكيد إعادة التوجيه"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
