import PropTypes from "prop-types";
import { iconsList } from "ifind-icons";
import "./ifind-icon.module.scss";

const IfindIcon = ({ icon, dark, className, ...props }: IfindIconProps) => {
  const iconName = icon.replace(/_/g, "-");
  const processedClassName = [
    className,
    "ifind-icon",
    dark ? "ifind-icon--dark" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return iconsList.includes(iconName) ? (
    <div className={processedClassName}>
      <div
        className="ifind-icon__image"
        style={{
          ["--icon-path" as string]: `url(/icons/${iconName}.svg)`,
        }}
      />
    </div>
  ) : null;
};

IfindIcon.propTypes = {
  dark: PropTypes.bool,
};

IfindIcon.defaultProps = {
  dark: false,
};

export default IfindIcon;
