import { useState, useEffect } from 'react';
import ReactShadowRoot from 'react-shadow-root';
import { toAdminURL } from '@utilities/url';
import { v4 as uuid } from 'uuid';

import { useSourceRegion } from '@contexts/sourceRegionContext';
import PriceChangeGraph from '@components/PriceChangeGraph';
import ProductRating from '@components/ProductRating';

import './product-details.scss';

import inlineStyles from './detail-styles';

const ProductURLLink = ({ url, logo, price, isBase, basePrice, currency }) => {
    const percentDifference = 100 * (price - basePrice ) / basePrice;

    return (
        <div className="product-details__link-item">
            <a href={url} className="product-details__link" target="_blank" rel="noreferrer">
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

const ProductDetails = ({ productData, detailsHTML, title, urlList = [], isLoading }) => {
    const { sources } = useSourceRegion();
    const amazonSource = sources.find(source => /amazon/i.test(source.name));
    const [urlItems, setURLItems] = useState([]);
    // const icon = '/images/loading.png';

    useEffect(() => {
        // Add keys to urlList
        setURLItems(productData.url_list?.map(urlData => ({
            ...urlData,
            key: uuid(),
        })))

    }, [productData]);

    // useEffect(() => {
    //     if (!isLoading) {
    //         isLoading = true;
    //     }
    //     setTimeout(() => {
    //         isLoading = false;
    //     }, 8000);
    // }, [isLoading])

    return (
        <div className="product-details">
            {isLoading && (<h1>Loading...</h1>)}
            {/* {isLoading && <span className="loading"><img src={icon} className="loading-icon" alt="icon" /></span>} */}
            {!isLoading && (
                <div className="product-details__content">
                    <h1 className="product-details__title">{title}</h1>
                    <div className="product-details__body">
                        <ReactShadowRoot>
                            <style>{inlineStyles}</style>
                            <div dangerouslySetInnerHTML={{ __html: productData.details_html }}></div>
                        </ReactShadowRoot>
                    </div>
                    <div className="product-details__additional">
                        <div className="product-details__links">
                            <ProductURLLink
                                key={productData.amazon_url}
                                url={productData.amazon_url}
                                logo={amazonSource?.button_logo?.url}
                                price={productData.price}
                                isBase={true}
                                currency={productData.region?.currency?.symbol}
                            />
                            {urlItems.map(({ key, url, source, price, region, is_base }) => (
                                <ProductURLLink
                                    key={key}
                                    url={url}
                                    logo={source?.button_logo?.url}
                                    price={price}
                                    basePrice={productData.price}
                                    currency={productData.region?.currency?.symbol}
                                />
                            ))}
                        </div>
                        {
                            productData?.product_changes?.length ?
                                <PriceChangeGraph
                                    priceChanges={productData.product_changes.map(({ state, date_time }) => ({
                                        price: state.price,
                                        date_time,
                                    }))}
                                />
                                : null
                        }
                        {
                            productData.final_rating ?
                                <ProductRating
                                    finalRating={productData.final_rating}
                                    attributes={productData.attrs_rating}
                                />
                                : null
                        }
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDetails;