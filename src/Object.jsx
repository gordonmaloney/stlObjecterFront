import { FormLabel, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import SmallMap from "./smallMap";
import {Councillors} from './Councillors'

const Object = ({ selected, coords }) => {

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [signOff, setSignOff] = useState("Regards,\n");

  const [councillors, setCouncillors] = useState([])
  const [cc, setCC] = useState('')

  const fetchWard = async () => {
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${selected['Postcode']}`
    );
    const data = await response.json();

    setCouncillors(Councillors.filter(clr=>clr.ward == data.result.admin_ward))

  };

  useEffect(() => {
    fetchWard()
  }, [selected])

  useEffect(() => {
    setCC(councillors.map(cllr => cllr.email).join(','))
  }, [councillors.length])

  console.log('cc: ', cc)

  useEffect(() => {
    setBody(
      `To whom it may concern,\n\nI am writing to object to application number ${selected["Application reference number"]} for a short-term let license, in the name of ${selected["Applicant"]} at ${selected["Premises address"]}.`
    );
  }, [selected["Applicant"]]);

  useEffect(() => {
    setSubject(
      `Objecting to STL application ${selected["Application reference number"]}`
    );
  }, [selected["Application reference number"]]);


  return (
    <div>
      <Grid container spacing={2} flexDirection="row-reverse">
        <Grid item xs={12} sm={4}>
          <div style={{ height: "150px", width: "100%", overflow: "hidden" }}>
            <center>
              <SmallMap coords={coords} />
            </center>
          </div>

          <h3>Writing a great objection</h3>

          <ul>
            <li>
              You can use the buttons below to add paragraphs about specific
              issues to your objection.
            </li>
            <li>
              You <em>can</em> use the template text,{" "}
              <b>
                but your objection will be more impactful if you personalise the
                text.
              </b>
            </li>
            <li>
              Remember to be civil - don't give officials a reason to throw your
              objection out!
            </li>
            <li>
              If you are local to the application, make sure you mention that -
              the more it would personally impact you, the more weight your
              objection will have.
            </li>
          </ul>

          <center>
            <Button
              variant="contained"
              sx={{ margin: 1 }}
              onClick={() =>
                setBody((body) => body + "\n\nDraft paragraph about noise.")
              }
            >
              Noise
            </Button>
            <Button
              variant="contained"
              sx={{ margin: 1 }}
              onClick={() =>
                setBody((body) => body + "\n\nDraft paragraph about amenities.")
              }
            >
              Amenities
            </Button>
            <Button
              variant="contained"
              sx={{ margin: 1 }}
              onClick={() =>
                setBody((body) => body + "\n\nDraft paragraph about supply.")
              }
            >
              Supply
            </Button>
          </center>
        </Grid>

        <Grid item xs={12} sm={8}>
          <div className="email">
            <h3>Your objection</h3>

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
                style={{ margin: 2 }}
              >
                Send your objection
              </Button>
              <Button
                style={{ margin: 2 }}
                //disabled={signOff == "Regards,\n"}
                size="large"
                variant="contained"
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=council@edinburgh.com&su=${subject}&cc=${cc}&bcc=stlbjections@livingrent.com&body=${
                  body.replace(/\n/g, "%0A") +
                  "%0A%0A" +
                  signOff.replace(/\n/g, "%0A")
                }`}
                target="_blank"
              >
                Send via Gmail
              </Button>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Object;
