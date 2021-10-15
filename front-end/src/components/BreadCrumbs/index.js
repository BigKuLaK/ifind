import './breadcrumbs.scss';

const BreadCrumbs = () => (
    <div className="breadcrumbs">
        <div className="container_test">
            <div className="row">
                <div className="col-12">
                    <div className="bread-inner">
                        <ul className="bread-list">
                            <li><a href="/">Home<i className="ti-arrow-right"></i></a></li>
                            <li className="active"><a href="/">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default BreadCrumbs;