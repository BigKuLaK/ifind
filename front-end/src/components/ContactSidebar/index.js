import SideBar from './SideBar';

import { useGlobalData } from '@contexts/globalDataContext';

const ContactSidebar = () => {
    const { contactInfo } = useGlobalData();
    return (
        <>
            <SideBar {...contactInfo} />
        </>
    )
};

export default ContactSidebar;