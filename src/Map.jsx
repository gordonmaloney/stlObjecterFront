import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Object from "./Object-Old";
import { Button, ButtonBase, TextField, FormLabel } from "@mui/material";
import mapImg from "./map.png";
import SmallMap from "./smallMap";
import L from "leaflet";
import marker from "./icon.png";
import markerRed from "./iconred.png";
import youMarker from "./youIcon.png";
import { BtnStyle, BtnStyleSmall } from "./Shared";
import { Loading } from "react-loading-dot";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import moment from "moment";

//redux imports
import { useSelector, useDispatch } from "react-redux";
import { getApplications, reset, isError, isLoading } from "./Redux/Slice";
import { DashboardCustomizeSharp } from "@mui/icons-material";

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

export default function Map() {
  const [Postcodes, setPostcodes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();

  //redux handling
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  useEffect(() => {
    dispatch(getApplications());
  }, []);

  useEffect(() => {
    setApplications(state.applications.applications);
  }, [state.applications]);

  useEffect(() => {
    setPostcodes(applications.map((app) => app.Postcode));
  }, [applications]);

  const [latlongs, setLatlongs] = useState([...applications]);
  const [index, setIndex] = useState(0);

  const [mapClass, setMapClass] = useState("mapBig");

  const toggleMap = () => {
    mapClass == "mapBig" ? setMapClass("mapSmall") : setMapClass("mapBig");
  };

  const [selectedCoords, setSelectedCoords] = useState({
    lat: "55.95005",
    long: "-3.21494",
  });

  const selectLicense = (postcode, coords) => {
    setSelected(applications.filter((app) => app.Postcode == postcode));
    setSelectedCoords(coords);
    setMapClass("mapSmall");
  };

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

    let distanceArr = state.applications.applications
      // .filter((app) => app["Decision Date"] == null)
      .filter((latlong) => latlong.lat != undefined)
      .map((latlong) => {
        let Entry = {
          ...latlong,
          distance:
            Math.pow(latlong.lat - data.result.latitude, 2) +
            Math.pow(latlong.lon - data.result.longitude, 2),
        };
        console.log(Entry)
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

  const CustomMarker = ({ isActive, data, map }) => {
    console.log(data);
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
            {closest.address}
            <br />
            <br />
            <center>
              <Button
                onClick={() =>
                  navigate(
                    `../planningobjection/${closest.slug}`
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
                    {
                      //state.applications.isLoading ||
                      state.applications.length == 0 ? (
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
                                : [55.95005, -3.21494]
                            }
                            zoom={11}
                            style={{
                              width: `100%`,
                              height: `320px`,
                              margin: "0 auto",
                            }}
                          >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                            {!closest &&
                              state.applications.applications.map((app) => (
                                <Marker
                                  position={[app.lat, app.lon]}
                                  icon={myIcon}
                                  key={app.refNo}
                                >
                                  <Popup>
                                    <div style={{ maxWidth: "100px" }}>
                                      {app.address}
                                      <br />
                                      <br />

                                      <center>
                                        <Button
                                          onClick={() =>
                                            navigate(
                                              `../planningobjection/${app.slug}`
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
                              ))}

                            {!closest ? (
                              latlongs
                                // .filter((app) => app["Decision Date"] == null)
                                .filter(
                                  (latlong) =>
                                    latlong.lat && latlong.lon
                                )
                                .map((latlong) => (
                                  <Marker
                                    position={[
                                      latlong.lat,
                                      latlong.lon,
                                    ]}
                                    icon={myIcon}
                                  >
                                    <Popup>
                                      <div style={{ maxWidth: "100px" }}>
                                        {latlong.address}
                                        <br />
                                        <br />

                                        {
                                          //new Date(moment.unix((latlong["Date Received"] - 25569) * 86400)._i).toDateString()
                                        }

                                        <center>
                                          <Button
                                            onClick={() =>
                                              navigate(
                                                `../object/${latlong.slug}`
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
                                  position: [
                                    closest.lat,
                                    closest.lon,
                                  ],
                                }}
                              />
                            )}

                            {userLatLong.length > 1 && (
                              <Marker
                                position={[...userLatLong]}
                                icon={youIcon}
                              >
                                <Popup>Your location</Popup>
                              </Marker>
                            )}
                          </MapContainer>
                        </>
                      )
                    }
                  </center>
                ) : (
                  <></>
                )}
              </div>
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
              style={{ padding: "10px", borderRadius: "2px" }}
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
