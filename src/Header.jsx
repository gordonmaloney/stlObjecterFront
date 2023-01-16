import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div
      style={{
        position: "sticky",
        width: "100%",
        height: "50px",
        marginBottom: "0px",
        backgroundColor: "green",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        color: 'white'
      }}
    >
      <Link to="../">
        <h2 style={{ margin: 0, paddingLeft: "20px" }}>STLObjectr</h2>
      </Link>
      <h3 style={{ margin: 0, paddingRight: "20px" }}>Living Rent</h3>
    </div>
  );
};
