const Item = ({ active, image, title, price, withBadge, onClick }) => {
    const itemClassnames = [
        'natural-list__item',
        active && 'natural-list__item--active ',
    ].filter(Boolean);

    return (
        <li className={itemClassnames.join(' ')} onClick={onClick}>
            <figure className="natural-list__figure">
                {/* <div className="natural-list__price"> */}
                <div className="price-per-product">
                    <span>{price} €</span>
                </div>
                {withBadge && (
                    <span className="natural-list__badge">Best Seller</span>
                )}

                <img className="img natural-list__image" src={image} alt="" />

                {/* <img className="img natural-list__image" src={image} alt={`${title}`} />
                <figcaption className="natural-list__title">{title}</figcaption> */}

            </figure>
        </li>
    );
};

export default Item;