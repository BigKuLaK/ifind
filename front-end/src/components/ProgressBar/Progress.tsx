import React from "react";
import PropTypes from "prop-types";

import "./styles.module.scss";

const ProgressBar = ({ value, max, color, width = "" }: ProgressProps) => {
  return (
    <div className="progress" style={{ width, backgroundColor: color }}>
      <progress value={value} max={max} />
      <span>{(value / max) * 100}%</span>
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  color: PropTypes.string,
  width: PropTypes.string,
};

ProgressBar.defaultProps = {
  max: 100,
  color: "none",
  width: "150px",
};

export default ProgressBar;
