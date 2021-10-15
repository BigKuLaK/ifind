/**
 * NOTE: WIP
 */

import React, { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useGQLFetch } from '../helpers/gqlFetch';
import { generatePluginLink } from '../helpers/url';

const categoryFragment = `
fragment categoryFragment on Category {
  id
  parent {
    id
  }
  language {
    code
  }
  icon
  order
  label_preview
  region {
    id
  }
  source {
    id
  }
  label {
    label
    language {
      id
      code
    }
  }
  product_attrs {
    factor
    label_preview
    product_attribute {
      id
      name
    }
  }
  ascendants {
    id
  }
}
`

export const categoryQuery = `
${categoryFragment}
query Category ($id: ID!) {
  category (id: $id) {
    ... categoryFragment
  }
}
`;

export const addCategoryMutation = `
${categoryFragment}
mutation AddCategory ($data: CategoryInput) {
  createCategory (input: {
    data: $data
  }) {
    category {
      ... categoryFragment
    }
  }
}
`;

export const updateCategoryMutation = `
${categoryFragment}
mutation UpdateCategory ($data: editCategoryInput, $id: ID!) {
  updateCategory (input: {
    where: { id: $id }
    data: $data
  }) {
    category {
      ... categoryFragment
    }
  }
}
`

export const deleteCategoryMutation = `
${categoryFragment}
mutation DeleteCategory ($id: ID!) {
  deleteCategory (input: {
    where: { id: $id }
  }) {
    category {
      ... categoryFragment
    }
  }
}
`

export const CategoryContext = createContext({});

export const CategoryProvider = ({ children }) => {
  const gqlFetch = useGQLFetch();
  const history = useHistory();
  const { categoryId } = useParams();
  const [ category, setCategory ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(null);

  const addCategory = useCallback((data) => {
    setLoading(true);

    gqlFetch(addCategoryMutation, { data })
    .then(({ createCategory }) => {
      if ( createCategory?.category ) {
        history.push(generatePluginLink(`categories/${createCategory.category.id}`));
      }
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  const updateCategory = useCallback((id, data) => {
    setLoading(true);

    gqlFetch(updateCategoryMutation, { id, data })
    .then(({ updateCategory }) => {
      if ( updateCategory?.category ) {
        setCategory(updateCategory.category)
      }
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, [ category ]);

  const deleteCategory = useCallback((id) => {
    setLoading(true);

    gqlFetch(deleteCategoryMutation, { id })
    .then(() => setCategory(null))
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  const loadCategory = useCallback((id) => {
    setLoading(true);

    gqlFetch(categoryQuery, { id })
    .then(({ category }) => {
      setCategory(category);
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if ( categoryId ) {
      loadCategory(categoryId);
    } else {
      setCategory(null);
    }
  }, [ categoryId ]);

  return (
    <CategoryContext.Provider value={{
      category,
      loading,
      addCategory,
      updateCategory,
      deleteCategory,
    }}>
      {children}
    </CategoryContext.Provider>
  )
}

export const useCategory = () => {
  return useContext(CategoryContext);
};