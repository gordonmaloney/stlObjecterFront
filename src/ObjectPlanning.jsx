import {
  Checkbox,
  FormControl,
  FormLabel,
  Grid,
  TextField,
} from "@mui/material";
import { Loading } from "react-loading-dot/lib";
import React, { useEffect, useState } from "react";
import { Button, RadioGroup, Radio } from "@mui/material";
import SmallMap from "./smallMap";
import { Councillors } from "./Councillors";
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

import { PlanningApps } from "./PlanningApplications";

//tooltip
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from '@mui/material/styles';


//modal imports
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

//accordion imports
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
        backgroundColor: '#f5f5f9',
        border: "1px solid darkgreen"
      }
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(13),
    border: '1px solid darkgreen',
  },
}));

const ObjectPlanning = () => {
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

  const [selected, setSelected] = useState();
  const [coords, setCoords] = useState(0, 0);

  const navigate = useNavigate();

  const params = useParams();

  console.log(params.postcode)

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [signOff, setSignOff] = useState("Regards,\n");
  const [optIn, setOptIn] = useState();
  const [email, setEmail] = useState("");

  const [councillors, setCouncillors] = useState([]);
  const [cc, setCC] = useState("");

  useEffect(() => {
   
    let newSelected = PlanningApps.filter(app => app["reference"].replace('\/', '-').replace('\/', '-') == params.postcode)[0]

    setSelected(newSelected);
  }, []);


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

  console.log(selected)


  useEffect(() => {
    if (selected) {
      setBody(
        `To whom it may concern,\n\nI am writing to comment in opposition to application reference number ${selected["reference"]} at ${selected["address"]}.

Our city is in the midst of a catastrophic housing crisis, and I believe that every holiday let is one less home for ordinary residents to live in. This development would exacerbate the crisis for all residents of the city, displacing people from their communities, driving up rents, and further reducing the desperately needed numbers of homes in the city. Planning decisions should first and foremost cater for the needs and interests of the city’s residents, and this proposed development runs counter to that.

Moreover, I believe that this development is incompatible with planning and development policies at both a local and national level.

The Edinburgh City Plan 2030 states that “[p]roposals which would result in the loss of residential dwellings through demolition or a change of use will not be permitted”. Every proposed holiday let could be a residential dwelling, and I do not believe that granting this application is in keeping with the policies outlined in the City Plan.

The plan goes on to state that “[d]evelopments, including change of use which would have a materially detrimental effect on the living conditions of nearby residents, will not be permitted.” The impact of high concentrations of holiday lets on nearby rent levels is well documented, and I believe that granting this application will exacerbate the hardship faced by tenants in the community, and therefore is not in keeping with the City Plan.

The Scottish Government's National Planning Framework 4 states:
“Development proposals for the reuse of existing buildings for short term holiday letting should not be supported if it would result in:
• an unacceptable impact on the local amenity or character of a neighbourhood or area; or
• the loss of residential accommodation where such loss is not outweighed by local economic benefits.”

I strongly maintain that this development would have detrimental effects on the local amenity and character of the area, by removing what should be residential accommodation from local supply. I see no evidence that any local economic benefits outweigh this loss. It also seems clear to me that this development will place a significant burden on local services such as rubbish collection and public transport, negatively impacting all local residents within the community.${
          late
            ? "\n\nFinally, I understand that this objection is being lodged more than 28 days after the application was received by the council. The reason for this is because the information is not well advertised or easily accessible and I have only just been made aware of the application. I trust that my objection will be considered regardless."
            : ""
        }`
      );
      setSubject(
        `Objecting to STL application ${selected["reference"]}`
      );
      fetchData(selected.postcode);
    }
  }, [selected, late]);

  const fetchData = async (postcode) => {
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
    console.log("tracking...");

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
          onClick={() => navigate("../map")}
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
                  title={<>Make sure you <u>include your address</u> so they know you're an Edinburgh resident!</>}
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
                  onChange={(e) => setOptIn(e.target.value)}
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
                      href={`mailto:planning@edinburgh.gov.uk?subject=${subject}&cc=${cc}&bcc=${
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
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to= planning@edinburgh.gov.uk&su=${subject}&cc=${cc}&bcc=${
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
