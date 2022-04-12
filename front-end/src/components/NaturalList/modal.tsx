import React from 'react';
import { createPortal } from 'react-dom';

import './modal.module.scss';

const modal = ({ open, close, children }: NaturalListModalProps) => {

    if (!open) {
        return null;
    }

    return createPortal(
        <div className="modal-overlay">
            <div className="modal-container">
                <span className="close-button" onClick={close}>X</span>
                <div className="modal-content">{children}</div>
            </div>
        </div>,
        document.getElementById("portal") as HTMLElement
    )
}

export default modal;
