import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Map from "./Map";
import { Header } from "./Header";
import { Home } from "./Home";
import Object from "./ObjectNew";
import ObjectPlanning from "./ObjectPlanning";
import axios from "axios";


const App = () => {
  const handleTracker = async () => {
    const body = {
      source: window.location.host.toString(),
      hits: 1,
    };
    try {
      await axios.post(
        "https://long-ruby-narwhal-sock.cyclic.app/api/tracker/hit",
        body
      );
    } catch {
      console.log("trackingerror");
    }
  };

  useEffect(() => {
    // handleTracker();
  }, []);

  //wake up API
  const fetchData = async () => {
    const response = await fetch(
      "https://stls-craper-gordonmaloney.vercel.app/read/"
    );

    if (response) {
      console.log("API running)");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="outerContainer">


      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />} />

          <Route
            path="/map"
            exact
            element={
              <div className="outerContainer">
                <Header />
                <Map />
              </div>
            }
          />
          <Route
            path="/object/:postcode"
            element={
              <div className="outerContainer">
                <Header />
                <Object />
              </div>
            }
          />

          <Route
            path="/planningobjection/:postcode"
            element={
              <div className="outerContainer">
                <Header />
                <ObjectPlanning />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
