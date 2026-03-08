import { useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Polyline, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { LatLng, MapDataState, DrawMode } from "@/hooks/useMapData";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const createIcon = (color: string) =>
  new L.DivIcon({
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 6px ${color};"></div>`,
    className: "",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const targetIcon = createIcon("hsl(38, 80%, 55%)");
const startIcon = createIcon("hsl(200, 80%, 55%)");

function ClickHandler({ onClick }: { onClick: (latlng: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

interface MapViewProps {
  data: MapDataState;
  drawMode: DrawMode;
  currentPolygon: LatLng[];
  onMapClick: (point: LatLng) => void;
}

export default function MapView({ data, drawMode, currentPolygon, onMapClick }: MapViewProps) {
  return (
    <div className={drawMode ? "custom-crosshair-cursor h-full" : "h-full"}>
      <MapContainer center={[32.08, 34.78]} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <ClickHandler onClick={onMapClick} />

        {/* Map Area */}
        {data.mapArea && (
          <Polygon
            positions={data.mapArea}
            pathOptions={{ color: "hsl(260, 60%, 55%)", fillOpacity: 0.1, weight: 2, dashArray: "8 4" }}
          />
        )}

        {/* No-Fly Zones */}
        {data.noFlyZones.map((zone, i) => (
          <Polygon
            key={`nfz-${i}`}
            positions={zone}
            pathOptions={{ color: "hsl(0, 70%, 50%)", fillOpacity: 0.2, weight: 2 }}
          />
        ))}

        {/* Flight Zones */}
        {data.flightZones.map((zone, i) => (
          <Polygon
            key={`fz-${i}`}
            positions={zone}
            pathOptions={{ color: "hsl(142, 60%, 45%)", fillOpacity: 0.15, weight: 2 }}
          />
        ))}

        {/* Targets */}
        {data.targets.map((pos, i) => (
          <Marker key={`t-${i}`} position={pos} icon={targetIcon} />
        ))}

        {/* Start */}
        {data.startLocation && <Marker position={data.startLocation} icon={startIcon} />}

        {/* Current drawing polygon preview */}
        {currentPolygon.length > 1 && (
          <Polyline
            positions={currentPolygon}
            pathOptions={{
              color:
                drawMode === "mapArea"
                  ? "hsl(260, 60%, 55%)"
                  : drawMode === "nfz"
                  ? "hsl(0, 70%, 50%)"
                  : "hsl(142, 60%, 45%)",
              weight: 2,
              dashArray: "4 4",
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
