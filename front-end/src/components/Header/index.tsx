import { useEffect, useState } from "react";

import { routesExtraConfig } from "@config/routes";

import HeaderMiddle from "./HeaderMiddle";
import HeaderNav from "./HeaderNav";
import "./header.module.scss";

const Header = () => {
  const [additionalClassNames, setAdditionalClassNames] = useState<string[]>(
    []
  );
  const classNames = ["header", ...additionalClassNames]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    const additionalClassNames = [];
    const offersRouteConfig = routesExtraConfig.find(
      ({ id }) => id === "offers"
    );

    if (offersRouteConfig?.pattern?.test(window.location.pathname)) {
      additionalClassNames.push("header--with-side-nav");
    }

    setAdditionalClassNames(additionalClassNames);
  }, []);

  return (
    <header className={classNames}>
      <HeaderMiddle />
      <HeaderNav />
    </header>
  );
};

export default Header;
