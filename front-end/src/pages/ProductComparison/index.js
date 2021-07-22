import GeneralTemplate from '@templates/GeneralTemplate';
import { withComponentName, withProvider } from '@utilities/component';
import { useProductComparison } from '@contexts/productComparisonContext';
import { useContext, useCallback, useRef } from 'react';
import { GlobalStateContext } from '@contexts/globalStateContext';
import NaturalList from '@components/NaturalList';


const ProductComparison = () => {
  const { productComparisonList } = useProductComparison();
  // const [isLoading, setIsLoading] = useState(true);

  const { setActiveCategory } = useContext(GlobalStateContext);
  let options = {
    root: document.querySelector('natural-list__content'),
    rootMargin: '0px',
    threshold: 0.02,
  }

  const onIntersect = useCallback(([intersection]) => {
    const { target, isIntersecting } = intersection;

    if (isIntersecting) {
      const category = target.dataset.category;
      setActiveCategory(category);
      console.log(category);
    }
  }, [setActiveCategory]);

  // const observerRef = useRef(new IntersectionObserver(onIntersect, options));
  const observerRef = useRef(new IntersectionObserver(onIntersect, options));

  const observeItem = useCallback((e) => {
    observerRef.current.observe(e);
    return () => {
      observerRef.current.unobserve(e);
    }
  }, [observerRef]);

  // useEffect(() => {
  //   if (productComparisonList) {
  //     setIsLoading(false);
  //   }
  // }, [productComparisonList])


  return (
    <GeneralTemplate>
      <div className="product-comparison">
        <div className="container" style={{ paddingLeft: '280px' }}>
          <div className="product-comparison__list">
            {
              productComparisonList.map(({ category, products }) => (
                <NaturalList
                  key={category.id}
                  items={products}
                  observeItem={observeItem}
                  id={category.id}
                  label={category.label.label}
                  category={category}
                />
              ))
            }
          </div>
        </div>
      </div>
    </GeneralTemplate>
  )
};

export default withProvider('ProductComparisonContextProvider')(withComponentName('ProductComparisonPage')(ProductComparison));