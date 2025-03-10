import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div className="navBar">
      <Link to="../">
        <span className="bebas header header3" style={{ margin: 0, paddingLeft: "20px" }}>
          Homes not holiday lets
        </span>
      </Link>
      <a href="https://www.livingrent.org" target='_blank'>
        <span className="bebas header header3" style={{ margin: 0, paddingRight: "20px" }}>
          Living Rent
        </span>
      </a>
    </div>
  );
};
