import React, { useState, useRef, useCallback, useEffect } from 'react';
import { find } from 'lodash';
import { useLocation } from 'react-router-dom';
import routes from '@config/routes';
import { useSubCategories } from '@contexts/categoriesContext';
import { homedata } from '@mocks/components/homesidenav';
import eventBus from '@utilities/EventBus';
import { useWindowSize } from '../../utilities/WindowResize';

import './header-side-nav.scss';
import HeaderSideNavSubMenu from './HeaderSideNavSubMenu';
import HeaderSideNavButton from './HeaderSideNavButton';

const HeaderSideNav = ({ withSideNav }) => {

    const { pathname } = useLocation();
    const currentRouteConfig = find(routes, ({ path }) => pathname === path);
    const { subCategories } = useSubCategories();
    //const categoryTree = useCategoryTree();
    const { on } = eventBus;
    const listRef = useRef();

    const [isVisible, setIsVisible] = useState(false);
    //const changeVisibility = () => setIsVisible(!isVisible);
    const [checked, setChecked] = useState(true);
    const checkChange = () => setChecked(!checked);
    const [width] = useWindowSize();
    // const [isHovered, setisHovered] = useState(false);
    const triggerScroll = useCallback(() => {
        listRef.current.scrollTop += listRef.current.offsetHeight;
    }, [listRef]);

    const handleScroll = useCallback(() => {
        on('scrollPanelScroll', triggerScroll)
    }, [on, triggerScroll]);

    useEffect(() => {
        handleScroll();
    });

    return withSideNav ?
        (
            <div className="header-side-nav"
                onMouseEnter={() => setIsVisible(true)}
            >
                <h3 className="header-side-nav__heading"
                    onMouseLeave={() => setIsVisible(false)}
                >
                    <i aria-hidden="true" className="fa fa-bars"></i>{width > 991 ? "CATEGORIES" : ""}
                </h3>
                {isVisible ? <div ref={listRef}
                    className="header-side-nav__list"
                    onMouseEnter={() => setIsVisible(true)}
                    onMouseLeave={() => setIsVisible(false)}
                >

                    {
                        currentRouteConfig.path === '/' ?
                            (<div>
                                {homedata.map((item, index) => {
                                    return (
                                        <div key={index}
                                            className={["list", index === 0 ? "active" : ""].join(" ")}
                                        >
                                            <button>
                                                {item.categoryIcon}
                                                <span>{item.categoryLabel}</span>
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                            ) : (<div>

                                <div className="header-side-nav__label">

                                    <label className="label">Display SideNav Bar</label>
                                    <label className="switch">
                                        <input id="check" type="checkbox"
                                            onChange={checkChange}
                                            checked={checked}
                                        />
                                        <span className="slider round"></span>
                                    </label>

                                </div>
                                <div>

                                    {
                                        checked ?
                                            <HeaderSideNavSubMenu
                                                id={subCategories}
                                                categories={subCategories}
                                                checked={checked}
                                                //checkChange={checkChange}
                                                triggerScroll={triggerScroll}
                                            /> : null
                                    }

                                </div>



                            </div>)

                    }

                </div> : null

                }
                {isVisible && checked ? <div className="header-side-nav__arrow-container"
                    onMouseEnter={() => setIsVisible(true)}
                    onMouseLeave={() => setIsVisible(false)}
                >
                    {
                        currentRouteConfig.path === '/productcomparison' ?
                            <HeaderSideNavButton /> : null
                    }
                </div> : null
                }

            </div >

        ) : null;
};

export default HeaderSideNav;
