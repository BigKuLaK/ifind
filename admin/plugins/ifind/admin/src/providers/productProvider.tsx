import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "../helpers/query";
import { useAdminUser } from "./adminUserProvider";

export interface I_Product {}

export const ProductContext = createContext([]);

export const productDataFragment = `
fragment ProductDataFragment on Product {
  id
  title
  image
  position
  clicks_count
  website_tab
  deal_type
  amazon_url
  price
  details_html
  release_date
  status
  product_issues {
    amazon_link_invalid
    amazon_link_unavailable
    ebay_link_invalid
    aliexpress_link_invalid
    idealo_link_invalid
  }
  url_list {
    source {
      id
      button_logo {
        url
      }
    }
    region { id }
    url
    price
    is_base
  }
  category {
    id
  }
  region {
    id
  }
  attrs_rating {
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
    rating
    points
    enabled
    use_custom_formula
    min
    max
    factor
  }
  final_rating
  created_at
  updated_at
  product_changes {
    state
    date_time
    change_type
    admin_user {
      firstname
      lastname
    }
  }
}
`;

export const productQuery = `
${productDataFragment}
query GetProduct ($id: ID!) {
  product (id: $id) {
    ... ProductDataFragment
  }
}
`;

export const productMutationCommonAguments = `
$user: ID!
$image: String!
$title: String!
$website_tab: String!
$deal_type: ENUM_PRODUCT_DEAL_TYPE
$category: ID!
$position: Int
$amazon_url: String!
$price: Float
$final_rating: Float
$release_date: DateTime
$status: ENUM_PRODUCT_STATUS
`;

export const productMutationCommonInput = `
image: $image
title: $title
website_tab: $website_tab
deal_type: $deal_type
category: $category
amazon_url: $amazon_url
price: $price
url_list: $url_list
position: $position
attrs_rating: $attrs_rating
final_rating: $final_rating
release_date: $release_date
admin_user: $user
status: $status
`;

export const updateProductMutation = `
${productDataFragment}
mutation UpdateProduct (
  $id: ID!
  ${productMutationCommonAguments}
  $url_list: [editComponentAtomsUrlWithTypeInput]
  $attrs_rating: [editComponentAtomsProductAttrRatingInput]
)
{
  updateProduct (
    input: {
      where: {
        id: $id
      }
      data: {
        ${productMutationCommonInput}
      }
    }
  )
  {
    product {
      ... ProductDataFragment
    }
  }
}
`;

export const addProductMutation = `
${productDataFragment}
mutation CreateProduct (
  ${productMutationCommonAguments}
  $url_list: [ComponentAtomsUrlWithTypeInput]
  $attrs_rating: [ComponentAtomsProductAttrRatingInput]
){
  createProduct (input: {
    data: {
      ${productMutationCommonInput}
    }
  }) {
    product {
      ... ProductDataFragment
    }
  }
}
`;

export const ProductProvider = ({ children }) => {
  const { adminUser } = useAdminUser();
  const { productId } = useParams();
  const [getProductQuery, setGetProductQuery] = useState(null);
  const { data: queryData, loading: queryLoading } = useQuery(getProductQuery, {
    id: productId,
  });
  const [
    addOrUpdateProduct,
    {
      // loading,
      error: mutationError,
      data: mutationData,
    },
  ] = useMutation();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const addProduct = useCallback(
    (data) => {
      data.user = adminUser?.id;

      addOrUpdateProduct(addProductMutation, data);
    },
    [adminUser, addProductMutation]
  );

  const updateProduct = useCallback(
    (data) => {
      if (data?.id) {
        data.user = adminUser?.id;
        addOrUpdateProduct(updateProductMutation, data);
      }
    },
    [updateProductMutation, adminUser]
  );

  useEffect(() => {
    if (productId) {
      setGetProductQuery(productQuery);
    } else {
      setProductData(null);
    }
  }, [productId]);

  useEffect(() => {
    if (queryData?.product) {
      setProductData(queryData.product);
    }
  }, [queryData]);

  useEffect(() => {
    if (mutationData?.createProduct?.product) {
      setProductData(mutationData.createProduct.product);
    } else if (mutationData?.updateProduct?.product) {
      setProductData(mutationData.updateProduct.product);
    }
  }, [mutationData]);

  useEffect(() => {
    if (mutationError) {
      console.error(mutationError);
      setError(mutationError);
    }
  }, [mutationError]);

  return (
    <ProductContext.Provider
      value={[productData, addProduct, updateProduct, error, queryLoading]}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
