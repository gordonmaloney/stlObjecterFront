import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Object from "./Object";
import { Button } from "@mui/material";
import mapImg from "./map.png";
import SmallMap from "./smallMap";
import L from 'leaflet';
import marker from './icon.png';

const myIcon = new L.Icon({
    iconUrl: marker,
    iconRetinaUrl: marker,
    popupAnchor:  [-0, -0],
    iconSize: [30,40],     
});

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

  const [mapClass, setMapClass] = useState("mapBig");

  const toggleMap = () => {
    mapClass == "mapBig" ? setMapClass("mapSmall") : setMapClass("mapBig");
  };

  const [selectedCoords, setSelectedCoords] = useState({
    lat: "55.95005",
    long: "-3.21494",
  });

  const selectLicense = (idx, coords) => {
    setSelected(idx);
    setSelectedCoords(coords);
    setMapClass("mapSmall");
  };

  return (
    <>
      <div className={mapClass}>
        {mapClass == "mapBig" ? (
          <center>
            <MapContainer
              center={[55.95005, -3.21494]}
              zoom={11}
              style={{ width: `100%`, height: `420px`, margin: "0 auto" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {latlongs.map((latlong, idx) => (
                <Marker position={[latlong.lat, latlong.long]} icon={myIcon}>
                  <Popup>
                    <div style={{ maxWidth: "100px" }}>
                      {applications[idx + 1]["Premises address"]}
                      <br />
                      <br />
                      <button onClick={() => selectLicense(idx + 1, latlong)}>
                        Object
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </center>
        ) : (
          <></>
        )}
      </div>

      {mapClass == "mapBig" ? (
        <center>
          <h3>Select an application to begin your objection</h3>
        </center>
      ) : (
        <>
          <div style={{ textAlign: "right" }}>
            <Button size="small"
              variant="contained"
              sx={{ margin: 1 }}
              onClick={() => setMapClass("mapBig")}
            >
              Back to applications
            </Button>
          </div>
          <Object selected={applications[selected]} coords={selectedCoords} />
        </>
      )}
    </>
  );
}
