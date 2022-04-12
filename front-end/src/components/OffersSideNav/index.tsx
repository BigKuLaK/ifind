import { useCallback } from "react";
import withConditionalRender from "@utilities/hocs/withConditionalRender";
import { useTranslation } from "@translations/index";
import RenderIf from "@components/RenderIf";
import IfindIcon from "@components/IfindIcon";
import { useOffersSideNav } from "./context";

import "./styles.module.scss";

const OffersSideNav = ({
  activeDealTypeName,
  onDealClick,
}: OffersSideNavProps) => {
  const translate = useTranslation();
  const { items } = useOffersSideNav();

  const extractNavLabel = useCallback(
    (dealType: DealType) => {
      const translatedLabelMap = dealType?.nav_label?.reduce(
        (labelMap: TranslationMap, navLabelTranslation) => {
          const code = navLabelTranslation?.language || "";
          labelMap[code] = navLabelTranslation?.label || "";
          return labelMap;
        },
        {}
      );

      return translate(translatedLabelMap);
    },
    [translate]
  );

  return (
    <div className="offers-sidenav">
      {items?.map((item) => {
        return (
          <div
            key={item.name}
            className={[
              "list",
              item.name === activeDealTypeName ? "active" : "",
            ].join(" ")}
          >
            <button onClick={() => onDealClick(item.name || "")}>
              <span className="offers-icon">
                <RenderIf condition={item.nav_icon?.type === "fontawesome"}>
                  <i
                    className={`fa fa-${item.nav_icon?.icon}`}
                    aria-hidden="true"
                  ></i>
                </RenderIf>
                <RenderIf condition={item.nav_icon?.type === "ifind"}>
                  <IfindIcon icon={item.nav_icon?.icon || ""} />
                </RenderIf>
              </span>
              <span className="offers-label">{extractNavLabel(item)}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default withConditionalRender<OffersSideNavProps>(OffersSideNav);
