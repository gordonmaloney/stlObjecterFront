import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { BtnStyle } from "./Shared";

import LRlogo from './LRlogo.jpeg'

//redux imports
import { useSelector, useDispatch } from "react-redux";
import {
  getApplications,
  reset,
  isError,
  isLoading,
} from "./Redux/Slice";

export const Home = () => {
  const [h1Show, setH1Show] = useState(false);
  const [h2Show, setH2Show] = useState(false);
  const [parShow, setParShow] = useState(false);

//redux handling
  const dispatch = useDispatch();
  useEffect(() => {
   dispatch(getApplications());
  }, []);
  const state = useSelector((state) => state);


  useEffect(() => {
    setH1Show(true);
    setTimeout(() => {
      setH2Show(true);
    }, 1000);
    setTimeout(() => {
      setParShow(true);
    }, 1000);
  }, []);



  const arr = [1,2,3,4,5]

  return (
    <div className="landing">
      <div className="landingContainer">
        <center>
          <span className={h1Show ? "show" : "hide"}>
            <span className="bebas header header1">
              <u>Homes</u>
            </span>
          </span>
          <br />
          <span className={h2Show ? "show" : "hide"}>
            <span className="bebas header header2">not holiday lets</span>
          </span>
        </center>

        <div className={parShow ? "parShow" : "parHide"}>
          <div>
            <center>

              
              <p>
                Edinburgh is facing an unprecedented housing crisis, and{" "}
                <b>
                  every holiday let is one less home for ordinary residents to
                  live in.
                </b>
                <br />
                <br />
                Despite that,{" "}
                <b>the council continue to approve new holiday lets</b> -
                exacerbating the crisis for the rest of us.
                <br />
                <br />
                They say that the public are welcome to object to new planning
                applications, but{" "}
                <b>they've made it as difficult as possible</b> for people to
                actually do that - hiding the information away where no one can
                find it.
                <br />
                <br />
                That's why <b>Living Rent has made this tool</b> - to put power
                back in the hands of our community, and facilitate people to
                speak out about the destruction of our neighbourhoods.
                <br />
                <br />
                <Link to="./map">
                  <Button sx={BtnStyle} size="large" variant="contained">
                    Start
                  </Button>
                </Link>
              </p>
            </center>

            <a href="https://www.livingrent.org/" target="_blank">
              {" "}
              <img
                style={{
                  height: "50px",
                  width: "50px",
                  float: "right",
                  marginTop: "-30px",
                }}
                src={LRlogo}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
