import React from "react";
import { Button } from "@mui/material";
import { BtnStyle } from "./Shared";

export const ModalContent = () => {
  return (
    <div>
      <span
        className="bebas header header2"
        style={{ backgroundColor: "green", padding: "5px 10px 3px 8px" }}
      >
        Join Living Rent
      </span>
      <br/>
      <br/>
      <p>
        <b>Living Rent is Scotland's tenants' union.</b> As a union, everything
        we can and do achieve is because of our collective power.
        <br />
        <br />
        That power comes directly from our members. If you are not already a
        member, join now - and{" "}
        <b>be a part of the fight for fairer housing in Scotland.</b>
      </p>
      <center>
        <Button target="_blank" href="http://livingrent.org/join" sx={BtnStyle}>
          Join Living Rent
        </Button>
      </center>
    </div>
  );
};
