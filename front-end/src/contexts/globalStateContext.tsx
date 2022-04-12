import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useParams } from "react-router";
// import { useParams } from "@contexts/nextRouter";

export const GlobalStateContext = createContext<GlobalStateContextData>({});

export const GlobalStateContextProvider = ({
  children,
}: React.PropsWithChildren<React.ReactNode>) => {
  const { offer_id } = useParams<AllPageParams>();
  const [activeCategory, setActiveCategory] = useState(null);
  const [focusedCategory, setFocusedCategory] = useState(0);
  const [dealTypeName, setDealTypeName] = useState("amazon_flash_offers");
  const [bodyScrollEnabled, setBodyScrollEnabled] = useState<boolean>(true);
  const [activeOffer, setActiveOffer] = useState(offer_id || "");

  const onCategoryClick = useCallback((id) => {
    setFocusedCategory(id);
  }, []);

  const onOffersClick = useCallback((name) => {
    setDealTypeName(name);
  }, []);

  const toggleBodyScroll = useCallback(
    (willEnable: boolean) => {
      if (typeof willEnable === "boolean") {
        setBodyScrollEnabled(willEnable);
      } else {
        setBodyScrollEnabled(!bodyScrollEnabled);
      }
    },
    [bodyScrollEnabled]
  );

  useEffect(() => {
    if (bodyScrollEnabled) {
      document.documentElement.style.setProperty("scroll-behavior", "auto");
      document.body.classList.toggle("body--fixed", false);
      window.scrollTo(
        0,
        parseFloat(document.body.style.getPropertyValue("--body-fixed-scroll"))
      );
      document.documentElement.style.removeProperty("scroll-behavior");
    } else {
      document.body.style.setProperty(
        "--body-fixed-scroll",
        window.pageYOffset + "px"
      );
      document.body.classList.toggle("body--fixed", true);
    }
  }, [bodyScrollEnabled]);

  return (
    <GlobalStateContext.Provider
      value={{
        activeCategory: parseInt(activeCategory || "", 10),
        setActiveCategory,
        focusedCategory,
        onCategoryClick,
        dealTypeName,
        onOffersClick,
        toggleBodyScroll,
        activeOffer,
        setActiveOffer,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
export const useGlobalState = () => useContext(GlobalStateContext);
