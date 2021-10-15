export const trackClick = (element, fields) => {
    if ( window.gtag ) {
        window.gtag('event', fields.action, {
            'event_category': fields.category,
            'event_label': fields.label || element.textContent,
            'value': element instanceof HTMLAnchorElement ? element.href : element.outerHTML,
        });
    }
};