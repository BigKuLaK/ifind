import { useState, useEffect } from 'react';
import GeneralTemplate from '@templates/GeneralTemplate';
import { withComponentName } from '@utilities/component';
import { useHomepageData } from '@contexts/homepageContext';

// import HeroSlider from '@components/HeroSlider';
import NaturalList from '@components/NaturalList';

const Home = () => {
    const homepageData = useHomepageData();
    const [ isLoading, setIsLoading ] = useState(true);
    
    const [ items, setItems ] = useState([]);

    useEffect(() => {
        if ( homepageData ) {
            const { bestSellers } = homepageData;
            setItems(bestSellers);
            setIsLoading(false);
        }
    }, [ homepageData ])

    return (
        <GeneralTemplate>
            <div className="home">
                <div className="container" style={{paddingLeft: '280px'}}>
                    <NaturalList
                        loading={isLoading}
                        items={items}
                    />
                </div>
            </div>
        </GeneralTemplate>
    )
};

export default withComponentName('HomePage')(Home);