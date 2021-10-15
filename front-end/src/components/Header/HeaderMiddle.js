import { useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import routes from '@config/routes';

import HeaderLanguageButton from './HeaderLanguageButton';
//import { languages } from '@mocks/components/languages';

import './header-middle.scss';

const logo = '/images/logowith1warp.jpg';

const HeaderMiddle = ({ onInterSect, onSubmit }) => {
    const { pathname } = useLocation();

    const headerMiddleRef = useRef(null);
    const observer = useRef(null);

    // const [dropdown, setDropdown] = useState(false);
    // const [lang, setLang] = useState(languages);

    /**
     * Apply intersection observer so we can track whether the header
     * is in sticky state or not
     */
    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new window.IntersectionObserver(([intersection]) => {
            typeof onInterSect == 'function' && onInterSect(intersection.isIntersecting);
        });

        if (headerMiddleRef.current) {
            observer.current.observe(headerMiddleRef.current);
        }

        return () => observer.current.disconnect();

    }, [onInterSect]);

    const submitHandler = useCallback((e) => {
        e.preventDefault();

        const rawFormData = new FormData(e.currentTarget);
        const formData = [...rawFormData.entries()].reduce((all, [key, value]) => ({
            ...all,
            [key]: value
        }), {});

        if (typeof onSubmit === 'function') {
            onSubmit(formData);
        }
    }, [onSubmit]);


    // Get current route from config
    const currentRoute = routes.find(({ path }) => path === pathname);

    return (
        <div className="header-middle" ref={headerMiddleRef}>
            <div className="header-middle__container">
                <div className="header-middle__row">
                    <div className="header-middle__left">
                        <div className="logo"><a href="/"><img
                            src={logo} alt="logo" /></a></div>
                        <div className="search-top">
                            <div className="top-search"><a href="/"><i
                                className="ti-search"></i></a></div>
                            <div className="search-top">
                                <form className="search-form" onSubmit={submitHandler}><input type="text"
                                    placeholder="Search here..." name="search" /><button
                                        value="search" type="submit"><i
                                            className="ti-search"></i></button></form>
                            </div>
                        </div>
                        <div className="mobile-nav">
                            <div className="slicknav_menu"><a href="/" aria-haspopup="true" role="button" tabIndex="0"
                                className="slicknav_btn slicknav_collapsed" style={{ outline: 'none' }}><span
                                    className="slicknav_menutxt"></span><span className="slicknav_icon slicknav_no-text"><span
                                        className="slicknav_icon-bar"></span><span className="slicknav_icon-bar"></span><span
                                            className="slicknav_icon-bar"></span></span></a>
                                <ul className="slicknav_nav slicknav_hidden" style={{ display: 'none' }}
                                    aria-hidden="true" role="menu">
                                    <li><a routerlinkactive="active current"
                                        ng-reflect-router-link-active="active current" ng-reflect-router-link="/"
                                        href="/" className="active current" role="menuitem" tabIndex="-1">Home</a></li>
                                    <li><a routerlinkactive="active"
                                        ng-reflect-router-link-active="active"
                                        ng-reflect-router-link="/productcomparison" href="/productcomparison"
                                        role="menuitem" tabIndex="-1">Product Comparison</a></li>
                                    <li><a routerlinkactive="active"
                                        ng-reflect-router-link-active="active" ng-reflect-router-link="/findtube"
                                        href="/findtube" role="menuitem" tabIndex="-1">Findtube</a></li>
                                    <li><a routerlinkactive="active"
                                        ng-reflect-router-link-active="active" ng-reflect-router-link="/blog"
                                        href="/blog" role="menuitem" tabIndex="-1">Blog</a></li>
                                    <li><a routerlinkactive="active"
                                        ng-reflect-router-link-active="active" ng-reflect-router-link="/contact"
                                        href="/contact" role="menuitem" tabIndex="-1">Contact Us</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="header-middle__search">
                        <div className="search-bar-top">
                            <div className="search-bar">
                                <form><input name="search"
                                    placeholder="Search Products Here....." type="search" /><button
                                        className="btn"><i className="ti-search"></i></button></form>
                            </div>
                        </div>
                    </div>
                    <div className="header-middle__right">

                        <div className="right-bar">
                            <div className="flag-container">
                                <HeaderLanguageButton />
                            </div>
                            {
                                /* Show user-heart only if noUserHeart is false from routes config */
                                !currentRoute?.noUserHeart && (
                                    <div className="single-bar"><a href="/"
                                        className="single-icon"><i aria-hidden="true"
                                            className="fa fa-heart-o"></i>&nbsp;</a></div>
                                )
                            }
                            <div className="single-bar"><a href="/"
                                className="single-icon"><i aria-hidden="true"
                                    className="fa fa-user-circle-o"></i>&nbsp;</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default HeaderMiddle;