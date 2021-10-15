import React, { AnchorHTMLAttributes } from "react";

import "./styles.scss";

// TYPES
export enum E_ButtonLinkColor {
  primary = "primary",
  secondary = "secondary",
  cancel = "cancel",
  success = "success",
  delete = "delete",
  none = "none",
}

export interface I_ButtonLinkProps extends AnchorHTMLAttributes<any> {
  color?: E_ButtonLinkColor;
}

// COMPONENT
const ButtonLink = ({
  href = "",
  color = E_ButtonLinkColor.primary,
  children = null,
  ...props
}: I_ButtonLinkProps): JSX.Element => {
  const className = ["button-link", `button-link--${color}`];

  return (
    <a href={href} className={className.join(" ")} {...props}>
      {children}
    </a>
  );
};

export default ButtonLink;
