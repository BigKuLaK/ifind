import { useCallback } from 'react';
import { toAdminURL } from '@utilities/url';
import { trackClick } from '@utilities/tracking';

const ProductURLLink = ({ url, source, logo, price, isBase, basePrice, currency }) => {

    const percentDifference = 100 * (price - basePrice) / basePrice;

    const onClick = useCallback(({ currentTarget }) => {
        trackClick(currentTarget, {
            category: 'Product',
            action: `click` + (source ? `.${source.toLowerCase()}` : ''),
        });
    }, [ source ]);

    return (
        <div className="product-details__link-item">
            <a href={url} className="product-details__link" target="_blank" rel="noreferrer" onClick={onClick}>
                <img src={toAdminURL(logo)} alt="" className="product-details__link-image" />
            </a>
            <span className="product-details__price">{currency}&nbsp;{price}</span>
            {
                !isBase && (
                    <span className={['product-details__diff', percentDifference < 0 ? 'product-details__diff--lower' : 'product-details__diff--higher'].join(' ')}>
                        {percentDifference.toFixed(2)}%
                    </span>
                )
            }
        </div>
    )
}

export default ProductURLLink;