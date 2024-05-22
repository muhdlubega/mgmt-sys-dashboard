import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

const HeatmapLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    const heatLayer = L.heatLayer(
      points.map((point) => [point.lat, point.lng, point.value]),
      {
        radius: 15,
        maxOpacity: 1,
      }
    ).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
};

export default HeatmapLayer;
