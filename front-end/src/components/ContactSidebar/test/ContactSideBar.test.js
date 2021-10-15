import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import ContactSidebar from '../';
import SideBar from '../SideBar';

describe('ContactSidebar Component', () => {

    it('Renders default data without crashing', () => {
        render(
            <BrowserRouter>
                <ContactSidebar />
            </BrowserRouter>
        );

        const contactSidebarElement = document.getElementsByClassName('.contact-us');
        expect(contactSidebarElement).not.toBe(null);

    });

    it('Properly renders contact info', () => {
        const mockPhone = '0987654321';
        const mockSupportPhone = '12345678';
        const mockSupportEmail = 'test@email.com';
        const contactInfo = {
            phone: mockPhone,
            supportPhone: mockSupportPhone,
            supportEmail: mockSupportEmail
        };

        render(
            <BrowserRouter>
                <SideBar {...contactInfo} />
            </BrowserRouter>
        );

        const phoneElement = screen.getByText(mockPhone);
        const phoneSupportElement = screen.getByText(mockSupportPhone);
        const emailSupportElement = screen.getByText(mockSupportEmail);

        expect(phoneElement).not.toBe(null);
        expect(phoneSupportElement).not.toBe(null);
        expect(emailSupportElement).not.toBe(null);
    });
});