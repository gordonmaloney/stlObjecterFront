import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
//import Object from "./Object-Old";
import { Button, ButtonBase, TextField, FormLabel } from "@mui/material";
import L from "leaflet";
import marker from "./imgs/icon.png";
import markerRed from "./imgs/iconred.png";
import youMarker from "./imgs/youIcon.png";
import { BtnStyle, BtnStyleSmall } from "./Shared";
import { Loading } from "react-loading-dot";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import moment from "moment";

const myIcon = new L.Icon({
  iconUrl: marker,
  iconRetinaUrl: marker,
  popupAnchor: [-0, -0],
  iconSize: [30, 40],
});

const myIconRed = new L.Icon({
  iconUrl: markerRed,
  iconRetinaUrl: markerRed,
  popupAnchor: [-0, -0],
  iconSize: [30, 40],
});

const youIcon = new L.Icon({
  iconUrl: youMarker,
  iconRetinaUrl: youMarker,
  popupAnchor: [-0, -0],
  iconSize: [30, 40],
});

export default function Map({ forceRegion }) {
  const [region, setRegion] = useState("");
  const [fetchedApps, setFetchedApps] = useState([]);

  const [baseLink, setBaseLink] = useState("/");

  useEffect(() => {
    if (forceRegion == "highlands") {
      setRegion("highlands");
    }
    if (forceRegion == "edinburgh") {
      setRegion("edinburgh");
    }
  }, [forceRegion]);

  const edinburghBaseLink = "../planningobjection";
  const highlandsBaseLink = "../highlands/planningobjection";
  const islandsBaseLink = "../islands/planningobjection";

  useEffect(() => {
    //fetch link
    const edinburghLink =
      "https://raw.githubusercontent.com/gordonmaloney/STLPlanningScraper/refs/heads/main/data/NewData.json";
    const highlandsLink =
      "https://raw.githubusercontent.com/gordonmaloney/STLPlanningScraper/refs/heads/main/data/HL_NewData.json";
    const islandsLink =
            "https://raw.githubusercontent.com/gordonmaloney/STLPlanningScraper/refs/heads/main/data/CnE_NewData.json";

    async function fetchAllData() {
      try {
        const [edinburghRes, highlandsRes, islandsRes] = await Promise.all([
          fetch(edinburghLink),
          fetch(highlandsLink),
          fetch(islandsLink),
        ]);

        const [edinburghData, highlandsData, islandsData] = await Promise.all([
          edinburghRes.json(),
          highlandsRes.json(),
          islandsRes.json(),
        ]);

        // Combine all results (assuming they’re arrays)
        const combinedData = [
          ...edinburghData,
          ...highlandsData,
          ...islandsData,
        ];

        setFetchedApps(combinedData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    fetchAllData();

    /*
    if (region == "edinburgh") {
      fetch(edinburghLink)
        .then((res) => res.json())
        .then((data) => setFetchedApps(data));

      setBaseLink(edinburghBaseLink);
    }

    if (region == "highlands") {
      fetch(highlandsLink)
        .then((res) => res.json())
        .then((data) => setFetchedApps(data));

      setBaseLink(highlandsBaseLink);
    }*/
  }, [region, forceRegion]);

  const [Postcodes, setPostcodes] = useState([]);
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();

  const [latlongs, setLatlongs] = useState([]);
  useEffect(() => {
    setLatlongs(fetchedApps);
  }, [fetchedApps]);

  const [mapClass, setMapClass] = useState("mapBig");

  const [centerCoords, setCenterCoords] = useState({
    lat: "55.95005",
    long: "-3.21494",
  });
  useEffect(() => {
    if (region == "edinburgh") {
      setCenterCoords([55.95005, -3.21494]);
    }
    if (region == "highlands") {
      setCenterCoords([57.5005, -5]);
    }
  }, [region]);

  //search by postcode logic
  const [userPostcode, setUserPostcode] = useState("");
  const [userLatLong, setUserLatLong] = useState([]);
  const [closest, setClosest] = useState();
  const [invalid, setInvalid] = useState();

  const searchByPostcode = async (userPostcode) => {
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${userPostcode}`
    );
    const data = await response.json();

    data?.error && setInvalid(true);
    !data?.error && setInvalid(false);

    setUserLatLong([data.result.latitude, data.result.longitude]);

    let distanceArr = fetchedApps
      .filter((app) => app["Decision Date"] == null)
      .filter((latlong) => latlong.latitude != undefined)
      .map((latlong) => {
        let Entry = {
          ...latlong,
          distance:
            Math.pow(latlong.latitude - data.result.latitude, 2) +
            Math.pow(latlong.longitude - data.result.longitude, 2),
        };
        return Entry;
      });
    setClosest(
      distanceArr.filter(
        (el) =>
          el.distance == Math.min(...distanceArr.map((arr) => arr.distance))
      )[0]
    );
  };

  const [map, setMap] = useState(null);

  function RecenterOnRegion({ region, userLatLong }) {
    const map = useMap();

    useEffect(() => {
      if (!map) return;

      // If user searched a postcode, centre there
      if (Array.isArray(userLatLong) && userLatLong.length === 2) {
        const zoom = region === "edinburgh" ? 11 : 6;
        map.flyTo(userLatLong, zoom);
        return;
      }

      // Otherwise centre on the selected region defaults
      const center =
        region === "edinburgh" ? [55.95005, -3.21494] : [57.5005, -5];
      const zoom = region === "edinburgh" ? 11 : 6;

      map.flyTo(center, zoom, { duration: 0.5 });
    }, [map, region, userLatLong]);

    return null;
  }

  const CustomMarker = ({ isActive, data, map }) => {
    const [refReady, setRefReady] = useState(false);
    let popupRef = useRef();

    useEffect(() => {
      if (refReady && isActive) {
        map.openPopup(popupRef);
      }
    }, [isActive, refReady, map]);

    return (
      <Marker position={[...data.position]} icon={myIcon}>
        <Popup
          ref={(r) => {
            popupRef = r;
            setRefReady(true);
          }}
        >
          <div style={{ maxWidth: "100px" }}>
            {closest["address"]}
            <br />
            <br />
            <center>
              <Button
                onClick={() =>
                  navigate(
                    `${
                      closest.council == "Edinburgh"
                        ? edinburghBaseLink
                        : closest.council == "Highlands"
                        ? highlandsBaseLink
                        : closest.council == "CnE"
                        ? islandsBaseLink
                        : ""
                    }/${closest["reference"]
                      .replace("/", "-")
                      .replace("/", "-")}`
                  )
                }
                variant="contained"
                style={BtnStyle}
              >
                Object
              </Button>
            </center>
          </div>
        </Popup>
      </Marker>
    );
  };

  return (
    <div>
      <div
        className={
          mapClass == "mapBig" ? "mapContainer" : "mapContainerCollapsed"
        }
      >
        {mapClass == "mapBig" && (
          <>
            <center>
              <span
                className="header header3 bebas"
                style={{
                  backgroundColor: "rgba(0, 66, 25, 0.9)",
                  padding: "5px 10px 1px 6px",
                }}
              >
                Select an application to begin your objection
              </span>
            </center>

            <div className="mapInner">
              <div className={mapClass}>
                {mapClass == "mapBig" ? (
                  <center>
                    {fetchedApps.length == 0 ? (
                      <div className="loading">
                        <Loading
                          size={"1rem"}
                          dots={3}
                          background={"rgb(255,255,255)"}
                        />

                        <h1 className="bebas header header3">
                          Loading - this may take a few seconds
                        </h1>
                      </div>
                    ) : (
                      <>
                        <MapContainer
                          ref={setMap}
                          center={
                            userLatLong.length > 0
                              ? userLatLong
                              : region == "edinburgh"
                              ? [55.95005, -3.21494]
                              : region == "highlands" && [57.5005, -5]
                          }
                          zoom={
                            region == "edinburgh"
                              ? 11
                              : region == "highlands" && 5.5
                          }
                          style={{
                            width: `100%`,
                            height: `320px`,
                            margin: "0 auto",
                          }}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <RecenterOnRegion
                            region={region}
                            userLatLong={userLatLong}
                          />

                          {!closest ? (
                            latlongs
                              .filter((app) => app["Decision Date"] == null)
                              .filter(
                                (latlong) =>
                                  latlong.latitude && latlong.longitude
                              )
                              .map((latlong) => (
                                <Marker
                                  position={[
                                    latlong.latitude,
                                    latlong.longitude,
                                  ]}
                                  icon={myIcon}
                                >
                                  <Popup>
                                    <div style={{ maxWidth: "100px" }}>
                                      {latlong["address"]}
                                      <br />
                                      <br />

                                      {
                                        //new Date(moment.unix((latlong["Date Received"] - 25569) * 86400)._i).toDateString()
                                      }

                                      <center>
                                        <Button
                                          onClick={() =>
                                            navigate(
                                              `${
                                                latlong.council == "Edinburgh"
                                                  ? edinburghBaseLink
                                                  : latlong.council ==
                                                    "Highlands"
                                                  ? highlandsBaseLink
                                                  : latlong.council == "CnE"
                                                  ? islandsBaseLink
                                                  : ""
                                              }/${encodeURIComponent(
                                                latlong["reference"]
                                              )}`
                                            )
                                          }
                                          variant="contained"
                                          style={BtnStyle}
                                        >
                                          Object
                                        </Button>
                                      </center>
                                    </div>
                                  </Popup>
                                </Marker>
                              ))
                          ) : (
                            <CustomMarker
                              isActive
                              map={map}
                              data={{
                                position: [closest.latitude, closest.longitude],
                              }}
                            />
                          )}

                          {userLatLong.length > 1 && (
                            <Marker position={[...userLatLong]} icon={youIcon}>
                              <Popup>Your location</Popup>
                            </Marker>
                          )}
                        </MapContainer>
                      </>
                    )}
                  </center>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div style={{ maxWidth: "800px", width: "90%" }}>
              <Button
                onClick={() => {
                  region == "edinburgh"
                    ? setRegion("highlands")
                    : region == "highlands" && setRegion("edinburgh");

                  setCenterCoords([57.5005, -5]);
                }}
                sx={{ ...BtnStyleSmall, float: "right" }}
              >
                {region == "edinburgh"
                  ? "Highlands"
                  : region == "highlands" && "Edinburgh"}
              </Button>
            </div>
          </>
        )}

        <center>
          <div
            className="objectCont"
            style={{
              marginTop: "10px",
              maxWidth: "300px",
              borderRadius: "10px",
            }}
          >
            <div
              className="email"
              style={{ padding: "10px", borderRadius: "2px", display: "block" }}
            >
              <FormLabel>
                Or enter your postcode to find the closest application to you:
              </FormLabel>
              <TextField
                id="Postcode"
                placeholder="Your postcode..."
                sx={{
                  borderRadius: "5px",
                  marginY: "10px",
                }}
                value={userPostcode}
                onChange={(e) => setUserPostcode(e.target.value)}
                helperText={
                  invalid && (
                    <span style={{ color: "red" }}>
                      Invalid postcode! Try again
                    </span>
                  )
                }
              />
              <Button
                sx={{ ...BtnStyleSmall, display: "block" }}
                onClick={() => searchByPostcode(userPostcode)}
              >
                Search
              </Button>
              {closest && (
                <Button
                  sx={{ ...BtnStyleSmall, marginY: "10px" }}
                  onClick={() => {
                    setClosest("");
                    setUserLatLong([]);
                    setUserPostcode("");
                  }}
                >
                  Show all applications
                </Button>
              )}
            </div>
          </div>
        </center>
      </div>
    </div>
  );
}
