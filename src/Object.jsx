import { FormLabel, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";

const Object = ({ selected }) => {
  console.log(selected);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

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

  console.log(body);
  return (
    <div>
      <Grid container>
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
          </div>
        </Grid>

        <Grid item xs={12} sm={4}>
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

          <Button
            onClick={() =>
              setBody((body) => body + "\n\nDraft paragraph about noise.")
            }
          >
            Noise
          </Button>
          <br />
          <Button
            onClick={() =>
              setBody((body) => body + "\n\nDraft paragraph about amenities.")
            }
          >
            Amenities
          </Button>
          <br />
          <Button
            onClick={() =>
              setBody((body) => body + "\n\nDraft paragraph about supply.")
            }
          >
            Supply
          </Button>
        </Grid>
      </Grid>

      <center>
        <a
          href={`mailto:council@edinburgh.com?subject=${subject}&body=${body.replace(
            /\n/g,
            "%0A"
          )}`}
        >
          <Button size="large" variant="contained">
            Send your objection
          </Button>
        </a>
        <br />
        <br />
        <a
          target="_blank"
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=council@edinburgh.com&su=${subject}&body=${body.replace(
            /\n/g,
            "%0A"
          )}`}
        >
          <Button size="large" variant="contained">
            Send via Gmail
          </Button>
        </a>
      </center>
    </div>
  );
};

export default Object;
