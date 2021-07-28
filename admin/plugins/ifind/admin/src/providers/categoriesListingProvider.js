/**
 * TO DO:
 * 
 * data is not updating when refreshed. Needs further investigation.
 */

 import React, { createContext, useContext, useState, useEffect, useCallback, memo } from 'react';
 import { useQuery, useMutation } from '../helpers/query';

 const CategoriesListingContext = createContext({});
 
 const categoryFieldsOverviewFragment = `
 fragment CategoryFieldsOverview on Category {
   label: label_preview
   id
   order
   icon
 }`;
 
 const categoryFieldsDetailsFragment = `
 fragment CategoryFieldsDetails on Category {
   url
   parent {
     id
     label: label_preview
   }
   language {
     id
     code
     name
   }
   products {
     id
     title
   }
   source {
     id
     name
   }
   region {
     id
     code
   }
   product_attrs {
    id
    product_attribute {
      id
      name
      custom_formula
      data_type
      disable_min
      disable_max
      max_label
      min_label
      product_prop
    }
    factor
  }
 }`;
 
 const categoryFieldsCompleteFragment = `
 fragment CategoryFieldsComplete on Category {
   ... CategoryFieldsOverview
   ... CategoryFieldsDetails
 }`;
 
 const updatedCategoryFieldsFragment = `
 fragment UpdatedCategoryFields on updateCategoryPayload {
   category {
     ... CategoryFieldsComplete
   }
 }`;
 
 
 const categoriesQuery = `
 ${categoryFieldsOverviewFragment}
 ${categoryFieldsDetailsFragment}
 ${categoryFieldsCompleteFragment}
 query GetCategories {
   categories {
     ... CategoryFieldsComplete
   }
 }
 `;
 
 const categoriesMutation = (categories) => (
   `
   ${categoryFieldsOverviewFragment}
   ${categoryFieldsDetailsFragment}
   ${categoryFieldsCompleteFragment}
   ${updatedCategoryFieldsFragment}
   mutation {
     ${
       categories
       .map(({ id, ...data }, index) => `
         updateCategory${index}: updateCategory (input: {
           where: { id: ${id} },
           data: {
             ${
               Object.entries(data)
               .map(([key, value]) => `${key}: ${ typeof value === 'string' ? `"${value}"` : value }`)
               .join(',\n')
             }
           }
         }) {
           ... UpdatedCategoryFields
         }
       `)
       .join('\n')
     }
   }
   `
 );
 
 export const flattenCategoriesTree = (tree, currentDepth = 0) => {
   const list = Object.values(tree)
   // Sort items first
   .sort((catA, catB) => catA.order > catB.order ? 1 : -1)
   // Process each item
   .reduce((list, currentNode) => {
     currentNode.depth = currentDepth;
 
     list.push(currentNode);
 
     // Flat-append this item's children
     if ( currentNode.children ) {
       list.push(...flattenCategoriesTree(currentNode.children, currentDepth + 1));
       // Remove this item's children prop to avoid confusion
       delete currentNode.children;
     }
     
     return list;
   }, []);
   
   return list;
 };
 
 /**
  * Creates an object tree of categories
  * @param {array} rawCategories 
  * @returns object
  */
 export const mapCategoriesTree = (rawCategories) => {
   const categoryTree = {};
   const byId = rawCategories.reduce(( all, category) => ({
     ...all,
     [category.id]: category,
   }), {});
 
   if ( rawCategories ) {
     rawCategories.forEach(category => {
       // Check if category has existing parent
       if ( category.parent && category.parent.id in byId ) {
         // Append to the parent's children
         byId[category.parent.id].children = byId[category.parent.id].children || {};
         byId[category.parent.id].children[category.id] = category;
 
         // Determine depth acc. to parent
         let currentDepthCount = 1;
         let currentParent = byId[category.parent.id];
         while ( currentParent?.parent ) {
           currentDepthCount++;
           currentParent = byId[currentParent.parent.id];
         }
         category.depth = currentDepthCount;
       }
       // Treat this category as a root
       else {
         categoryTree[category.id] = category;
         category.depth = 0;
         // Remove non-existing parent prop to avoid confusion
         delete category.parent;
       }
     });
   }
 
   return categoryTree;
 };
 
 // NOTE: Will deprecate once source region is implemented
 export const groupCategoriesByLanguage = (categoriesList, languages) => {
   return languages.map(language => ({
     language,
     categories: categoriesList.filter(category => category.language?.id === language.id),
   }));
 };
 
 export const groupCategoriesBySourceRegion = (categoriesList, sourcesRegions) => {
   return sourcesRegions.map(sourceRegion => ({
     ...sourceRegion,
     categories: categoriesList.filter(category => (
       category.source?.id === sourceRegion.source && category.region?.id === sourceRegion.region
     )),
   }))
 }
 
 /**
  * Given a category id,
  * this will generate the ancestral path towards the category,
  * with the given category id being the last item in the array
  * Like so: [ grandParent, parent, child, grandChild, ...soOn ]
  */
 export const buildCategoryPath = (categoryID, categories = []) => {
   const byId = categories.reduce(( all, category) => ({
     ...all,
     [category.id]: category,
   }), {});
 
   const categoryPath = [];
   const matchedCategory = byId[categoryID];
 
   if ( !matchedCategory ) {
     return categoryPath;
   }
 
   let lastCategoryEntry = matchedCategory;
   while ( lastCategoryEntry ) {
     categoryPath.push(lastCategoryEntry);
     lastCategoryEntry = lastCategoryEntry.parent ? byId[lastCategoryEntry.parent.id] : null;
   }
 
   // From granparent -> grandchild
   categoryPath.reverse();
 
   return categoryPath;
 }


 export const CategoriesListingProvider = memo(({ children }) => {
  const { data } = useQuery(categoriesQuery);
  const [
    callMutation,
    {
      data: updatedCategoriesData,
      error: updateCategoriesError
    }
  ] = useMutation();
  const [ categories, setCategories ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(false);

  const updateCategories = useCallback((updatedCategories) => {
    callMutation(categoriesMutation(updatedCategories));
  }, [ callMutation ]);

  const updateCategoriesList = useCallback((updatedCategoriesList) => {
    // Map updated categories by id
    const newCategoriesMap = Object.values(updatedCategoriesList)
                            .reduce((all, { category }) => {
                              all[category.id] = category;
                              return all;
                            }, {});

    // Replace matching categories with updated ones
    const updatedCategories = categories.map(category => {
      if ( category.id in newCategoriesMap ) {
      return newCategoriesMap[category.id];
      }
      return category;
    });

    // Save updated categories
    replaceCategories(updatedCategories);
  }, [ categories ]);

  const replaceCategories = useCallback((newCategories) => {
    // Process and update categories
    const categoryTree = mapCategoriesTree(newCategories);
    const categoryList = flattenCategoriesTree(categoryTree);

    setLoading(false);
    setCategories(categoryList);
  });

  useEffect(() => {
    if ( data ) {
      replaceCategories(data.categories);
    }
  }, [ data ]);

  useEffect(() => {
    if ( updatedCategoriesData ) {
      updateCategoriesList(updatedCategoriesData);
    }
  }, [ updatedCategoriesData ]);

  useEffect(() => {
    if ( updateCategoriesError ) {
      setError(updateCategoriesError);
    }
  }, [ updateCategoriesError ]);

  return (
    <CategoriesListingContext.Provider value={{
      categories,
      updateCategories,
      error,
      loading,
    }}>
      {children}
    </CategoriesListingContext.Provider>
  )
});

 export const useCategoriesListing = () => useContext(CategoriesListingContext);