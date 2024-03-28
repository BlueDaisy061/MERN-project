import React from "react";
import "./Backdrop.css";
import { createPortal } from "react-dom";
const Backdrop = (props) => {
    return createPortal(<div className="backdrop" onClick={props.onClick}></div>, document.getElementById("backdrop-hook"));
};
export default Backdrop;
