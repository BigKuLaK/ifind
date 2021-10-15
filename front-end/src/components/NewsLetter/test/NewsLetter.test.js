import { render, screen, fireEvent, queryByDisplayValue } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom';

import Newsletter from '../';

describe('NewsLetter Component', () => {

    it('Renders default data without crashing', () => {
        render(
            <BrowserRouter>
                <Newsletter />
            </BrowserRouter>
        );

        const newsLetterElement = document.getElementsByClassName('.show-newsletter');
        expect(newsLetterElement).not.toBe(null);

    });

    it('Renders h4 and paragraph element properly', () => {
        render(
            <BrowserRouter>
                <Newsletter />
            </BrowserRouter>
        );

        const h4Element = document.getElementsByClassName('title');
        const pElement = document.getElementsByClassName('ptext');

        expect(h4Element).not.toBe(null);
        expect(pElement).not.toBe(null);
    });

    it('Renders form input and button properly', () => {
        render(
            <BrowserRouter>
                <Newsletter />
            </BrowserRouter>
        );

        const buttonElement = document.getElementsByClassName('btn');
        const inputElement = document.getElementsByName('EMAIL');

        expect(buttonElement).not.toBe(null);
        expect(inputElement).not.toBe(null);
    });

});