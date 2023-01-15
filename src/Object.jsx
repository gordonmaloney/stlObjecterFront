import React from "react";

const Object = ({ selected }) => {

  console.log(selected)
  return (
    <div>
      Objecting to application {selected["Application reference number"]}

      <p>I am writing to object to application <b>{selected["Application reference number"]}</b>, in the name of <b>{selected["Applicant"]}</b>....</p>

    </div>
  );
};

export default Object;
