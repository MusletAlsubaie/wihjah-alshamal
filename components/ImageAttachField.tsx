"use client";

import { useEffect, useId, useRef, useState } from "react";

type ImageAttachFieldProps = {
  previewUrl: string | null;
  fileName: string | null;
  onChange: (next: { previewUrl: string | null; fileName: string | null }) => void;
};

export default function ImageAttachField({
  previewUrl,
  fileName,
  onChange,
}: ImageAttachFieldProps) {
  const cameraInputId = useId();
  const fileInputId = useId();
  const cameraRef = useRef<HTMLInputElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFiles(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("يرجى اختيار ملف صورة فقط");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("حجم الصورة كبير جدًا (الحد 8MB في النموذج)");
      return;
    }

    setError("");
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    onChange({ previewUrl: url, fileName: file.name });
  }

  function clearImage() {
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    onChange({ previewUrl: null, fileName: null });
    if (cameraRef.current) cameraRef.current.value = "";
    if (fileRef.current) fileRef.current.value = "";
    setError("");
  }

  return (
    <div className="image-attach">
      <div className="image-attach-head">
        <b>إضافة صورة (اختياري)</b>
        <span>اختر الكاميرا أو ملفًا من الجهاز — لا يتم الرفع لخادم فعلي في هذا النموذج.</span>
      </div>

      <div className="image-source-grid">
        <button
          type="button"
          className="image-source-card"
          onClick={() => cameraRef.current?.click()}
        >
          <span className="image-source-icon" aria-hidden>
            📷
          </span>
          <b>الكاميرا</b>
          <small>التقاط صورة مباشرة</small>
        </button>

        <button
          type="button"
          className="image-source-card"
          onClick={() => fileRef.current?.click()}
        >
          <span className="image-source-icon" aria-hidden>
            📁
          </span>
          <b>الملفات</b>
          <small>اختيار من الاستوديو / الجهاز</small>
        </button>
      </div>

      <input
        id={cameraInputId}
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        id={fileInputId}
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error ? <p className="image-attach-error">{error}</p> : null}

      {previewUrl ? (
        <div className="image-preview">
          <div className="image-preview-frame">
            <img
              src={previewUrl}
              alt={fileName ? `معاينة ${fileName}` : "معاينة الصورة المرفقة"}
              className="image-preview-img"
            />
          </div>
          <div className="image-preview-meta">
            <span>{fileName || "صورة مرفقة"}</span>
            <button type="button" className="secondary" onClick={clearImage}>
              إزالة
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
