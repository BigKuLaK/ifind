import { useEffect, useState } from "react";

import { useOffersCategories } from "@contexts/offersCategoriesContext";
import { useGlobalState } from "@contexts/globalStateContext";
import NavPills from "@components/NavPills";
import { useLinkWithLanguage } from "@utilities/route";

import HeaderSideNav from "./HeaderSideNav";

import "./header-nav.module.scss";

const HeaderNav = () => {
  const { activeOffer } = useGlobalState();
  const linkWithLanguage = useLinkWithLanguage();
  const { offersCategories } = useOffersCategories();
  const [navPillsItems, setNavPillsItems] = useState<NavPillItemProps[]>([]);

  useEffect(() => {
    if (offersCategories?.length) {
      setNavPillsItems(
        offersCategories.map(({ id, label }) => ({
          active: id === activeOffer,
          href: linkWithLanguage(`/offers/${id}`),
          label: (label || []).map<NavPillItemTranslatableLabel>(
            (offersCategoryLabel) => ({
              language: offersCategoryLabel?.language || "",
              label: offersCategoryLabel?.label || "",
            })
          ),
        }))
      );
    }
  }, [offersCategories, activeOffer, linkWithLanguage]);

  return (
    <div className="header-nav">
      <div className="header-nav__container">
        <div className="header-nav__row">
          <HeaderSideNav />
          <div className="menu-area">
            <ul className="main-menu">
              <NavPills items={navPillsItems} />
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
