import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Label, InputText } from "@buffetjs/core";

import InputBlock from "../InputBlock";
import InputIcon from "./input-icon";

import "./styles.scss";

const TextInput = ({
  label,
  id,
  value = "",
  name = null,
  disabled = false,
  error = null,
  onChange = () => {},
  className = "",
  placeholder = "",
  search,
  icon = "",
  iconLink = "",
}) => {
  const classNames = [
    className,
    "text-input",
    icon ? "text-input--with-icon" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <InputBlock className={classNames} error={error}>
      <Label htmlFor={id}>
        <span dangerouslySetInnerHTML={{ __html: label || "&nbsp;" }} />
      </Label>
      <InputText
        className='text-input__input'
        name={name || id}
        id={id}
        value={value}
        disabled={disabled}
        type={search ? "search" : "text"}
        placeholder={placeholder}
        onChange={({ target: { value } }) =>
          typeof onChange === "function" && onChange(value)
        }
      />
      {icon ? <InputIcon icon={icon} iconLink={iconLink} /> : ""}
    </InputBlock>
  );
};

TextInput.propTypes = {
  disabled: PropTypes.bool,
  search: PropTypes.bool,
};

export default TextInput;
