import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const DEFAULT_CENTER = { lat: 35.6762, lng: 139.6503 }; // Tokyo fallback

async function geocodeWithNominatim(query) {
  const url =
    "https://nominatim.openstreetmap.org/search?" +
    new URLSearchParams({
      q: query,
      format: "json",
      limit: "1",
    });

  const res = await fetch(url, {
    headers: {
      // Nominatim asks for a valid User-Agent/Referer; browsers set Referer automatically.
      // Keeping headers minimal helps avoid CORS issues.
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
  const data = await res.json();
  if (!data?.length) return null;

  return { lat: Number(data[0].lat), lng: Number(data[0].lon), displayName: data[0].display_name };
}

export default function MapSection({ locationName }) {
  const [pos, setPos] = useState(DEFAULT_CENTER);
  const [label, setLabel] = useState("Tokyo");
  const [error, setError] = useState("");

  // re-render MapContainer when position changes (simple approach)
  const mapKey = useMemo(() => `${pos.lat},${pos.lng}`, [pos.lat, pos.lng]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setError("");
      if (!locationName || !locationName.trim()) return;

      try {
        const result = await geocodeWithNominatim(locationName.trim());
        if (cancelled) return;

        if (!result) {
          setError("Location not found. Try a more specific name (e.g., 'Shibuya, Tokyo').");
          return;
        }

        setPos({ lat: result.lat, lng: result.lng });
        setLabel(result.displayName);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to geocode location.");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [locationName]);

  return (
    <div className="card">
      <div className="section-title">📍 Map (Free)</div>
      <p>
        <strong>Location:</strong> {locationName || "—"}
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ borderRadius: "14px", overflow: "hidden" }}>
        <MapContainer
          key={mapKey}
          center={[pos.lat, pos.lng]}
          zoom={13}
          style={{ height: 360, width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[pos.lat, pos.lng]}>
            <Popup>{label}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}