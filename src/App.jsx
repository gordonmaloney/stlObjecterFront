import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Map from "./Map";
import { Header } from "./Header";
import { Home } from "./Home";
import Object from "./ObjectNew";

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
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
