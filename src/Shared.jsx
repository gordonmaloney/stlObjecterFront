import { checkboxClasses } from "@mui/material/Checkbox";

export const BtnStyle = {
    fontFamily: "Bebas Neue, Roboto",
    borderRadius: '2px',
    color: "white",
    backgroundColor: 'green',
    fontSize: '2em',
    lineHeight: '1.2em',
padding: '5px 10px 0px 10px',
    "&:hover, &:active": { backgroundColor: "white", color: 'green' },
  };
  

  export const BtnStyleSmall = {
    fontFamily: "Bebas Neue, Roboto",
    borderRadius: '2px',
    color: "white",
    backgroundColor: 'green',
    fontSize: '1.5em',
    lineHeight: '1.2em',
padding: '5px 8px 0px 10px',
    "&:hover, &:active": { backgroundColor: "white", color: 'green' },
  };
  
  export const CheckBoxStyle = {

    color: "green",
    [`&, &.${checkboxClasses.checked}`]: {
      color: 'green',
    },
  };
  