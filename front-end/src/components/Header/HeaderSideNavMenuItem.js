import React, { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { GlobalStateContext } from '@contexts/globalStateContext';
import IfindIcon from '@components/IfindIcon';
import HeaderSideNavSubMenu from './HeaderSideNavSubMenu';
import { getGrandchildrenCategories } from '../../utilities/category';

const HeaderSideNavMenuItem = ({ category, checked }) => {

    const [subCategories, setSubCategories] = useState(false);
    const showSubCategories = () => setSubCategories(!subCategories);
    const { activeCategory, onCategoryClick } = useContext(GlobalStateContext);
    const grandChildren = getGrandchildrenCategories(category?.children || []);
    const len = grandChildren.length;
    const categoryRef = useRef();

    const onItemClick = useCallback((id) => {
        onCategoryClick(id);
        //console.log(id);
    }, [onCategoryClick]);

    const onActiveCategory = useCallback((activeCategory) => {
        if (grandChildren.find((category) => category.id === activeCategory.toString())) {
            setSubCategories(true);
        }
        else {
            setSubCategories(false);
        }
    }, [grandChildren]);

    useEffect(() => {
        onActiveCategory(activeCategory);
        //console.log(activeCategory, grandChildren);
    }, [activeCategory]) // eslint-disable-line react-hooks/exhaustive-deps

    const categoryClick = () => {
        if (!category.children) {
            onItemClick(category.id);
        }
        showSubCategories();
    }

    return (
        <div ref={categoryRef} key={category.id} className={["list", activeCategory.toString() === category.id ? "active" : ""].join(" ")}>
            <button onClick={categoryClick}>
                <IfindIcon icon={category.icon} className="header-side-nav__icon" />
                {category.label.label}
                {len === 0 ? "" : <span className="num-of-elements">{len}</span>}
            </button>
            {
                checked ?
                    (subCategories && category.children &&
                        <div className="listing" key={category.id}>
                            <HeaderSideNavSubMenu categories={category.children} key={category.id} checked={checked} />
                        </div>) : null
            }
        </div >
    )
}

export default HeaderSideNavMenuItem;
