import React from "react";
import { Button } from "@mui/material";
import {Link} from "react-router-dom";

export const Home = () => {
  return (
    <div style={{width: '60%', margin: '0 auto'}}>
      <center>
        <h1>Homes not holiday lets</h1>

        <p>
          Edinburgh is facing an unprecedented housing crisis, and every holiday let is one less home for ordinary residents to live in.
          <br />
          <br />
          Despite that, the council continue to approve new licenses - exacerbating the crisis for the rest of us.
<br/><br/>
          They say that the public are welcome to object to new applications, but they've made it as difficult as possible for people to actually do that - hiding the information away where no one can find it.
          <br/><br/>
          That's why Living Rent has made this tool - to put power back in the hands of our community, and facilitate people to speak out about the destruction of our neighbourhoods.
          <br />
          <br />
    <Link to="./map">
          <Button size="large" variant="contained">Start</Button>
</Link>
        </p>
      </center>
    </div>
  );
};
