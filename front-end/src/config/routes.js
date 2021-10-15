const routes = [

    /**
     * Routes visible in Header Navigation
     */
    {
        path: '/',
        componentName: 'HomePage',
        label: 'Home',
        withSideNav: true,
        exact: true,
        noUserHeart: true, // TODO: Verify Implementation
    },
    {
        path: '/productcomparison',
        componentName: 'ProductComparisonPage',
        label: 'Product Comparison',
        withSideNav: true,
        exact: true,
    },
    // {
    //     path: '/findtube',
    //     componentName: 'FindTubePage',
    //     label: 'Findtube',
    // },
    // {
    //     path: '/blog',
    //     componentName: 'BlogPage',
    //     label: 'Blog',
    // },
    {
        path: '/contact',
        componentName: 'ContactPage',
        label: 'Contact',
    },

    /**
     * Routes visible in the Footer
     * Temporary Static Pages
     */
    // {
    //     path: '/about-us',
    //     componentName: 'AboutUsPage',
    //     label: 'About Us',
    // },
    // {
    //     path: '/agb',
    //     componentName: 'AGBPage',
    //     label: 'AGB',
    // },
    // {
    //     path: '/impressum',
    //     componentName: 'ImpressumPage',
    //     label: 'Impressum',
    // },
    // {
    //     path: '/data-protection',
    //     componentName: 'DataProtectionPage',
    //     label: 'Data Protection',
    // },
];

/**
 * Dynamic Routes
 */
export const dynamicRoutes = [
    {
        path: '/:slug',
        componentName: 'BasicPage',
    },
];


export const navigationRoutes = ['/', '/productcomparison', '/contact'];
export const footerRoutes = [
    // '/about-us',
    // '/agb',
    // '/impressum',
    // '/data-protection'
];

export default routes;
