import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  forwardRef,
} from "react";
import { FaTimes } from "react-icons/fa";
import { useGlobalState } from "@contexts/globalStateContext";
import Portal from "@components/Portal";

import "./styles.module.scss";

const Modal = forwardRef(
  (
    { children, className, visible = false, onClose }: ModalProps,
    ref: React.ForwardedRef<HTMLElement>
  ) => {
    const { toggleBodyScroll } = useGlobalState();
    const classNames = [
      "ifind-modal",
      className,
      visible ? "ifind-modal--visible" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const onCloseClick = useCallback<MouseEventHandler>(
      (e) => {
        e.preventDefault();

        if (typeof onClose === "function" && toggleBodyScroll) {
          onClose();
          toggleBodyScroll(true);
        }
      },
      [onClose, toggleBodyScroll]
    );

    const onKeyPress = useCallback(
      (e) => {
        if (/esc/i.test(e.key) && typeof onClose === "function") {
          onClose();
        }
      },
      [onClose]
    );

    useEffect(() => {
      if (toggleBodyScroll) {
        toggleBodyScroll(!visible);
      }
    }, [visible, toggleBodyScroll]);

    useEffect(() => {
      window.addEventListener("keydown", onKeyPress);

      return () => window.removeEventListener("keydown", onKeyPress);
    }, [onKeyPress]);

    return (
      <Portal id="modal-portal">
        <div
          className={classNames}
          ref={ref as React.LegacyRef<HTMLDivElement> | undefined}
        >
          <div className="ifind-modal__scrollarea">
            <div className="ifind-modal__underlay" onClick={onCloseClick}></div>
            <div className="ifind-modal__dialog">
              <button className="ifind-modal__close" onClick={onCloseClick}>
                <FaTimes />
              </button>
              {children}
            </div>
          </div>
        </div>
      </Portal>
    );
  }
);

export default Modal;
