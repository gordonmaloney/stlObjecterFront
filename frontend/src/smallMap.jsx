import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@mui/material";
import mapImg from "./imgs/map.png";
import L from "leaflet";
import marker from "./imgs/icon.png";

const myIcon = new L.Icon({
  iconUrl: marker,
  iconRetinaUrl: marker,
  popupAnchor: [-0, -0],
  iconSize: [30, 40],
});

export default function SmallMap({ coords }) {
  const [zoom, setZoom] = useState(9);

  return (
    <MapContainer
      center={[coords.lat, coords.long]}
      zoom={12}
      style={{ width: `100%`, height: `170px` }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={[coords.lat, coords.long]} icon={myIcon}></Marker>
    </MapContainer>
  );
}
