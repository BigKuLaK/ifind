import { Link } from 'react-router-dom';
import TiIcon from '@components/TiIcon';

import './header-top.scss';

const HeaderTop = ({ phone_number: phone, email }) => {
    return (
        <div className="header-top">
            <div className="header-top__container">
                <div className="header-top__content">
                    <div className="header-top__left">
                        <ul className="list-main">
                            {
                                phone && (
                                    <li>
                                        <TiIcon icon='headphone-alt' />
                                        <Link to={`tel:${phone}`}>{phone}</Link>
                                    </li>
                                )
                            }
                            {
                                email && (
                                    <li>
                                        <TiIcon icon='email' />
                                        <Link to={`mailto:${email}`}>{email}</Link>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                    <div className="header-top__right">
                        <ul className="list-main">
                            <li>
                                <TiIcon icon='alarm-clock' />
                                <a
                                    href="/">Daily deal</a></li>
                            <li>
                                <TiIcon icon='user' />
                                <a
                                    href="/">My account</a></li>
                            <li>
                                <TiIcon icon='power-off' />
                                <a
                                    href="/login">Login</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderTop;