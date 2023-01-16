import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Object from "./Object";
import { Button } from "@mui/material";
import mapImg from "./map.png";

export default function SmallMap({coords}) {
  const [zoom, setZoom] = useState(9);


  console.log(coords.lat, coords.long)

  return (
    <MapContainer
    center={[coords.lat, coords.long]}
    zoom={12}
      style={{ width: `150px`, height: `170px` }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={[coords.lat, coords.long]}>

                </Marker>
    </MapContainer>
  );
}
