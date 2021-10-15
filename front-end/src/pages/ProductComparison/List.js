import React, { useContext, useEffect, useRef } from 'react';
import { GlobalStateContext } from '@contexts/globalStateContext';

const List = ({ index, observeItem }) => {
    const { focusedIndex } = useContext(GlobalStateContext);
    const itemRef = useRef();

    useEffect(() => {
        const unObserve = observeItem(itemRef.current);
        return unObserve;
    }, [observeItem]);

    useEffect(() => {
        if (focusedIndex === index && itemRef.current) {
            const currentScroll = window.pageYOffset;
            const { top } = itemRef.current.getBoundingClientRect();
            const targetScroll = currentScroll + top;

            window.scrollTo(0, targetScroll);
        }
    }, [focusedIndex, index]);


    return (
        <div ref={itemRef} data-index={index} className="prodcomp-area-list">
            List {index}
        </div>
    );
};

export default List;