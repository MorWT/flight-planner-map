import { MapPin, Target, Play, Square, X, Download, Crosshair, Shield, Plane, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MapDataState, DrawMode } from "@/hooks/useMapData";

interface SidebarProps {
  data: MapDataState;
  drawMode: DrawMode;
  currentPolygonLength: number;
  onSetDrawMode: (mode: DrawMode) => void;
  onFinishPolygon: () => void;
  onCancelDraw: () => void;
  onRemoveNfz: (i: number) => void;
  onRemoveFz: (i: number) => void;
  onRemoveTarget: (i: number) => void;
  onClearMapArea: () => void;
  onClearStart: () => void;
  onExport: () => void;
}

function SectionHeader({ children, icon: Icon, color }: { children: React.ReactNode; icon: any; color: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color }}>
      <Icon size={14} />
      {children}
    </div>
  );
}

export default function Sidebar({
  data,
  drawMode,
  currentPolygonLength,
  onSetDrawMode,
  onFinishPolygon,
  onCancelDraw,
  onRemoveNfz,
  onRemoveFz,
  onRemoveTarget,
  onClearMapArea,
  onClearStart,
  onExport,
}: SidebarProps) {
  const isPolygonMode = drawMode === "mapArea" || drawMode === "nfz" || drawMode === "fz";

  return (
    <div className="flex h-full w-72 flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <h1 className="text-sm font-bold tracking-wider text-primary">◈ MISSION PLANNER</h1>
        <p className="text-[10px] text-muted-foreground">Define zones & extract data</p>
      </div>

      {/* Drawing status */}
      {drawMode && (
        <div className="border-b border-border bg-secondary px-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-primary">
              {isPolygonMode
                ? `Drawing ${drawMode === "mapArea" ? "Map Area" : drawMode === "nfz" ? "NFZ" : "FZ"} (${currentPolygonLength} pts)`
                : `Click to place ${drawMode === "target" ? "Target" : "Start"}`}
            </span>
            <div className="flex gap-1">
              {isPolygonMode && currentPolygonLength >= 3 && (
                <button onClick={onFinishPolygon} className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                  FINISH
                </button>
              )}
              <button onClick={onCancelDraw} className="rounded bg-destructive px-2 py-0.5 text-[10px] font-bold text-destructive-foreground">
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {/* Map Area */}
        <div className="space-y-2">
          <SectionHeader icon={Map} color="hsl(260, 60%, 55%)">Map Area</SectionHeader>
          {data.mapArea ? (
            <div className="flex items-center justify-between rounded border border-border bg-secondary px-2 py-1">
              <span className="text-[11px] text-secondary-foreground">{data.mapArea.length} vertices</span>
              <button onClick={onClearMapArea}><X size={12} className="text-muted-foreground hover:text-destructive" /></button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => onSetDrawMode("mapArea")} disabled={!!drawMode}>
              <Map size={12} className="mr-1" /> Draw Map Area
            </Button>
          )}
        </div>

        {/* No-Fly Zones */}
        <div className="space-y-2">
          <SectionHeader icon={Shield} color="hsl(0, 70%, 50%)">No-Fly Zones</SectionHeader>
          {data.noFlyZones.map((zone, i) => (
            <div key={i} className="flex items-center justify-between rounded border border-border bg-secondary px-2 py-1">
              <span className="text-[11px] text-secondary-foreground">NFZ #{i + 1} — {zone.length} pts</span>
              <button onClick={() => onRemoveNfz(i)}><X size={12} className="text-muted-foreground hover:text-destructive" /></button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => onSetDrawMode("nfz")} disabled={!!drawMode}>
            <Shield size={12} className="mr-1" /> Add NFZ
          </Button>
        </div>

        {/* Flight Zones */}
        <div className="space-y-2">
          <SectionHeader icon={Plane} color="hsl(142, 60%, 45%)">Flight Zones</SectionHeader>
          {data.flightZones.map((zone, i) => (
            <div key={i} className="flex items-center justify-between rounded border border-border bg-secondary px-2 py-1">
              <span className="text-[11px] text-secondary-foreground">FZ #{i + 1} — {zone.length} pts</span>
              <button onClick={() => onRemoveFz(i)}><X size={12} className="text-muted-foreground hover:text-destructive" /></button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => onSetDrawMode("fz")} disabled={!!drawMode}>
            <Plane size={12} className="mr-1" /> Add Flight Zone
          </Button>
        </div>

        {/* Targets */}
        <div className="space-y-2">
          <SectionHeader icon={Target} color="hsl(38, 80%, 55%)">Targets</SectionHeader>
          {data.targets.map((t, i) => (
            <div key={i} className="flex items-center justify-between rounded border border-border bg-secondary px-2 py-1">
              <span className="text-[11px] text-secondary-foreground font-mono">{t[0].toFixed(5)}, {t[1].toFixed(5)}</span>
              <button onClick={() => onRemoveTarget(i)}><X size={12} className="text-muted-foreground hover:text-destructive" /></button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => onSetDrawMode("target")} disabled={!!drawMode}>
            <Target size={12} className="mr-1" /> Add Target
          </Button>
        </div>

        {/* Start Location */}
        <div className="space-y-2">
          <SectionHeader icon={Crosshair} color="hsl(200, 80%, 55%)">Start Location</SectionHeader>
          {data.startLocation ? (
            <div className="flex items-center justify-between rounded border border-border bg-secondary px-2 py-1">
              <span className="text-[11px] text-secondary-foreground font-mono">{data.startLocation[0].toFixed(5)}, {data.startLocation[1].toFixed(5)}</span>
              <button onClick={onClearStart}><X size={12} className="text-muted-foreground hover:text-destructive" /></button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => onSetDrawMode("start")} disabled={!!drawMode}>
              <Crosshair size={12} className="mr-1" /> Set Start
            </Button>
          )}
        </div>
      </div>

      {/* Export */}
      <div className="border-t border-border p-4">
        <Button className="w-full" onClick={onExport}>
          <Download size={14} className="mr-2" /> Export JSON
        </Button>
      </div>
    </div>
  );
}
