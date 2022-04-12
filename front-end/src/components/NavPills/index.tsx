import { useState, useCallback, useRef, LegacyRef, useEffect } from "react";
import { useDebounce } from "react-use";

import RenderIf from "@components/RenderIf";

import NavPillItem from "./item";
import "./styles.module.scss";

const NavPills = ({ items = [] }: NavPillsProps) => {
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [currentScrollLeft, setCurrentScrollLeft] = useState<number>(0);
  const [debouncedScrollLeft, setDebouncedScrollLeft] = useState<number>(
    currentScrollLeft
  );
  const [listClassName, setListClassName] = useState<string>("navpills__list");
  const navPillsListRef = useRef<HTMLElement | null>(null);

  useDebounce(
    () => {
      if (navPillsListRef?.current) {
        const scrollLeft = navPillsListRef.current.scrollLeft || 0;
        const maxScroll =
          navPillsListRef.current.scrollWidth -
          navPillsListRef.current.offsetWidth;

        // Determine whether to show each button
        setShowLeftButton(scrollLeft > 0);
        setShowRightButton(scrollLeft < maxScroll);
        setDebouncedScrollLeft(scrollLeft);
      } else {
        setDebouncedScrollLeft(0);
      }
    },
    100,
    [currentScrollLeft]
  );

  const calculateScroll = useCallback(() => {
    setCurrentScrollLeft(navPillsListRef?.current?.scrollLeft || 0);
  }, [navPillsListRef]);

  const scrollToLeft = useCallback(() => {
    navPillsListRef?.current?.scrollTo({
      left: debouncedScrollLeft - navPillsListRef?.current.offsetWidth / 2,
      behavior: "smooth",
    });
  }, [navPillsListRef, debouncedScrollLeft]);

  const scrollToRight = useCallback(() => {
    navPillsListRef?.current?.scrollTo({
      left: debouncedScrollLeft + navPillsListRef?.current.offsetWidth / 2,
      behavior: "smooth",
    });
  }, [navPillsListRef, debouncedScrollLeft]);

  useEffect(() => {
    if (navPillsListRef?.current) {
      calculateScroll();
    }
  }, [navPillsListRef, calculateScroll]);

  useEffect(() => {
    const classNames = ["navpills__list"];

    switch (true) {
      case showLeftButton && !showRightButton:
        classNames.push("navpills__list--scroll-left");
        break;
      case !showLeftButton && showRightButton:
        classNames.push("navpills__list--scroll-right");
        break;
      case showLeftButton && showRightButton:
        classNames.push("navpills__list--scroll-both");
        break;
    }

    setListClassName(classNames.join(" "));
  }, [showLeftButton, showRightButton]);

  return (
    <nav className="navpills">
      <RenderIf condition={showLeftButton}>
        <button className="larrow" onClick={scrollToLeft}>
          <i className="fa fa-chevron-left"></i>
        </button>
      </RenderIf>
      <ul
        className={listClassName}
        ref={navPillsListRef as LegacyRef<HTMLUListElement>}
        onScroll={calculateScroll}
      >
        {items?.map((item, index) => (
          <NavPillItem {...item} key={item.href + index} />
        ))}
      </ul>
      <RenderIf condition={showRightButton}>
        <button className="rarrow" onClick={scrollToRight}>
          <i className="fa fa-chevron-right"></i>
        </button>
      </RenderIf>
    </nav>
  );
};

export default NavPills;
