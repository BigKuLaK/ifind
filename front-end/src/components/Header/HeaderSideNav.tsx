import {
  useState,
  useRef,
  useCallback,
  useEffect,
  LegacyRef,
  useContext,
} from "react";
import { useSubCategories } from "@contexts/categoriesContext";
import { offersdata } from "@mocks/components/offerssidenav";
import eventBus from "@utilities/EventBus";
import {
  useCurrentRouteMatch,
  useCurrentRouteConfig,
  pathWithLanguage,
} from "@utilities/route";
import { GlobalStateContext } from "@contexts/globalStateContext";

import "./header-side-nav.scss";
import HeaderSideNavSubMenu from "./HeaderSideNavSubMenu";
import HeaderSideNavSubMenu2 from "./HeaderSideNavSubMenu2";
import HeaderSideNavButton from "./HeaderSideNavButton";
import RenderIf from "@components/RenderIf";

const HeaderSideNav = ({ withSideNav }: HeaderNavProps) => {
  const match = useCurrentRouteMatch();
  const currentRouteConfig = useCurrentRouteConfig();
  const { subCategories } = useSubCategories();
  const { on } = eventBus;
  const listRef = useRef<HTMLDivElement | null>();
  const { dealTypeName, onOffersClick } = useContext(GlobalStateContext);

  const [isVisible, setIsVisible] = useState(true);
  const [checked, setChecked] = useState(false);
  const checkChange = () => setChecked(!checked);

  const ecommerceClick = useCallback(
    (catName) => {
      if (onOffersClick) {
        onOffersClick(catName);
      }
      //console.log(catName);
    },
    [onOffersClick]
  );

  const triggerScroll = useCallback(() => {
    if (listRef.current) {
      listRef.current.scrollTop += listRef.current.offsetHeight;
    }
  }, [listRef]);

  const handleScroll = useCallback(() => {
    on("scrollPanelScroll", triggerScroll);
  }, [on, triggerScroll]);

  useEffect(() => {
    handleScroll();
  });

  return withSideNav ? (
    <div className="header-side-nav">
      <RenderIf condition={currentRouteConfig?.withSideNav || false}>
        <h3
          className={[
            "header-side-nav__heading",
            isVisible === true ? "active" : "",
          ].join(" ")}
          onClick={() => setIsVisible(!isVisible)}
        >
          {/*
                    TODO: Instead of dynamically rendering depending on width,
                    display/hide the "CATEGORIES" text instead through CSS
                  */}
          <i aria-hidden="true" className="fa fa-bars"></i>
          <span>CATEGORIES</span>
        </h3>
      </RenderIf>
      {isVisible ? (
        <div
          ref={listRef as LegacyRef<HTMLDivElement>}
          className="header-side-nav__list"
        >
          {match?.path === pathWithLanguage("/offers") ? (
            <div className="offers-sidenav">
              {offersdata.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={[
                      "list",
                      dealTypeName === item.categoryName ? "active" : "",
                    ].join(" ")}
                  >
                    <button onClick={() => ecommerceClick(item.categoryName)}>
                      <span className="offers-icon">{item.categoryIcon}</span>
                      <span className="offers-label">{item.categoryLabel}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : match?.path === pathWithLanguage("/productcomparison") ? (
            <div className="prodcomp-sidenav">
              <div className="header-side-nav__label">
                <label className="label">Deep Navigation</label>
                <label className="switch">
                  <input
                    id="check"
                    type="checkbox"
                    onChange={checkChange}
                    checked={checked}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div>
                {checked ? (
                  <HeaderSideNavSubMenu
                    categories={subCategories}
                    checked={checked}
                    //checkChange={checkChange}
                    triggerScroll={triggerScroll}
                  />
                ) : (
                  <HeaderSideNavSubMenu2
                    categories={subCategories}
                    triggerScroll={triggerScroll}
                  />
                )}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      {isVisible ? (
        <div className="header-side-nav__arrow-container">
          {match?.path === pathWithLanguage("/productcomparison") ? (
            <HeaderSideNavButton />
          ) : null}
        </div>
      ) : null}
    </div>
  ) : null;
};

export default HeaderSideNav;
