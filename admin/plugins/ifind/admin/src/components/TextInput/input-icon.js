import React from "react";
import FontAwesomeIcon from "../FontAwesomeIcon";

const InputIcon = ({ icon, iconLink }) => {
  const IconElement = iconLink ? "a" : "span";
  const props = {
    className: "input-icon",
  };

  if (iconLink) {
    props.href = iconLink;
    props.target = "_blank";
  }

  return icon ? (
    <IconElement {...props}>
      <FontAwesomeIcon icon={icon} />
    </IconElement>
  ) : null;
};

export default InputIcon;
