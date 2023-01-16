import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Map from "./Map";
import { Header } from "./Header";
import { Home } from "./Home";


const App = () => {
  return (
    <div className="container">
      <BrowserRouter>
      <Header />

        <Routes>
        <Route path="/" exact element={<Home />} />

          <Route path="/map" exact element={<Map />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
