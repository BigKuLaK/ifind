import {
  useState,
  useRef,
  useCallback,
  useEffect,
  LegacyRef,
  useContext,
} from "react";
import { useSubCategories } from "@contexts/categoriesContext";
import eventBus from "@utilities/EventBus";
import { useIsRouteMatch } from "@utilities/route";
import { useTranslation } from "@translations/index";
import { GlobalStateContext } from "@contexts/globalStateContext";
import { routesExtraConfig } from "@config/routes";

import "./header-side-nav.module.scss";
import HeaderSideNavSubMenu from "./HeaderSideNavSubMenu";
import HeaderSideNavSubMenu2 from "./HeaderSideNavSubMenu2";
import HeaderSideNavButton from "./HeaderSideNavButton";
import RenderIf from "@components/RenderIf";
import OffersSideNav from "@components/OffersSideNav";

import { categories as categoriesLabel } from "./translations";

const HeaderSideNav = () => {
  const translate = useTranslation();
  const isRouteMath = useIsRouteMatch();
  const { subCategories } = useSubCategories();
  const { on } = eventBus;
  const { dealTypeName, onOffersClick } = useContext(GlobalStateContext);
  const [withSideNav, setWithSideNav] = useState<boolean>(false);

  const listRef = useRef<HTMLDivElement | null>();
  const [isVisible, setIsVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const offersRouteConfig = routesExtraConfig.find(({ id }) => id === "offers");

  const checkChange = () => setChecked(!checked);

  const ecommerceClick = useCallback(
    (catName) => {
      if (onOffersClick) {
        onOffersClick(catName);
      }
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

  const isMatch = useCallback(
    (regExp?: RegExp) => regExp?.test(window.location.pathname),
    []
  );

  useEffect(() => {
    handleScroll();

    if (isMatch(offersRouteConfig?.pattern)) {
      setWithSideNav(true);
    }
  }, [handleScroll, isMatch, offersRouteConfig]);

  return (
    <div className="header-side-nav">
      <RenderIf condition={withSideNav || false}>
        <h3
          className={[
            "header-side-nav__heading",
            isVisible === true ? "active" : "",
          ].join(" ")}
          onClick={() => setIsVisible(!isVisible)}
        >
          <i aria-hidden="true" className="fa fa-bars"></i>
          <span>{translate(categoriesLabel)}</span>
        </h3>
      </RenderIf>
      <RenderIf condition={isVisible}>
        <div
          ref={listRef as LegacyRef<HTMLDivElement>}
          className="header-side-nav__list"
        >
          <OffersSideNav
            renderIf={isMatch(offersRouteConfig?.pattern)}
            onDealClick={ecommerceClick}
            activeDealTypeName={dealTypeName}
          />
          <RenderIf condition={isRouteMath("/productcomparison")}>
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
                <HeaderSideNavSubMenu
                  renderIf={checked}
                  categories={subCategories}
                  checked={checked}
                  triggerScroll={triggerScroll}
                />
                <HeaderSideNavSubMenu2
                  renderIf={!checked}
                  categories={subCategories}
                  triggerScroll={triggerScroll}
                />
              </div>
            </div>
          </RenderIf>
        </div>
        <div className="header-side-nav__arrow-container">
          <RenderIf condition={isRouteMath("/productcomparison")}>
            <HeaderSideNavButton />
          </RenderIf>
        </div>
      </RenderIf>
    </div>
  );
};

export default HeaderSideNav;
