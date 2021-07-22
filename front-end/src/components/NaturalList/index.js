import { useContext, useState, useCallback, useEffect, useRef } from 'react';
import { find } from 'lodash';
import { useLocation } from 'react-router-dom';
import routes from '@config/routes';
import ProductDetails from '@components/ProductDetails';
import { GlobalStateContext } from '@contexts/globalStateContext';
import Item from './item';

import './natural-list.scss';

const NaturalList = ({ items = [], loading = false, category, observeItem, id, label }) => {

    const icon = '/images/loading.png';
    const [activeProduct, setActiveProduct] = useState(null);
    const [detailsHTML, setDetailsHTML] = useState(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);
    const { pathname } = useLocation();
    const currentRouteConfig = find(routes, ({ path }) => pathname === path);
    const { focusedCategory } = useContext(GlobalStateContext);
    const itemRef = useRef();

    const onProductClick = useCallback((product) => {
        setActiveProduct(product);
    }, [setActiveProduct]);

    useEffect(() => {
        if (activeProduct) {
            if (activeProduct.details_html) {
                setDetailsHTML(activeProduct.details_html);
            }
            setIsDetailsLoading(false);
        }
    }, [activeProduct]);

    useEffect(() => {
        if (observeItem && itemRef) {
            const unObserve = observeItem(itemRef.current);
            return unObserve;
        }
    }, [observeItem, itemRef]);

    useEffect(() => {
        if (focusedCategory === id && itemRef.current) {
            const currentScroll = window.pageYOffset;
            const { top } = itemRef.current.getBoundingClientRect();
            const targetScroll = currentScroll + (top - 63);

            window.scrollTo(0, targetScroll);
        }
    }, [focusedCategory, id]);

    return (
        <div className="natural-list">
            {currentRouteConfig.path === '/' ? null :
                <>
                    <div className="natural-list__separator" ref={itemRef} data-category={id}>
                        {label.toUpperCase()}
                        <div className="natural-list__mfd">Q1/2021</div>
                    </div>
                </>
            }
            {currentRouteConfig.path === '/findtube' ? null : (
                <>
                    {loading && <span className="loading"><img src={icon} className="loading-icon" alt="icon" /></span>}
                    <div className="natural-list__content" >
                        {!loading && (
                            <ul className="natural-list__grid">
                                <li className="natural-list__item">
                                    {
                                        activeProduct &&
                                        <ProductDetails
                                            productData={activeProduct}
                                            detailsHTML={detailsHTML}
                                            urlList={activeProduct?.url_list}
                                            title={activeProduct.title}
                                            isLoading={isDetailsLoading}
                                        />
                                    }

                                </li>
                                {items.map((item, index) => (
                                    <Item
                                        {...item}
                                        active={activeProduct && activeProduct.id === item.id}
                                        withBadge={index === 0}
                                        onClick={() => onProductClick(item)}
                                        key={item.id}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )
            }
        </div>
    )
};

export default NaturalList;