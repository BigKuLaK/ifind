export const slideWidth = 16;

export const _items = [
    {
        category: {
            id: 9,
            label: 'Electronics',
        },
    },
    {
        category: {
            id: 35,
            label: 'Entertainment',
        },
    },
    {
        category: {
            id: 47,
            label: 'Furniture',
        },
    },
    {
        category: {
            id: 12,
            label: 'Grocery',
        },
    },
    {
        category: {
            id: 17,
            label: 'Health',
        },
    },
    {
        category: {
            id: 15,
            label: 'Hobby',
        },
    },
    {
        category: {
            id: 72,
            label: 'Kids',
        },
    },
    {
        category: {
            id: 6,
            label: 'Mode',
        },
    },
    {
        category: {
            od: 19,
            label: 'Tools',
        },
    },
    {
        category: {
            id: 36,
            label: 'EverythingElse',
        },
    },
];

export const length = _items.length;

_items.push(..._items);

export const sleep = (ms = 0) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const createItem = (position, idx) => {
    const item = {
        styles: {
            transform: `translateX(${position * slideWidth}rem)`,
        },
        category: _items[idx].category,
    };

    switch (position) {
        case length - 1:
        case length + 1:
            item.styles = { ...item.styles, filter: 'grayscale(1)' };
            break;
        case length:
            break;
        default:
            item.styles = { ...item.styles, opacity: 0 };
            break;
    }

    return item;
};

export const keys = Array.from(Array(_items.length).keys());