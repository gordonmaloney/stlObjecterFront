import { FormLabel, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import SmallMap from "./smallMap";
import { Councillors } from "./Councillors";
import { BtnStyleSmall } from "./Shared";
import { useNavigate, useParams } from "react-router-dom";
import { BtnStyle } from "./Shared";

//redux imports
import { useSelector, useDispatch } from "react-redux";
import { getApplications, reset, isError, isLoading } from "./Redux/Slice";

const Object = () => {
  const [selected, setSelected] = useState(0, 0);
  const [coords, setCoords] = useState(null);

const navigate = useNavigate()

  //redux handling
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getApplications());
  }, []);
  const state = useSelector((state) => state);

  useEffect(() => {
    setSelected(
      state.applications.applications.filter(
        (app) => app.Postcode == params.postcode
      )[0]
    );
  }, [state]);

  const params = useParams();

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [signOff, setSignOff] = useState("Regards,\n");

  const [councillors, setCouncillors] = useState([]);
  const [cc, setCC] = useState("");

  useEffect(() => {
    if (selected?.Applicant) {
      setBody(
        `To whom it may concern,\n\nI am writing to object to application number ${selected["Application reference number"]} for a short-term let license, in the name of ${selected["Applicant"]} at ${selected["Premises address"]}.`
      );
      setSubject(
        `Objecting to STL application ${selected["Application reference number"]}`
      );
      fetchData(selected.Postcode);
    }
  }, [selected]);

  const fetchData = async (postcode) => {
    console.log("fetching...", postcode);
    if (postcode) {
      const response = await fetch(
        `https://api.postcodes.io/postcodes/${postcode}`
      );
      const data = await response.json();

      setCouncillors(
        Councillors.filter((clr) => clr.ward == data.result.admin_ward)
      );
      setCoords({
        lat: data.result.latitude,
        long: data.result.longitude,
      });
    }
  };

  useEffect(() => {
    setCC(councillors.map((cllr) => cllr.email).join(","));
  }, [councillors.length]);

  return (
    <>
      <div style={{ textAlign: "right" }}>
          <Button
            size="small"
            variant="contained"
            sx={{ margin: 1 }}
        onClick={() => navigate('../map')}
            style={{ ...BtnStyle, fontSize: "1.4em" }}
          >
            Back to applications
          </Button>
      </div>
      <div className="objectCont">
        <Grid container spacing={3} flexDirection="row-reverse">
          <Grid item xs={12} sm={4} md={5}>
            <div
              style={{
                height: "150px",
                width: "100%",
                padding: "5px",
                backgroundColor: "rgba(0, 66, 25, 0.9)",
              }}
            >
              <div
                style={{ height: "150px", width: "100%", overflow: "hidden" }}
              >
                {coords?.lat && <SmallMap coords={coords} />}
              </div>
            </div>

            <div className="talkingPoints" style={{ textAlign: "left" }}>
              <span
                className="bebas header3 header"
                style={{ color: "black", marginLeft: "10px" }}
              >
                Writing a great objection
              </span>
              <ul style={{ textAlign: "left" }}>
                <li>
                  You can use the buttons below to add paragraphs about specific
                  issues to your objection.
                </li>
                <li>
                  You <em>can</em> use the template text,{" "}
                  <b>
                    but your objection will be more impactful if you personalise
                    the text.
                  </b>
                </li>
                <li>
                  Remember to be civil - don't give officials a reason to throw
                  your objection out!
                </li>
                <li>
                  If you are local to the application, make sure you mention
                  that - the more it would personally impact you, the more
                  weight your objection will have.
                </li>
              </ul>

              <center>
                <Button
                  variant="contained"
                  sx={{ margin: 1 }}
                  onClick={() =>
                    setBody((body) => body + "\n\nDraft paragraph about noise.")
                  }
                  style={BtnStyleSmall}
                >
                  Noise
                </Button>
                <Button
                  variant="contained"
                  sx={{ margin: 1 }}
                  onClick={() =>
                    setBody(
                      (body) => body + "\n\nDraft paragraph about amenities."
                    )
                  }
                  style={BtnStyleSmall}
                >
                  Amenities
                </Button>
                <Button
                  variant="contained"
                  sx={{ margin: 1 }}
                  onClick={() =>
                    setBody(
                      (body) => body + "\n\nDraft paragraph about supply."
                    )
                  }
                  style={BtnStyleSmall}
                >
                  Supply
                </Button>
              </center>
            </div>
          </Grid>

          <Grid item xs={12} sm={8} md={7}>
            <div className="email">
              <br />
              <span
                className="bebas header3 header"
                style={{ color: "black", marginLeft: "10px" }}
              >
                Your objection
              </span>
              <br /> <br />
              <FormLabel>Subject:</FormLabel>
              <br />
              <TextField
                sx={{ width: "90%", margin: "5px" }}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <br />
              <FormLabel>Body:</FormLabel>
              <br />
              <TextField
                sx={{ width: "90%", margin: "5px" }}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                multiline
                minRows={6}
              />
              <br />
              <FormLabel>Your details:</FormLabel>
              <br />
              <TextField
                sx={{ width: "90%", margin: "5px" }}
                value={signOff}
                onChange={(e) => setSignOff(e.target.value)}
                multiline
                minRows={2}
                helperText="Make sure you include your address so they know you're an Edinburgh resident!"
              />
              <Grid container justifyContent="space-around">
                {" "}
                <Button
                  href={`mailto:council@edinburgh.com?subject=${subject}&cc=${cc}&bcc=stlbjections@livingrent.com&body=${
                    body.replace(/\n/g, "%0A") +
                    "%0A%0A" +
                    signOff.replace(/\n/g, "%0A")
                  }`}
                  //disabled={signOff == "Regards,\n"}
                  size="large"
                  variant="contained"
                  style={{ ...BtnStyleSmall, margin: 2 }}
                >
                  Send your objection
                </Button>
                <Button
                  //disabled={signOff == "Regards,\n"}
                  size="large"
                  variant="contained"
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=council@edinburgh.com&su=${subject}&cc=${cc}&bcc=stlbjections@livingrent.com&body=${
                    body.replace(/\n/g, "%0A") +
                    "%0A%0A" +
                    signOff.replace(/\n/g, "%0A")
                  }`}
                  target="_blank"
                  style={{ ...BtnStyleSmall, margin: 2 }}
                >
                  Send via Gmail
                </Button>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Object;
