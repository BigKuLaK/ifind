import { useCallback, useEffect, useState } from "react";

import HeaderTop from "./HeaderTop";
import HeaderMiddle from "./HeaderMiddle";
import HeaderNav from "./HeaderNav";

import { useGlobalData } from "@contexts/globalDataContext";
import { useCurrentRouteConfig } from "@utilities/route";

import "./header.scss";

const Header = () => {
  const { contactInfo } = useGlobalData();
  const currentRouteConfig = useCurrentRouteConfig();
  const [isSticky, setIsSticky] = useState(false);
  const classNames = [
    "header",
    currentRouteConfig?.withSideNav ? "header--with-side-nav" : false,
  ]
    .filter(Boolean)
    .join(" ");

  /**
   * Handles intersection
   * isInterSected is false when header is in sticky state
   */
  const handleHeaderIntersection = useCallback((isInterSected) => {
    setIsSticky(!isInterSected);
  }, []);

  // Apply necessary classnames for sticky state
  useEffect(() => {
    //const updatedClassNames = ['header'];
    // if (isSticky) {
    //     updatedClassNames.push('header--sticked');
    // }
    // setClassNames(updatedClassNames.join(' '));
    //console.log(isSticky);
  }, [isSticky]);

  return (
    <header className={classNames}>
      <HeaderTop {...contactInfo} />
      <HeaderMiddle onInterSect={handleHeaderIntersection} />
      <HeaderNav />
    </header>
  );
};

export default Header;
