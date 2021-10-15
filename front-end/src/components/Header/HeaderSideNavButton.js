import React, { useState, useEffect, useCallback } from 'react';
import { useWindowScroll } from 'react-use';
import eventBus from '@utilities/EventBus';

const HeaderSideNavButton = () => {

    const { y: pageYOffset } = useWindowScroll();
    const [isVisible, setIsVisible] = useState(false);
    const { dispatch } = eventBus;

    const onClick = useCallback(() => {
        //console.log("clicked");
        dispatch('scrollPanelScroll');
    }, [dispatch]);


    useEffect(() => {
        if (pageYOffset === document.height) {
            setIsVisible(false);
        }
        else {
            setIsVisible(true);
        }

    }, [pageYOffset])


    if (!isVisible) {
        return false;
    }

    return (
        <div className="arrow-button" onClick={onClick}>
            <i className="fa fa-chevron-down"></i>
        </div>
    )
}

export default HeaderSideNavButton;
