import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { InputText, InputNumber, Label, Select, Text, Textarea } from '@buffetjs/core';

import Panel from '../Panel';
import InputBlock from '../InputBlock';
import ImagePreview from '../ImagePreview';
import CategorySelect from '../CategorySelect';
import ProductURLInput from '../ProductURLInput';
import RegionSelect from '../RegionSelect';

import './styles.scss';

const _websiteTabOptions = [
  'home',
  'product_comparison',
  'find_tube',
];

const ProductForm = ({ product, setProductFormData, formErrors }) => {
  const [ websiteTabOptions ] = useState(_websiteTabOptions);

  // Read-only fields
  const [ id, setId ] = useState(null);
  const [ clicksCount, setClicksCount ] = useState(null);

  // CategorySelect Data
  const [ source, setSource ] = useState(null);

  // Product URL Input Data
  const [ urlList, setUrlList ] = useState([]);

  // Field states
  const [ websiteTab, setWebsiteTab ] = useState('home');
  const [ region, setRegion ] = useState(null);
  const [ title, setTitle ] = useState('');
  const [ category, setCategory ] = useState(null);
  const [ image, setImage ] = useState('');
  const [ position, setPosition ] = useState('');
  const [ amazonURL, setAmazonURL ] = useState('');
  const [ price, setPrice ] = useState('');
  const [ detailsHTML, setDetailsHTML ] = useState('');
  const [ productURLs, setProductURLs ] = useState([]); // Initial data for ProductURLInput

  // Meta states
  const [ createdOn, setCreatedOn ] = useState('');
  const [ createdBy, setCreatedBy ] = useState('');
  const [ lastModified, setLastModified ] = useState('');
  const [ lastModifiedBy, setLastModifiedBy ] = useState('');

  const collectFormData = useCallback(() => {
    return {
      id,
      websiteTab,
      title,
      category,
      image,
      source,
      region,
      urlList,
      position,
      amazonURL,
      price,
      detailsHTML,
      region,
    }
  }, [
    id,
    websiteTab,
    title,
    category,
    image,
    source,
    region,
    urlList,
    position,
    amazonURL,
    price,
    detailsHTML,
    region,
  ]);

  const processFormData = useCallback((formData) => {
    formData.price = Number(formData.price);
    formData.categories = [ formData.category ];
    formData.details_html = formData.detailsHTML;
    formData.amazon_url = formData.amazonURL;
    formData.website_tab = formData.websiteTab;

    console.log('formData.urlList', formData.urlList);

    // Process urlList
    if ( formData.urlList?.length ) {
      formData.url_list = formData.urlList.map(({ source, region, is_base, price, url }) => ({
        source, region, is_base, url, price
      }));
    }

    // Format Position
    formData.position = Number(formData.position);

    // Delete unnecessary props for graphql request
    delete formData.category;
    delete formData.urlType;
    delete formData.amazonURL;
    delete formData.detailsHTML;
    delete formData.websiteTab;
    delete formData.urlList;

    return formData;
  }, []);

  const onChange = useCallback(() => {
    const formData = collectFormData();
    const processedData = processFormData(formData);
    console.log({ processedData });
    setProductFormData(processedData);
  }, [ collectFormData, setProductFormData, processFormData ]);

  const onCategorySelect = useCallback((categoryID) => {
    setCategory(categoryID);
  }, [ setCategory ]);

   const onProductURLsChange = useCallback((newUrlList) => {
    setUrlList(newUrlList);
   }, []);

  useEffect(() => {
    if ( product ) {
      setId(product.id);
      setWebsiteTab(product.website_tab);
      setTitle(product.title);
      setImage(product.image);
      setCategory(product.categories[0]?.id);
      setClicksCount(product.clicks_count);
      setPosition(product.position);
      setAmazonURL(product.amazon_url);
      setPrice(product.price);
      setDetailsHTML(product.details_html);
      setRegion(product.region?.id);

      // Format product url list to match ProductURLInput
      setProductURLs((product.url_list || []).map(urlData => ({
        source: urlData?.source?.id,
        region: urlData?.region?.id,
        url: urlData?.url,
        is_base: urlData?.is_base,
        price: urlData?.price,
      })));

      // Update source and region based on product
      if ( product.source && product.region ) {
        setSource(product.source?.id);
        setRegion(product.region?.id);
      }

      // Set meta
      if ( product.created_at ) {
        setCreatedOn(product.created_at);
      }
      if ( product.updated_at ) {
        setLastModified(product.updated_at);
      }
    }
  }, [ product ]);

  useEffect(() => {
    onChange();
  }, [
    id,
    websiteTab,
    title,
    category,
    source,
    region,
    image,
    urlList,
    position,
    amazonURL,
    price,
    detailsHTML,
    region,
  ]);

  return (
    <form className="product-form row">
      <Panel title='Primary Fields' className="product-form__panel product-form__panel--general">

        {/* Website Tab */}
        <InputBlock className="col-md-4" error={formErrors.website_tab}>
          <Label htmlFor="website-tab">Website Tab</Label>
          <Select
            name="website-tab"
            id="website-tab"
            onChange={({ target: { value } }) => {
              setWebsiteTab(value);
            }}
            options={websiteTabOptions}
            value={websiteTab}
          />
        </InputBlock>

        {/* Region */}
        <RegionSelect
          className='col-md-4'
          label='Region'
          onChange={(regionID) => setRegion(regionID)}
          disabled={true}
          value={region}
          error={formErrors.region}
        />

        <InputBlock className="col-md-4" >
          <Label htmlFor="change-date">Change Date</Label>
          <InputText
            name="change-date"
            id="change-date"
            value={lastModified.slice(0, 10)}
            disabled
          />
        </InputBlock>

        {/* Amazon URL */}
        <InputBlock className="col-md-12" error={formErrors.amazon_url}>
          <Label htmlFor="amazon-url">Amazon URL</Label>
          <InputText
            onChange={({ target: { value }}) => setAmazonURL(value)}
            id="amazon-url"
            value={amazonURL}
          />
        </InputBlock>

        {/* Position */}
        <InputBlock className="col-md-6">
          <Label htmlFor="website-tab">Position</Label>
          <InputText
              id='position'
              name='position'
              type="number"
              value={position}
              onChange={({ target: { value } }) => setPosition(value)}
            />
        </InputBlock>

        {/* Clicks Count */}
        <InputBlock className="col-md-6">
          <Label htmlFor="clicks-count">Clicks Count</Label>
          <InputText
              id='clicks-count'
              name='clicks-count'
              type="number"
              value={clicksCount}
              disabled
            />
        </InputBlock>

        {/* Category */}
        <CategorySelect
          source={source}
          region={region}
          category={category}
          onChange={onCategorySelect}
          hasError={formErrors.categories?.length}
        />
        { formErrors.categories && (
          <Text className="col-sm-12" size="sm" color="red">{formErrors.categories.join('<br />')}</Text>
        )}

      </Panel>

      <Panel title='Scrapable Fields' className="product-form__panel product-form__panel--urls">
        {/* Title */}
        <InputBlock className="col-md-12" error={formErrors.title}>
          <Label htmlFor="product-title">Title</Label>
          <InputText
              id='product-title'
              name='product-title'
              onChange={({ target: { value } }) => setTitle(value)}
              type="text"
              value={title}
            />
        </InputBlock>

        {/* Image */}
        <InputBlock className="col-md-9" error={formErrors.image}>
          <Label htmlFor="image">Image URL</Label>
          <InputText
            id='image'
            name='image'
            onChange={({ target: { value } }) => setImage(value)}
            type="text"
            value={image}
          />
        </InputBlock>

        {/* Price */}
        <InputBlock className="col-md-3">
          <Label>Price</Label>
          <InputNumber
            onChange={({ target: { value }}) => setPrice(value)}
            value={price}
          />
        </InputBlock>

        {/* Details HTML */}
        <InputBlock className="col-md-12">
          <Label>Details HTML</Label>
          <Textarea
            name="details-html"
            id="details-html"
            onChange={({ target: { value }}) => setDetailsHTML(value)}
            value={detailsHTML}
            disabled
          />
        </InputBlock>
      </Panel>

      <Panel title='Other Site URLs' className="product-form__panel product-form__panel--urls">
        {/* URL List */}
        <ProductURLInput
          className="col-md-12"
          urls={productURLs}
          error={formErrors.url_list}
          onChange={onProductURLsChange}
        />
      </Panel>

      <Panel className="product-form__panel product-form__panel--sidebar">
        {/* Image Preview */}
        <InputBlock className="col-md-12">
          <Label>Image Preview</Label>
          <ImagePreview url={image} />
        </InputBlock>
      </Panel>

      <Panel title='Other Information' className="product-form__panel product-form__panel--meta">
        <div className="col-md-12">
          {
            lastModified ?
            <Text size="sm" color="gray">Last Modified on <strong>{lastModified}</strong></Text>
            : null
          }
          {
            createdOn ?
            <Text size="sm" color="gray">Created on <strong>{createdOn}</strong></Text>
            : null
          }
        </div>
      </Panel>

    </form>
  )
};


export default memo(ProductForm);