import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { BtnStyle } from "./Shared";

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
  console.log(state.applications.applications)


  useEffect(() => {
    setH1Show(true);
    setTimeout(() => {
      setH2Show(true);
    }, 1000);
    setTimeout(() => {
      setParShow(true);
    }, 1000);
  }, []);

  const fetchData = async () => {
    const response = await fetch("https://stlfetcher.onrender.com/read/");

    if (response) {
      console.log("API running)");
    }
  };
  fetchData();

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
                <b>the council continue to approve new licenses</b> -
                exacerbating the crisis for the rest of us.
                <br />
                <br />
                They say that the public are welcome to object to new
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
                src="https://assets.nationbuilder.com/livingrent/sites/1/meta_images/original/Copy_of_Best_logo.jpg?1603281606"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
