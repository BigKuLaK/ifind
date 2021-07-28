import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Header } from '@buffetjs/custom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useProduct, ProductProvider } from '../../providers/productProvider';
import { ProductAttributesProvider } from '../../providers/productAttributesProvider';
import { useGlobal } from '../../providers/globalProvider';
import { validationRules, validateData } from '../../helpers/form';
import ProductForm from '../../components/ProductForm';

const productValidationRules = {
  // title: validationRules.required('Please provide a title'),
  website_tab: [
    validationRules.required('Please select website tab'),
  ],
  amazon_url: validationRules.set([
    validationRules.required(),
    validationRules.url(),
  ], 'Please provide a valid Amazon Product URL'),
  // image: validationRules.set([
  //   validationRules.required('Please provide an image'),
  //   validationRules.url('Image must be a valid URL'),
  // ], 'Please provide an image in a valid URL format'),
  categories: validationRules.required('Please select a category'),
};

const ProductDetail = () => {
  const [
    productData,
    addProduct,
    updateProduct,
    error,
    loading,
  ] = useProduct();
  const { productId } = useParams();
  const { isLoading, setIsLoading } = useGlobal();
  const history = useHistory();
  const [ title, setTitle ] = useState('');
  const [ formErrors, setFormErrors ] = useState({});
  const [ productFormData, setProductFormData ] = useState({});
  const [ redirectOnUpdate, setRedirectOnUpdate ] = useState(false); // Useful in Create Product
  const [ hasChanges, setHasChanges ] = useState(false);
  const [ isSaving, setIsSaving ] = useState(false);

  const saveProduct = useCallback(() => {
    // Prepare data for graphql request
    const { success, errors } = validateData(productFormData, productValidationRules);

    setFormErrors(errors);

    // Don't save if validation fails
    if ( !success ) {
      return;
    }

    // Save product
    else {
      setIsSaving(true);

      if ( !productFormData.id ) {
        setRedirectOnUpdate(true);
        addProduct(productFormData);
      }
      else {
        updateProduct(productFormData);
      }
    }
  }, [ productFormData, updateProduct, addProduct ]);

  const onProductDataUpdate = useCallback((newProductData) => {
    if ( !newProductData ) {
      setTitle('Create New Product');
    }

    else {
      if ( redirectOnUpdate ) {
        setRedirectOnUpdate(false);
        history.push('/plugins/ifind/products/' + newProductData.id);
      }

      setTitle(newProductData?.title || '[ No Title ]');
    }

    if ( isSaving ) {
      strapi.notification.toggle({
        type: 'success',
        message: 'Product Saved.'
      });
      setIsSaving(false);
    }
  }, [ redirectOnUpdate, isSaving ]);

  const determineLoading = useCallback(() => {
    setIsLoading(loading && productId);
  }, [ loading, productId ]);

  const redirectToAddProduct = useCallback(() => {
    history.push('/plugins/ifind/products/create');
  }, []);

  const onProductFormUpdate = useCallback((productFormData) => {
    const rawProductData = productData || {};

    // Check if there are changes
    const hasChanged = Object.entries(productFormData).some(([ formKey, formValue ]) => {
      switch (formKey) {
        case 'category':
          if ( productFormData[formKey] ) {
            return !rawProductData.categories?.length
              || rawProductData.categories.find(({ id }) => id !== productFormData[formKey]);
          }
          else {
            return rawProductData.categories?.length;
          }
        case 'url_list':
          return (
            (rawProductData.url_list?.length !== productFormData.url_list?.length)
            || (
              productFormData.url_list && productFormData.url_list.some((urlData, index) => (
                !rawProductData.url_list || !rawProductData.url_list[index] ||
                Object.entries(urlData).some(([ key, value ]) => (
                  !rawProductData.url_list || !rawProductData.url_list[index]
                  || !rawProductData.url_list[index][key] != urlData[key]
                ))
              ))
            )
            || (
              rawProductData.url_list && rawProductData.url_list.some((urlData, index) => (
                !productFormData.url_list || !productFormData.url_list[index] ||
                Object.entries(urlData).some(([ key, value ]) => (
                  !productFormData.url_list || !productFormData.url_list[index]
                  || !productFormData.url_list[index][key] != urlData[key]
                ))
              ))
            )
          )
        case 'title':
        case 'website_tab':
        case 'price':
        case 'image':
          return productFormData[formKey] !== rawProductData[formKey];
        default:;
      }

      return false;
    });

    setHasChanges(hasChanged);
  }, [ productData ]);

  useEffect(() => {
    onProductDataUpdate(productData);
  }, [ productData ]);

  useEffect(() => {
    if ( error ) {
      strapi.notification.toggle({
        type: 'warning',
        title: 'Error',
        message: error.message,
      });
      setIsSaving(false);
    }
  }, [ error ]);

  useEffect(() => {
    onProductFormUpdate(productFormData);
  }, [ productFormData ]);

  useEffect(() => {
    determineLoading();
  }, [ loading ]);

  return (
    <div className="product-detail">
      <div className="container">
        <div className="row">
          <Header
            title={{ label: title }}
            actions={[
              {
                label: isSaving ? 'Saving' : 'Save',
                onClick: saveProduct,
                color: isSaving ? 'cancel' : 'success',
                type: 'button',
                // disabled: !hasChanges, // Improve logic, some fields are not checked for changes
                icon: (
                  isSaving
                  ? <FontAwesomeIcon icon="spinner" pulse />
                  : <FontAwesomeIcon icon="save" />
                )
              },
              {
                label: 'Add Product',
                onClick: redirectToAddProduct,
                color: 'primary',
                type: 'button',
                disabled: !productData?.id,
                icon: <FontAwesomeIcon icon="plus" />
              },
            ]}
          />
        </div>
        <ProductForm
          product={productData}
          setProductFormData={setProductFormData}
          formErrors={formErrors}
        />
      </div>
    </div>
  )
};

export default memo(() => (
  <ProductAttributesProvider>
    <ProductProvider>
      <ProductDetail />
    </ProductProvider>
  </ProductAttributesProvider>
));