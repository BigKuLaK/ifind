import { useEffect, useCallback, useState } from "react";

import Portal from "@components/Portal";
import withConditionalRender from "@utilities/hocs/withConditionalRender";

import "./styles.module.scss";

const COLUMN_COUNTS = 12;

const GridGuide = () => {
  const [isVisible, setIsVisible] = useState(false);

  const onKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (/^g$/i.test(e.key) && e.ctrlKey) {
        setIsVisible(!isVisible);
      }
    },
    [isVisible]
  );

  useEffect(() => {
    if (isVisible) {
      window.localStorage.setItem("grid-guide-visible", "true");
    } else {
      window.localStorage.removeItem("grid-guide-visible");
    }
  }, [isVisible]);

  useEffect(() => {
    const isVisible = Boolean(
      window.localStorage.getItem("grid-guide-visible")
    );

    setIsVisible(isVisible);
    document.addEventListener("keyup", (e) => onKeyPress(e));

    return () => document.removeEventListener("keyup", (e) => onKeyPress(e));
  }, [onKeyPress]);

  return (
    <Portal id="grid-guide-portal">
      {(isVisible && (
        <div className="grid-guide">
          <div className="grid-guide__grid">
            {Array.from({ length: COLUMN_COUNTS }).map(() => (
              <div className="grid-guide__column"></div>
            ))}
          </div>
        </div>
      )) || <></>}
    </Portal>
  );
};

export default withConditionalRender(GridGuide);
