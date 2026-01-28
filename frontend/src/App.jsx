import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Map from "./Map";
import { Header } from "./Header";
import { Home } from "./Home";
import ObjectPlanning from "./ObjectPlanning";

const App = () => {
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
                <Map forceRegion="edinburgh" />
              </div>
            }
          />

          <Route
            path="/highlands"
            exact
            element={
              <div className="outerContainer">
                <Header />
                <Map forceRegion="highlands" />
              </div>
            }
          />

          <Route
            path="/planningobjection/:ref"
            element={
              <div className="outerContainer">
                <Header />
                <ObjectPlanning region={"edinburgh"} />
              </div>
            }
          />

          <Route
            path="/highlands/planningobjection/:ref"
            element={
              <div className="outerContainer">
                <Header />
                <ObjectPlanning region={"highlands"} />
              </div>
            }
          />

          <Route
            path="/islands/planningobjection/:ref"
            element={
              <div className="outerContainer">
                <Header />
                <ObjectPlanning region={"islands"} />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
