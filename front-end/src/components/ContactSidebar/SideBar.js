const SideBar = ({ phone, supportPhone, supportEmail }) => (
    <div className="col-lg-4 col-12">
        <div className="single-head">
            <div className="single-info">
                <i className="fa fa-phone"></i>
                <h4 className="title">Call us Now:</h4>
                <ul>
                    <li>
                        {phone}
                    </li>
                    <li>
                        {supportPhone}
                    </li>
                </ul>
            </div>
            <div className="single-info">
                <i className="fa fa-envelope-open"></i>
                <h4 className="title">Email:</h4>
                <ul>
                    <li>
                        {supportEmail}
                    </li>
                </ul>
            </div>
            <div className="single-info">
                <i className="fa fa-location-arrow"></i>
                <h4 className="title">Our Address:</h4>
                <ul>
                    <li>Address</li>
                </ul>
            </div>
        </div>
    </div>
);

export default SideBar;




