import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Map from "./Map";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/map" exact element={<Map />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
