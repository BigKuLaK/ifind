import {Suspense, lazy} from 'react';
import { useLocation } from "react-router-dom";
import { navigationRoutes } from "@config/routes";
import { useTranslation, navigation } from "@translations/index";

import CustomLink from "@components/Link";

import "./header-nav.scss";

const HeaderSideNav = lazy(() => import("./HeaderSideNav") as Promise<any>);

const HeaderNav = ({ withSideNav }: HeaderNavProps) => {
  const { pathname } = useLocation();
  const noLanguagePathName = "/" + pathname.split("/").slice(2).join("/");
  const translate = useTranslation();

  return (
    <div className="header-nav">
      <div className="header-nav__container">
        <div className="header-nav__row">
          <Suspense fallback='Loading...'>
            <HeaderSideNav withSideNav={withSideNav} />
          </Suspense>
          <div className="menu-area">
            <ul className="main-menu">
              {navigationRoutes.map((navItem) => (
                <li key={navItem?.path}>
                  <CustomLink
                    to={navItem?.path || ""}
                    className={
                      noLanguagePathName === navItem?.path
                        ? "active current"
                        : ""
                    }
                  >
                    {translate(
                      (navigation as GenericObject)[
                      navItem?.translationKey || ""
                      ]
                    ) || navItem?.label}
                  </CustomLink>
                </li>
              ))}
            </ul>
            {/* <div className="clock">
              <span>{time}</span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderNav;
