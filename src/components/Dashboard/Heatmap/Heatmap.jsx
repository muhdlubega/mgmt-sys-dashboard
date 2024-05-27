import React, { useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import { HeatmapLayer } from "./components/HeatmapLayer";
import { useData } from "../../../context/DataContext";

import "./Heatmap.scss";
import "leaflet/dist/leaflet.css";

const Heatmap = () => {
  const { users } = useData();

  const heatmapData = useMemo(() => {
    return users
      .filter(
        (user) =>
          user.address &&
          user.address.geo &&
          user.address.geo.lat &&
          user.address.geo.lng
      )
      .map((user) => ({
        lat: parseFloat(user.address.geo.lat),
        lng: parseFloat(user.address.geo.lng),
        value: 1,
      }));
  }, [users]);

  return (
    <div className="heatmap">
      <h3>User Heatmap</h3>
      <MapContainer className="heatmap__map-container" center={[0, 0]} zoom={1}>
        <TileLayer url={process.env.REACT_APP_MAP_URL} />
        <HeatmapLayer points={heatmapData} />
      </MapContainer>
    </div>
  );
};

export default Heatmap;
