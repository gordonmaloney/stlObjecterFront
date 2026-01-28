import {
  Checkbox,
  FormControl,
  FormLabel,
  Grid,
  TextField,
} from "@mui/material";
import { Loading } from "react-loading-dot/lib";
import React, { useEffect, useState, useMemo } from "react";
import { Button, RadioGroup, Radio } from "@mui/material";
import SmallMap from "./smallMap";
import { BtnStyleSmall, RadioStyle } from "./Shared";
import { useNavigate, useParams } from "react-router-dom";
import { BtnStyle, CheckBoxStyle } from "./Shared";
import { ModalContent } from "./ModalContent";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import { HashLink } from "react-router-hash-link";
import axios from "axios";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import moment from "moment";

//import { PlanningApps } from "./NewData";

//tooltip
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

//modal imports
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

//accordion imports
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  EDINBURGH_TEMPLATE,
  HIGHLANDS_TEMPLATE,
  ISLANDS_TEMPLATE,
  BADENOCH_STRATHSPEY_TEMPLATE,
} from "./Templates";

//modal style
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  minWidth: "270px",
  bgcolor: "rgba(255,255,255,0.9)",
  border: "2px solid green",
  boxShadow: 20,
  p: 4,
};

//tooltip style
const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
    "&::before": {
      backgroundColor: "#f5f5f9",
      border: "1px solid darkgreen",
    },
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(13),
    border: "1px solid darkgreen",
  },
}));

const edinburghEmail = "planning@edinburgh.gov.uk";
const highlandsEmail = "eplanning@highland.gov.uk";

const islandsEmail = "stl@cne-siar.gov.uk";

const ObjectPlanning = ({ region }) => {
  const [objectionEmail, setObjectionEmail] = useState("");

  const [fetchedApps, setFetchedApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (region == "edinburgh") {
      setObjectionEmail(edinburghEmail);
      fetch(
        "https://raw.githubusercontent.com/gordonmaloney/STLPlanningScraper/refs/heads/main/data/NewData.json"
      )
        .then((res) => res.json())
        .then((data) => {
          setFetchedApps(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
    if (region == "highlands") {
      setObjectionEmail(highlandsEmail);

      fetch(
        "https://raw.githubusercontent.com/gordonmaloney/STLPlanningScraper/refs/heads/main/data/HL_NewData.json"
      )
        .then((res) => res.json())
        .then((data) => {
          setFetchedApps(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
    if (region == "islands") {
      setObjectionEmail(islandsEmail);

      fetch(
        "https://raw.githubusercontent.com/gordonmaloney/STLPlanningScraper/refs/heads/main/data/CnE_NewData.json"
      )
        .then((res) => res.json())
        .then((data) => {
          setFetchedApps(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [region]);

  //Scroll Position
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //Set selected application
  const [selected, setSelected] = useState();

  const navigate = useNavigate();

  const { ref } = useParams();

  // decode once
  const decodedRef = useMemo(() => (ref ? decodeURIComponent(ref) : ""), [ref]);

  const norm = (string) =>
    (string ?? "").trim().toLowerCase().replaceAll("/", "-"); // if you must keep the dash-for-slash convention

  useEffect(() => {
    if (!decodedRef || loading) return;
    const app = fetchedApps.find((a) => norm(a.reference) === norm(decodedRef));
    setSelected(app ?? null);
  }, [decodedRef, fetchedApps, loading]);

  const [coords, setCoords] = useState(0, 0);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [signOff, setSignOff] = useState("Regards,\n");
  const [optIn, setOptIn] = useState();
  const [email, setEmail] = useState("");

  const [councillors, setCouncillors] = useState([]);
  const [cc, setCC] = useState("");

  const [late, setLate] = useState(false);
  //Check if date is more than 28 days ago
  useEffect(() => {
    if (selected) {
      let dateToCheck = selected["Date Received"];
      let checkDate = new Date(moment.unix((dateToCheck - 25569) * 86400)._i);
      let today = new Date();
      let monthAgo = new Date(
        new Date(new Date().setDate(today.getDate() - 28))
      );

      if (checkDate < monthAgo) {
        setLate(true);
      }
    }
  }, [selected]);


  const [adminWard, setAdminWard] = useState("");

  useEffect(() => {
    if (selected) {
      setBody(
        `To whom it may concern,\n\nI am writing to comment in opposition to application reference number ${
          selected["reference"]
        } at ${selected["address"]}.

${region == "edinburgh" ? EDINBURGH_TEMPLATE : (region == "highlands" && adminWard == "Badenoch and Strathspey") ? BADENOCH_STRATHSPEY_TEMPLATE : region == "highlands" ? HIGHLANDS_TEMPLATE : region == "islands" && ISLANDS_TEMPLATE}${
          late
            ? "\n\nFinally, I understand that this objection is being lodged more than 28 days after the application was received by the council. The reason for this is because the information is not well advertised or easily accessible and I have only just been made aware of the application. I trust that my objection will be considered regardless."
            : ""
        }`
      );
      setSubject(`Objecting to STL application ${selected["reference"]}`);
      fetchData(selected.postcode);
    }
  }, [selected, late, adminWard]);

  const fetchData = async (postcode) => {
    if (selected && postcode) {
      const response = await fetch(
        `https://api.postcodes.io/postcodes/${postcode}`
      );
      const postcodeData = await response.json();
      setAdminWard(postcodeData.result.admin_ward);

      if (region == "edinburgh") {
        //EDINBURGH COUNCILLORS
        fetch(
          `https://raw.githubusercontent.com/gordonmaloney/rep-data/main/edinburgh-councillors.json`
        )
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch councillors");
            return res.json();
          })
          .then((data) => {
            setCouncillors(data.filter((clr) => clr.ward == adminWard));
          });
      }
      if (region == "highlands") {


        //highlands COUNCILLORS
        fetch(
          `https://raw.githubusercontent.com/gordonmaloney/rep-data/main/highland-councillors.json`
        )
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch councillors");
            return res.json();
          })
          .then((data) => {
            setCouncillors(data.filter((clr) => clr.ward == adminWard));
          });
      }

      //Islands councillors
      if (region == "islands") {
        fetch(
          `https://raw.githubusercontent.com/gordonmaloney/rep-data/main/islands-councillors.json`
        )
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch councillors");
            return res.json();
          })
          .then((data) => {
            setCouncillors(data.filter((clr) => clr.ward == adminWard));
          });
      }

      setCoords({
        lat: postcodeData.result.latitude,
        long: postcodeData.result.longitude,
      });
    }
  };

  useEffect(() => {
    setCC(councillors.map((cllr) => cllr.email).join(","));
  }, [councillors.length]);

  const [collapse, setCollapse] = useState("divBig");
  useEffect(() => {
    setCollapse("divSmall");
  }, []);

  //modal funcs
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const openModal = () => {
    setTimeout(() => {
      setOpen(true);
    }, 500);
  };

  const [highlight, setHighlight] = useState(false);

  const handleOptin = async () => {
    if (optIn) {
      const body = {
        email: email,
        msg: "Are you happy for Living Rent to contact you by email about this campaign and others like it? - Yes",
        source: window.location["href"].toString(),
      };

      const response = await axios.post(
        "https://long-ruby-narwhal-sock.cyclic.app/api/optin",
        body
      );
    } else {
      console.log("not opted in");
    }
  };

  //creating IP state
  const [ip, setIP] = useState("");
  //creating function to load ip address from the API
  const getIp = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    setIP(res.data.IPv4);
  };
  useEffect(() => {
    //passing getData method to the lifecycle method
    getIp();
  }, []);

  const handleTracker = async () => {
    const body = {
      source: window.location.host.toString(),
      campaign: window.location["href"].toString(),
      hits: 1,
      uniqueHits: ip,
      details: {
        channel: "email",
        targets: cc.concat([",licensing@edinburgh.gov.uk"]),
      },
      optins: optIn,
    };

    try {
      await axios.post(
        "https://long-ruby-narwhal-sock.cyclic.app/api/tracker",
        body
      );
    } catch {
      console.log("something's gone wrong");
    }
  };

  const containsNumber = (string) => {
    if (
      string.includes("1") ||
      string.includes("2") ||
      string.includes("3") ||
      string.includes("4") ||
      string.includes("5") ||
      string.includes("6") ||
      string.includes("7") ||
      string.includes("8") ||
      string.includes("9") ||
      string.includes("0")
    ) {
      return true;
    }
  };

  const incomplete =
    optIn == undefined ||
    email == "" ||
    signOff == "Regards,\n" ||
    !containsNumber(signOff.split(""));

  if (!loading && selected === null) {
    return (
      <div className="objectCont">
        <br />
        <br />
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "rgba(255,255,255,0.9)",
            border: "2px solid green",
            borderRadius: "5px",
            marginTop: "20px",
          }}
        >
          <h2 className="bebas header3" style={{ color: "black", fontSize: "2em" }}>
            Something has gone wrong
          </h2>
          <p style={{ fontSize: "1em", color: "black" }}>
            If you think this is a mistake,{" "}
            <a
              href="mailto:contact@livingrent.org?subject=Problem with STL app"
              style={{ color: "green", textDecoration: "underline" }}
            >
              get in touch
            </a>
            .
          </p>
          <br />
          <Button
            size="small"
            variant="contained"
            sx={{ margin: 1 }}
            onClick={() =>
              region == "edinburgh"
                ? navigate("../map")
                : navigate("../highlands")
            }
            style={{ ...BtnStyle, fontSize: "1.4em", marginBottom: "0px" }}
          >
            Back to applications
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div
        className="scrollBtn showOnMob"
        style={{
          visibility: scrollPosition > 150 && "hidden",
          opacity: 1 - (scrollPosition - 150) / 50,
          position: "fixed",
          bottom: 0,
          display: "inline-block",
          position: "fixed",
          left: "50%",
          transform: "translate(-50%, 0)",
          zIndex: 5,
          backgroundColor: "rgba(255,255,255,0.5)",
          paddingTop: "1px",
          borderRadius: "50px",
        }}
      >
        <HashLink to="./#objection">
          <ExpandCircleDownIcon
            style={{ fontSize: "80px", color: "green", marginBottom: "-5px" }}
          />
        </HashLink>
      </div>

      <div className={collapse}></div>
      <div style={{ textAlign: "right" }}>
        <Button
          size="small"
          variant="contained"
          sx={{ margin: 1 }}
          onClick={() =>
            region == "edinburgh"
              ? navigate("../map")
              : navigate("../highlands")
          }
          style={{ ...BtnStyle, fontSize: "1.4em", marginBottom: "0px" }}
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

            <Accordion
              defaultExpanded
              className="talkingPoints"
              sx={{
                backgroundColor: "rgba(255,255,255,0.9)",
                borderRadius: "0px !important",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="details"
                sx={{ padding: "0", marginY: "-10px" }}
              >
                <div
                  className="bebas header3 header"
                  style={{ color: "black", marginLeft: "10px" }}
                >
                  Writing a great objection
                </div>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: 0, marginRight: "10px" }}>
                <ul style={{ textAlign: "left" }}>
                  <li style={{ display: "none" }}>
                    You can use the buttons below to add paragraphs about
                    specific issues to your objection.
                  </li>
                  <li>
                    There is a template letter that you can use,{" "}
                    <b>
                      but your objection will be more impactful if you
                      personalise the text and add your own reasons for opposing
                      the licence.
                    </b>
                  </li>
                  <li>
                    Remember to be civil - don't give officials a reason to
                    throw your objection out!
                  </li>
                  <li>
                    If you are local to the application, make sure you mention
                    that - the more it would personally impact you, the more
                    weight your objection will have.
                  </li>
                </ul>

                <center style={{ display: "none" }}>
                  <Button
                    variant="contained"
                    sx={{ margin: 1 }}
                    onClick={() =>
                      setBody(
                        (body) => body + "\n\nDraft paragraph about noise."
                      )
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
              </AccordionDetails>
            </Accordion>

            <Accordion
              className="talkingPoints"
              sx={{ backgroundColor: "rgba(255,255,255,0.9)" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="details"
                sx={{ padding: "0", marginY: "-10px" }}
              >
                <div
                  className="bebas header3 header"
                  style={{ color: "black", marginLeft: "10px" }}
                >
                  Application details:
                </div>{" "}
              </AccordionSummary>
              <AccordionDetails sx={{ padding: 0, marginRight: "10px" }}>
                {selected ? (
                  <ul>
                    <li>
                      <b>Application summary:</b> {selected["title"]}
                    </li>
                    <li>
                      <b>Address:</b> {selected["address"]}
                    </li>
                    <li>
                      <b>Reference: </b>
                      {selected["reference"]}
                    </li>
                    <li>
                      <b>Link: </b>{" "}
                      <u>
                        <a href={selected["link"]} target="_blank">
                          Click here
                        </a>
                      </u>
                    </li>
                  </ul>
                ) : (
                  <>Loading...</>
                )}
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12} sm={8} md={7}>
            <div className="email">
              <br />
              <span
                id="objection"
                className="bebas header3 header"
                style={{ color: "black", marginLeft: "10px" }}
              >
                Your objection
              </span>
              <br /> <br />
              <FormLabel sx={{ marginLeft: "2.5%" }}>Subject:</FormLabel>
              <br />
              <TextField
                sx={{ width: "95%", margin: "1px 2.5% 7px 2.5%" }}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <br />
              <FormLabel sx={{ marginLeft: "2.5%" }}>Body:</FormLabel>
              <br />
              <TextField
                sx={{ width: "95%", margin: "1px 2.5% 7px 2.5%" }}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                multiline
                minRows={6}
              />
              <br />
              <div
                style={{
                  width: "95%",
                  margin: "0px 0.5% 2px 0.5%",
                  padding: "5px 2%",
                  border:
                    highlight &&
                    (signOff == "Regards,\n" ||
                      !containsNumber(signOff.split(""))) &&
                    "1px solid red",
                }}
              >
                <FormLabel>Your details (including address):</FormLabel>
                <br />

                <HtmlTooltip
                  disableHoverListener
                  title={
                    <>
                      Make sure you <u>include your address</u> so they know
                      you're {region == "edinburgh" && "an Edinburgh"}
                      {region == "highlands" && "a Highlands"} resident!
                    </>
                  }
                  placement="top"
                  arrow
                >
                  <TextField
                    sx={{ width: "99%", margin: "1px 0.5% 7px 0.5%" }}
                    value={signOff}
                    onChange={(e) => setSignOff(e.target.value)}
                    multiline
                    minRows={2}
                  />
                </HtmlTooltip>
              </div>
              <div
                style={{
                  width: "95%",
                  margin: "0px 0.5% 2px 0.5%",
                  padding: "5px 2%",
                  border: highlight && email == "" && "1px solid red",
                }}
              >
                <FormLabel sx={{}}>* Your email address:</FormLabel>
                <br />
                <TextField
                  required
                  sx={{
                    width: "100%",
                    borderRadius: "5px",
                  }}
                  value={email}
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <FormControl
                sx={{
                  width: "95%",
                  margin: "1px 0.5% 7px 0.5%",
                  padding: "0 2%",
                  border: highlight && optIn == undefined && "1px red solid",
                }}
              >
                <FormLabel
                  id="optIn"
                  sx={{ color: "black !important", fontSize: "small" }}
                >
                  * Are you happy for Living Rent to contact you by email about
                  this campaign and others like it?
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="optIn"
                  name="radio-buttons-group"
                  required
                  onChange={(e) => setOptIn(e.target.value === "true")}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio sx={RadioStyle} size="small" />}
                    label={<span style={{ fontSize: "small" }}>Yes</span>}
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio sx={RadioStyle} size="small" />}
                    label={<span style={{ fontSize: "small" }}>No</span>}
                  />
                </RadioGroup>
              </FormControl>
              <br />
              <br />
              <Grid container justifyContent="space-around">
                <Grid item>
                  <div
                    onClick={() => {
                      incomplete && setHighlight(true);
                    }}
                  >
                    <Button
                      href={`mailto:${objectionEmail}?subject=${subject}&cc=${cc}&bcc=${
                        optIn
                          ? "stlbjections+OptIn@livingrent.org"
                          : "stlObjections+OptOut@livingrent.org"
                      }&body=${
                        body.replace(/\n/g, "%0A") +
                        "%0A%0A" +
                        signOff.replace(/\n/g, "%0A")
                      }`}
                      disabled={incomplete}
                      size="large"
                      variant="contained"
                      style={{ ...BtnStyleSmall, margin: 2 }}
                      onClick={() => {
                        openModal();
                        handleOptin();
                        handleTracker();
                      }}
                    >
                      Send your objection
                    </Button>
                  </div>
                </Grid>
                <Grid item sx={{ display: { xs: "none", sm: "block" } }}>
                  <div
                    onClick={() => {
                      (optIn == undefined ||
                        email == "" ||
                        !signOff.split("").contains("1")) &&
                        setHighlight(true);
                    }}
                  >
                    <Button
                      className="hideOnMob"
                      size="large"
                      variant="contained"
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${objectionEmail}&su=${subject}&cc=${cc}&bcc=${
                        optIn
                          ? "stlbjections%2BOptIn@livingrent.org"
                          : "stlObjections%2BOptOut@livingrent.org"
                      }&body=${
                        body.replace(/\n/g, "%0A") +
                        "%0A%0A" +
                        signOff.replace(/\n/g, "%0A")
                      }`}
                      target="_blank"
                      onClick={() => {
                        openModal();
                        handleOptin();
                        handleTracker();
                      }}
                      disabled={incomplete}
                      style={{ ...BtnStyleSmall, margin: 2 }}
                    >
                      Send via Gmail
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <span
            style={{
              float: "right",
              marginTop: "-23px",
              marginRight: "-20px",
              cursor: "pointer",
            }}
            onClick={() => {
              setOpen(false);
            }}
          >
            x
          </span>
          <ModalContent />
        </Box>
      </Modal>
    </>
  );
};

export default ObjectPlanning;
