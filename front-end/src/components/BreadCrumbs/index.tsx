import { useTranslation, navigation } from '@translations/index';

import './breadcrumbs.module.scss';

const BreadCrumbs = () => {
  const translate = useTranslation();
  const { home, contact } = navigation;

  return (
    <div className="breadcrumbs">
        <div className="container_test">
            <div className="row">
                <div className="col-12">
                    <div className="bread-inner">
                        <ul className="bread-list">
                            <li><a href="/">{translate(home)}<i className="fa fa-arrow-right"></i></a></li>
                            <li className="active"><a href="/">{translate(contact)}</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
};

export default BreadCrumbs;
