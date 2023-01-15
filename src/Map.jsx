import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Object from "./Object";

const center = [55.95005, -3.21493];

export default function Map() {
  const [Postcodes, setPostcodes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(0);

  const fetchPostcodes = async () => {
    const response = await fetch("https://stlfetcher.onrender.com/read/");

    const data = await response.json();

    setApplications(data.data);
  };

  useEffect(() => {
    fetchPostcodes();
  }, []);

  useEffect(() => {
    setPostcodes(applications.map((app) => app.Postcode));
  }, [applications]);

  const [latlongs, setLatlongs] = useState([]);
  const [index, setIndex] = useState(0);
  const fetchData = async (postcode, index) => {
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${postcode}`
    );
    const data = await response.json();

    setLatlongs([
      ...latlongs,
      {
        index: index,
        lat: data.result.latitude,
        long: data.result.longitude,
      },
    ]);
  };

  useEffect(() => {
    if (Postcodes?.length > latlongs.length) {
      fetchData(Postcodes[index], index);
      setIndex(index + 1);
    }
  }, [Postcodes, latlongs.length]);

  return (
    <>
      <MapContainer
        center={center}
        zoom={11}
        style={{ width: "400px", height: "400px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {latlongs.map((latlong, idx) => (
          <Marker position={[latlong.lat, latlong.long]}>
            <Popup>
              <button onClick={() => setSelected(idx + 1)}>Object</button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {!selected ? (
        <h3>Select an application to begin your objection</h3>
      ) : (
        <Object selected={applications[selected]} />
      )}
    </>
  );
}
