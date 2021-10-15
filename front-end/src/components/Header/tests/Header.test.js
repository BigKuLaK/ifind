import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom';

import Header from '../';
import HeaderTop from '../HeaderTop';
import HeaderMiddle from '../HeaderMiddle';

describe('Header Component', () => {

    it('Renders default data without crashing', () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        const headerElement = document.querySelector('.header');

        expect(headerElement).not.toBe(null);
    });

    it('Properly renders contact info', () => {
        const mockPhone = '123456';
        const mockEmail = 'test@email.com';
        const contactInfo = {
            phone_number: mockPhone,
            email: mockEmail
        };

        render(
            <BrowserRouter>
                <HeaderTop {...contactInfo} />
            </BrowserRouter>
        );

        const phoneElement = screen.getByText(mockPhone);
        const emailElement = screen.getByText(mockEmail);

        expect(phoneElement).not.toBe(null);
        expect(emailElement).not.toBe(null);
    });

});


describe('Header Search', () => {

    it('Accepts user input and submits form properly', () => {
        const searchTerm = 'Test Input';
        const mockSubmitHandler = jest.fn();

        render(
            <BrowserRouter>
                <HeaderMiddle onSubmit={mockSubmitHandler} />
            </BrowserRouter>
        );

        const headerForm = document.querySelector('form');
        const headerFormInput = headerForm.querySelector('input');

        headerFormInput.value = searchTerm;
        headerForm.submit();

        expect(headerForm).not.toBe(null);
        expect(mockSubmitHandler).toBeCalledWith({ search: searchTerm });
    });

});