// import { render, screen } from '@testing-library/react'
// import { BrowserRouter } from 'react-router-dom';
// import Footer from '../';
// import FooterContent from '../FooterContent';
// describe('Footer Component', () => {
//     it('Renders default data without crashing', () => {
//         render(
//             <BrowserRouter>
//                 <Footer />
//             </BrowserRouter>
//         );
//         const footerElement = document.getElementsByClassName('.footer');
//         expect(footerElement).not.toBe(null);
//     });
//     it('Properly renders logo', () => {
//         const mockLogo = '/';
//         const footerContent = {
//             logo: mockLogo
//         };
//         render(
//             <BrowserRouter>
//                 <FooterContent {...footerContent} />
//             </BrowserRouter>
//         );
//         const logoElement = screen.getByAltText(mockLogo);
//         expect(logoElement).not.toBe(null);
//     });
//     it('Properly renders footer contents', () => {
//         const mockText = 'Testen von Scheindaten';
//         const mockCall = 'Call our support 24/7';
//         const mockPhone = '+0175 123 0891';
//         const mockCopyright = 'Copyright © 2021 ';
//         const mockCopyright2 = 'All rights reserved';
//         const mockLink = 'www.devIfindilu.com';
//         const mockAffiliate = 'Testen von Mock Data Affiliate';
//         const footerContent = {
//             text: mockText,
//             call: mockCall,
//             phone: mockPhone,
//             copyright: mockCopyright,
//             copyright2: mockCopyright2,
//             link: mockLink,
//             affiliate: mockAffiliate
//         };
//         render(
//             <BrowserRouter>
//                 <FooterContent {...footerContent} />
//             </BrowserRouter>
//         );
//         const textElement = screen.getByText(mockText);
//         const callElement = screen.getByText(mockCall);
//         const phoneElement = screen.getByText(mockPhone);
//         const copyrightElement = screen.queryAllByText(mockCopyright);
//         const copyright2Element = screen.queryAllByText(mockCopyright2);
//         const linkElement = screen.getByText(mockLink);
//         const affiliateElement = screen.getByText(mockAffiliate);
//         expect(textElement).not.toBe(null);
//         expect(callElement).not.toBe(null);
//         expect(phoneElement).not.toBe(null);
//         expect(copyrightElement).not.toBe(null);
//         expect(copyright2Element).not.toBe(null);
//         expect(linkElement).not.toBe(null);
//         expect(affiliateElement).not.toBe(null);
//     });
// });
"use strict";