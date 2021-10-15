import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom';

import BreadCrumbs from '../';

describe('BreadCrumbs Component', () => {

    it('Renders default data without crashing', () => {
        render(
            <BrowserRouter>
                <BreadCrumbs />
            </BrowserRouter>
        );

        const breadCrumbsElement = document.getElementsByClassName('.breadcrumbs');
        expect(breadCrumbsElement).not.toBe(null);

    });

    it('Renders list elements properly', () => {
        render(
            <BrowserRouter>
                <BreadCrumbs />
            </BrowserRouter>
        );

        const ulElements = document.getElementsByClassName('.bread-list');
        expect(ulElements).not.toBe(null);

    });

});