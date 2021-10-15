export const styleguide = (config) => ({
    ...config,
    title: [ '00 - Styleguide', config.title ].filter(Boolean).join('/'),
});

export const component = (config) => ({
    ...config,
    title: [ '01 - Components', config.title ].filter(Boolean).join('/'),
});

export const template = (config) => ({
    ...config,
    title: [ '02 - Templates', config.title ].filter(Boolean).join('/'),
});

export const page = (config) => ({
    ...config,
    title: [ '03 - Pages', config.title ].filter(Boolean).join('/'),
});