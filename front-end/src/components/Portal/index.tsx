import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const Portal = ({ id, children }: PortalProps) => {
  const [isRootRendered, setIsRootRendered] = useState(false);
  const portalRoot = useRef(
    typeof document !== "undefined"
      ? document.querySelector(`#${id}`) || document.createElement("div")
      : null
  );

  useEffect(() => {
    if (portalRoot?.current) {
      portalRoot.current.id = id;
      portalRoot.current.classList.add("portal");
      document.body.appendChild(portalRoot.current);
      setIsRootRendered(true);
    }
  }, [id, portalRoot]);

  return isRootRendered && portalRoot?.current
    ? createPortal(children, portalRoot.current)
    : null;
};

export default Portal;
