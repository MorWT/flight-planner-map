import { useState, useCallback } from "react";

export type LatLng = [number, number];

export interface MapDataState {
  mapArea: LatLng[] | null;
  noFlyZones: LatLng[][];
  flightZones: LatLng[][];
  targets: LatLng[];
  startLocation: LatLng | null;
}

export type DrawMode = "mapArea" | "nfz" | "fz" | "target" | "start" | null;

export function useMapData() {
  const [data, setData] = useState<MapDataState>({
    mapArea: null,
    noFlyZones: [],
    flightZones: [],
    targets: [],
    startLocation: null,
  });
  const [drawMode, setDrawMode] = useState<DrawMode>(null);
  const [currentPolygon, setCurrentPolygon] = useState<LatLng[]>([]);

  const addPointToPolygon = useCallback((point: LatLng) => {
    setCurrentPolygon((prev) => [...prev, point]);
  }, []);

  const finishPolygon = useCallback(() => {
    if (currentPolygon.length < 3) return;
    setData((prev) => {
      if (drawMode === "mapArea") return { ...prev, mapArea: currentPolygon };
      if (drawMode === "nfz") return { ...prev, noFlyZones: [...prev.noFlyZones, currentPolygon] };
      if (drawMode === "fz") return { ...prev, flightZones: [...prev.flightZones, currentPolygon] };
      return prev;
    });
    setCurrentPolygon([]);
    setDrawMode(null);
  }, [currentPolygon, drawMode]);

  const cancelDraw = useCallback(() => {
    setCurrentPolygon([]);
    setDrawMode(null);
  }, []);

  const addMarker = useCallback(
    (point: LatLng) => {
      setData((prev) => {
        if (drawMode === "target") return { ...prev, targets: [...prev.targets, point] };
        if (drawMode === "start") return { ...prev, startLocation: point };
        return prev;
      });
      if (drawMode === "start") setDrawMode(null);
    },
    [drawMode]
  );

  const handleMapClick = useCallback(
    (point: LatLng) => {
      if (!drawMode) return;
      if (drawMode === "target" || drawMode === "start") {
        addMarker(point);
      } else {
        addPointToPolygon(point);
      }
    },
    [drawMode, addMarker, addPointToPolygon]
  );

  const removeNfz = useCallback((index: number) => {
    setData((prev) => ({ ...prev, noFlyZones: prev.noFlyZones.filter((_, i) => i !== index) }));
  }, []);

  const removeFz = useCallback((index: number) => {
    setData((prev) => ({ ...prev, flightZones: prev.flightZones.filter((_, i) => i !== index) }));
  }, []);

  const removeTarget = useCallback((index: number) => {
    setData((prev) => ({ ...prev, targets: prev.targets.filter((_, i) => i !== index) }));
  }, []);

  const clearMapArea = useCallback(() => {
    setData((prev) => ({ ...prev, mapArea: null }));
  }, []);

  const clearStart = useCallback(() => {
    setData((prev) => ({ ...prev, startLocation: null }));
  }, []);

  const exportJSON = useCallback(() => {
    const exportData = {
      mapArea: data.mapArea?.map(([lat, lng]) => ({ lat, lng })) ?? null,
      noFlyZones: data.noFlyZones.map((zone) => zone.map(([lat, lng]) => ({ lat, lng }))),
      flightZones: data.flightZones.map((zone) => zone.map(([lat, lng]) => ({ lat, lng }))),
      targets: data.targets.map(([lat, lng]) => ({ lat, lng })),
      startLocation: data.startLocation ? { lat: data.startLocation[0], lng: data.startLocation[1] } : null,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "map-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  return {
    data,
    drawMode,
    setDrawMode,
    currentPolygon,
    handleMapClick,
    finishPolygon,
    cancelDraw,
    removeNfz,
    removeFz,
    removeTarget,
    clearMapArea,
    clearStart,
    exportJSON,
  };
}
