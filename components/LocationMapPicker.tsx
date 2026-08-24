"use client";

import { useEffect, useId, useRef, useState } from "react";

export type MapLocation = {
  label: string;
  lat: number | null;
  lng: number | null;
};

type LocationMapPickerProps = {
  value: MapLocation;
  onChange: (next: MapLocation) => void;
};

declare global {
  interface Window {
    google?: {
      maps: {
        Map: new (
          el: HTMLElement,
          opts: Record<string, unknown>
        ) => {
          setCenter: (c: { lat: number; lng: number }) => void;
          setZoom: (z: number) => void;
          addListener: (event: string, fn: (e: { latLng?: { lat: () => number; lng: () => number } }) => void) => void;
        };
        Marker: new (opts: Record<string, unknown>) => {
          setPosition: (c: { lat: number; lng: number }) => void;
          setMap: (map: unknown) => void;
        };
        event: { clearInstanceListeners: (obj: unknown) => void };
      };
    };
    __wihjahMapsInit?: () => void;
  }
}

const DEFAULT_CENTER = { lat: 30.9756, lng: 41.0381 }; // عرعر
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

function embedSrc(lat: number, lng: number) {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=15&hl=ar&output=embed`;
}

function searchEmbedSrc(query: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=14&hl=ar&output=embed`;
}

async function reverseLabel(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ar`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) throw new Error("reverse failed");
    const data = (await res.json()) as { display_name?: string };
    return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

export default function LocationMapPicker({ value, onChange }: LocationMapPickerProps) {
  const mapHostId = useId();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<ReturnType<NonNullable<typeof window.google>["maps"]["Map"]> | null>(null);
  const markerInstance = useRef<ReturnType<NonNullable<typeof window.google>["maps"]["Marker"]> | null>(null);
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState(value.label);
  const [interactiveReady, setInteractiveReady] = useState(false);

  const lat = value.lat ?? DEFAULT_CENTER.lat;
  const lng = value.lng ?? DEFAULT_CENTER.lng;

  useEffect(() => {
    setQuery(value.label);
  }, [value.label]);

  useEffect(() => {
    if (!MAPS_KEY || !mapRef.current) return;

    let cancelled = false;

    function initMap() {
      if (cancelled || !mapRef.current || !window.google?.maps) return;

      const center = { lat, lng };
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 14,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      const marker = new window.google.maps.Marker({
        position: center,
        map,
        draggable: true,
      });

      map.addListener("click", async (event) => {
        const nextLat = event.latLng?.lat();
        const nextLng = event.latLng?.lng();
        if (nextLat == null || nextLng == null) return;
        marker.setPosition({ lat: nextLat, lng: nextLng });
        setStatus("جاري تحديث العنوان...");
        const label = await reverseLabel(nextLat, nextLng);
        onChange({ label, lat: nextLat, lng: nextLng });
        setStatus("تم تحديد الموقع على الخريطة");
      });

      // Drag support via map click reposition is enough without Marker drag typing complexity
      markerInstance.current = marker;
      mapInstance.current = map;
      setInteractiveReady(true);
    }

    if (window.google?.maps) {
      initMap();
    } else {
      const existing = document.querySelector<HTMLScriptElement>("script[data-wihjah-maps]");
      window.__wihjahMapsInit = () => {
        if (!cancelled) initMap();
      };
      if (!existing) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&language=ar&callback=__wihjahMapsInit`;
        script.async = true;
        script.dataset.wihjahMaps = "1";
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (mapInstance.current && window.google?.maps) {
        window.google.maps.event.clearInstanceListeners(mapInstance.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MAPS_KEY]);

  useEffect(() => {
    if (!interactiveReady || !mapInstance.current || !markerInstance.current) return;
    if (value.lat == null || value.lng == null) return;
    const center = { lat: value.lat, lng: value.lng };
    mapInstance.current.setCenter(center);
    markerInstance.current.setPosition(center);
  }, [value.lat, value.lng, interactiveReady]);

  async function useMyLocation() {
    if (!navigator.geolocation) {
      setStatus("المتصفح لا يدعم تحديد الموقع");
      return;
    }
    setStatus("جاري تحديد موقعك...");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const nextLat = pos.coords.latitude;
        const nextLng = pos.coords.longitude;
        const label = await reverseLabel(nextLat, nextLng);
        onChange({ label, lat: nextLat, lng: nextLng });
        setStatus("تم تحديد موقعك الحالي");
      },
      () => setStatus("تعذر الوصول للموقع. تحقق من إذن الموقع."),
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

  async function applySearch() {
    const text = query.trim();
    if (!text) return;
    setStatus("جاري البحث...");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(text)}&accept-language=ar`,
        { headers: { Accept: "application/json" } }
      );
      const data = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>;
      if (!data.length) {
        onChange({ label: text, lat: value.lat, lng: value.lng });
        setStatus("تم حفظ العنوان — حرّك الخريطة أو استخدم موقعك للدقة");
        return;
      }
      const nextLat = Number(data[0].lat);
      const nextLng = Number(data[0].lon);
      onChange({ label: data[0].display_name || text, lat: nextLat, lng: nextLng });
      setStatus("تم تحديث الموقع من البحث");
    } catch {
      onChange({ label: text, lat: value.lat, lng: value.lng });
      setStatus("تم حفظ النص — تعذر البحث الجغرافي مؤقتًا");
    }
  }

  return (
    <div className="map-picker">
      <div className="map-picker-head">
        <span>تحديد الموقع عبر خرائط جوجل</span>
        <small>
          {MAPS_KEY
            ? "انقر على الخريطة أو اسحب العلامة لتحديد النقطة"
            : "استخدم موقعك أو ابحث عن عنوانًا لعرضه على خرائط جوجل"}
        </small>
      </div>

      <div className="map-picker-tools">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن حي / شارع / معلم..."
          aria-label="بحث الموقع"
        />
        <button type="button" className="secondary" onClick={applySearch}>
          بحث
        </button>
        <button type="button" className="primary" onClick={useMyLocation}>
          موقعي الحالي
        </button>
      </div>

      <div className="map-picker-canvas">
        {MAPS_KEY ? (
          <div ref={mapRef} id={mapHostId} className="map-picker-google" />
        ) : (
          <iframe
            title="خرائط جوجل"
            className="map-picker-embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={
              value.lat != null && value.lng != null
                ? embedSrc(value.lat, value.lng)
                : searchEmbedSrc(value.label || "عرعر")
            }
          />
        )}
      </div>

      <div className="map-picker-meta">
        <span>
          {value.lat != null && value.lng != null
            ? `${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}`
            : "لم يتم تثبيت إحداثيات بعد"}
        </span>
        {status ? <small>{status}</small> : null}
      </div>
    </div>
  );
}
