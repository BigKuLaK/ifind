import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Header } from '@buffetjs/custom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useProduct, ProductProvider } from '../../providers/productProvider';
import { ProductAttributesProvider } from '../../providers/productAttributesProvider';
import { useGlobal } from '../../providers/globalProvider';
import { validationRules, validateData } from '../../helpers/form';
import { compareProductChanges } from '../../helpers/product';
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
  category: validationRules.required('Please select a category'),
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
  const [ isPublishing, setIsPublishing ] = useState(false);
  // const [ productChanges, setProductChanges ] = useState(null);

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

    if ( isSaving || isPublishing ) {
      strapi.notification.toggle({
        type: 'success',
        message: 'Product Saved.',
        timeout: 10000,
      });
      setIsSaving(false);
      setIsPublishing(false);
    }
  }, [ redirectOnUpdate, isSaving, isPublishing ]);

  const determineLoading = useCallback(() => {
    setIsLoading(loading && productId);
  }, [ loading, productId ]);

  const redirectToAddProduct = useCallback(() => {
    history.push('/plugins/ifind/products/create');
  }, []);

  const onProductFormUpdate = useCallback((productFormData) => {
    const rawProductData = productData || {};
    const changes = compareProductChanges(rawProductData, productFormData);
    setHasChanges(changes ? true : false);
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
        timeout: 10000,
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
                disabled: isSaving || isPublishing,
                icon: (
                  isSaving
                  ? <FontAwesomeIcon icon="spinner" pulse />
                  : <FontAwesomeIcon icon="save" />
                )
              },
              productData?.id ? (
                {
                  label: 'Add Product',
                  onClick: redirectToAddProduct,
                  color: 'primary',
                  type: 'button',
                  disabled: isSaving || isPublishing,
                  icon: <FontAwesomeIcon icon="plus" />
                }
              ) : null,
            ].filter(Boolean)}
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