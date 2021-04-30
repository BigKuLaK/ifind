import { Link, useLocation } from 'react-router-dom';
import routes, { navigationRoutes } from '@config/routes';

import HeaderSideNav from './HeaderSideNav';

import './header-nav.scss';

const navigationItems = navigationRoutes.map(path => routes.find(route => route.path === path ));

const HeaderNav = () => {
    const { pathname } = useLocation();

    return (
        <div className="header-nav">
            <div className="header-nav__container">
                <div className="header-nav__row">
                    <HeaderSideNav />
                    <div className="menu-area">
                        <ul className="main-menu">
                            { navigationItems.map(({ path, label }) => (
                                <li key={path}>
                                    <Link to={path} className={ pathname === path ? 'active current' : '' }>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderNav;