import React, { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { GlobalStateContext } from '@contexts/globalStateContext';
import IfindIcon from '@components/IfindIcon';
import HeaderSideNavSubMenu from './HeaderSideNavSubMenu';
import { getGrandchildrenCategories } from '../../utilities/category';

const HeaderSideNavMenuItem = ({ category }) => {

    const [subCategories, setSubCategories] = useState(false);
    const showSubCategories = () => setSubCategories(!subCategories);
    const { activeCategory, onCategoryClick } = useContext(GlobalStateContext);
    const grandChildren = getGrandchildrenCategories(category?.children || []);
    const len = grandChildren.length;
    const str = category.label.label;
    const withSpace = str.indexOf(" ");
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
        //console.log(category);
    }, [activeCategory]) // eslint-disable-line react-hooks/exhaustive-deps

    const categoryClick = () => {
        if (!category.children) {
            onItemClick(category.id);
        }
        showSubCategories();
    }

    return (
        <div ref={categoryRef} key={category.id} className={["list", activeCategory.toString() === category.id ? "active" : ""].join(" ")}>
            {category.parent === null ? "" : <button onClick={categoryClick}>
                <IfindIcon icon={category.icon} className="header-side-nav__icon" />
                <span className={["category-label", withSpace > 0 ? "change-width" : ""].join(" ")}>{category.label.label}</span>
                {len === 0 ? "" : <div className="num-of-elements">{len}</div>}
            </button>}
            {
                // checked ?
                subCategories && category.children &&
                <div className="listing" key={category.id}>
                    {/* <HeaderSideNavSubMenu categories={category.children} key={category.id} checked={checked} /> */}
                    <HeaderSideNavSubMenu categories={category.children} key={category.id} />
                </div>
            }
        </div >
    )
}

export default HeaderSideNavMenuItem;
