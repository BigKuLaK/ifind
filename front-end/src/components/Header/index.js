import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { find } from 'lodash';

import HeaderTop from './HeaderTop';
import HeaderMiddle from './HeaderMiddle';
import HeaderNav from './HeaderNav';

import { useGlobalData } from '@contexts/globalDataContext';
import routes from '@config/routes';

import './header.scss';

const Header = () => {
    const { pathname } = useLocation();
    const { contactInfo } = useGlobalData();
    const [isSticky, setIsSticky] = useState(false);
    // const [classNames, setClassNames] = useState('header');
    const [classNames] = useState('header');

    const currentRouteConfig = find(routes, ({ path }) => pathname === path);
    const withSideNav = currentRouteConfig && currentRouteConfig.withSideNav;

    /**
     * Handles intersection
     * isInterSected is false when header is in sticky state
     */
    const handleHeaderIntersection = useCallback(isInterSected => {
        setIsSticky(!isInterSected);
    }, []);

    // Apply necessary classnames for sticky state
    useEffect(() => {
        //const updatedClassNames = ['header'];

        // if (isSticky) {
        //     updatedClassNames.push('header--sticked');
        // }

        // setClassNames(updatedClassNames.join(' '));
        console.log(isSticky);
    }, [isSticky]);

    return (
        <header className={classNames}>
            <HeaderTop {...contactInfo} />
            <HeaderMiddle onInterSect={handleHeaderIntersection} />
            <HeaderNav withSideNav={withSideNav} />
        </header>
    )
}

export default Header;