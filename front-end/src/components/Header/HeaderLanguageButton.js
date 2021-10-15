import React, { useState } from 'react';
import ReactFlagsSelect from 'react-flags-select';

import { country } from '@mocks/components/countries';
import { labels } from '@mocks/components/countries';

const HeaderLanguageButton = () => {

    const [selected, setSelected] = useState('US');

    return (
        <div>

            <ReactFlagsSelect
                selected={selected}
                onSelect={flag => setSelected(flag)}
                countries={country}
                placeholder="Select a Language"
                showSelectedLabel={false}
                className="menu-flags"
                selectButtonClassName="menu-flags-button"
                fullWidth={false}
                alignOptionsToRight={true}
                customLabels={labels}
            />
            {/* <button onClick={onClick}>
                <CountryFlag countryCode="us" svg />
                <span><AiFillCaretDown /></span>
            </button>
            <ul className="single-bar">
                {dropdown && language.map((item, index) => {
                    return (
                        <HeaderLanguages item={item} key={index} />
                    )
                })}
            </ul> */}
        </div>

    )
}

export default HeaderLanguageButton;
