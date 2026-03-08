import { useMapData } from "@/hooks/useMapData";
import MapView from "@/components/MapView";
import Sidebar from "@/components/Sidebar";

const Index = () => {
  const {
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
  } = useMapData();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        data={data}
        drawMode={drawMode}
        currentPolygonLength={currentPolygon.length}
        onSetDrawMode={setDrawMode}
        onFinishPolygon={finishPolygon}
        onCancelDraw={cancelDraw}
        onRemoveNfz={removeNfz}
        onRemoveFz={removeFz}
        onRemoveTarget={removeTarget}
        onClearMapArea={clearMapArea}
        onClearStart={clearStart}
        onExport={exportJSON}
      />
      <div className="flex-1">
        <MapView
          data={data}
          drawMode={drawMode}
          currentPolygon={currentPolygon}
          onMapClick={handleMapClick}
        />
      </div>
    </div>
  );
};

export default Index;
