import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Label, Select, Text, Textarea } from '@buffetjs/core';

import Panel from '../Panel';
import InputBlock from '../InputBlock';
import ImagePreview from '../ImagePreview';
import CategorySelect from '../CategorySelect';
import ProductURLInput from '../ProductURLInput';
import RegionSelect from '../RegionSelect';
import TextInput from '../TextInput';
import NumberInput from '../NumberInput';
import ProductAttributesRating from '../ProductAttributesRating';

import './styles.scss';

const _websiteTabOptions = [
  'home',
  'product_comparison',
  'find_tube',
];

const ProductForm = ({ product, setProductFormData, formErrors }) => {

  const [websiteTabOptions] = useState(_websiteTabOptions);

  // Read-only fields
  const [id, setId] = useState(null);
  const [clicksCount, setClicksCount] = useState(null);

  // Product URL Input Data
  const [urlList, setUrlList] = useState([]);

  // Product Attributes Rating additional data
  const [trimmedProductData, setTrimmedProductData] = useState({});

  // Field states
  const [websiteTab, setWebsiteTab] = useState('product_comparison');
  const [region, setRegion] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(null);
  const [image, setImage] = useState('');
  const [position, setPosition] = useState('');
  const [amazonURL, setAmazonURL] = useState('');
  const [price, setPrice] = useState('');
  const [detailsHTML, setDetailsHTML] = useState('');
  const [productURLs, setProductURLs] = useState([]); // Initial data for ProductURLInput
  const [attrsRating, setAttrsRating] = useState([]);
  const [finalRating, setFinalRating] = useState(0); // Don't pass into ProductAttributesRating

  // Meta states
  const [createdOn, setCreatedOn] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [lastModified, setLastModified] = useState('');
  const [lastModifiedBy, setLastModifiedBy] = useState('');

  const collectFormData = useCallback(() => {
    return {
      id,
      websiteTab,
      title,
      category,
      image,
      region,
      urlList,
      position,
      amazonURL,
      price,
      detailsHTML,
      region,
      attrsRating,
      finalRating,
    }
  }, [
    id,
    websiteTab,
    title,
    category,
    image,
    region,
    urlList,
    position,
    amazonURL,
    price,
    detailsHTML,
    region,
    attrsRating,
    finalRating,
  ]);

  const processFormData = useCallback((formData) => {
    formData.price = Number(formData.price);
    formData.categories = [formData.category];
    formData.details_html = formData.detailsHTML;
    formData.amazon_url = formData.amazonURL;
    formData.website_tab = formData.websiteTab;

    // Process urlList
    if (formData.urlList?.length) {
      formData.url_list = formData.urlList.map(({ source, region, is_base, price, url }) => ({
        source, region, is_base, url, price
      }));
    }

    // Process attrs_rating
    if (formData.attrsRating) {
      formData.attrs_rating = formData.attrsRating.map(attrRating => ({
        product_attribute: attrRating.product_attribute.id,
        points: attrRating.points,
        rating: attrRating.rating,
        id: attrRating.id,
        factor: attrRating.factor,
        min: attrRating.min,
        max: attrRating.max,
        use_custom_formula: attrRating.use_custom_formula,
        enabled: attrRating.enabled,
      }));
    }

    // Process final_rating
    if (formData.finalRating) {
      formData.final_rating = formData.finalRating;
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
    delete formData.attrsRating;
    delete formData.finalRating;

    return formData;
  }, []);

  const onChange = useCallback(() => {
    const formData = collectFormData();
    const processedData = processFormData(formData);
    setProductFormData(processedData);
  }, [collectFormData, setProductFormData, processFormData]);

  const onCategorySelect = useCallback((categoryID) => {
    setCategory(categoryID);
  }, [setCategory]);

  const onProductURLsChange = useCallback((newUrlList) => {
    setUrlList(newUrlList);
  }, []);

  const onProductAttrsChange = useCallback((newRatings) => {
    setAttrsRating(newRatings);
  }, []);

  const onFinalRatingChange = useCallback((newFinalRating) => {
    setFinalRating(newFinalRating);
  }, []);

  useEffect(() => {
    if (product) {
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

      // Product attrs
      if (product.attrs_rating?.length) {
        setAttrsRating(product.attrs_rating);
      }

      // Set meta
      if (product.created_at) {
        setCreatedOn(product.created_at);
      }
      if (product.updated_at) {
        setLastModified(product.updated_at);
      }

      // Reset to defaults
    } else {
      setId(null);
      setWebsiteTab('product_comparison');
      setTitle('');
      setImage('');
      setCategory(null);
      setClicksCount(0);
      setPosition('');
      setAmazonURL('');
      setPrice('');
      setDetailsHTML('');
      setRegion(null);
      setProductURLs([]);
      setAttrsRating([]);
      setFinalRating(0);
      // Meta
      setCreatedOn(null);
      setLastModified(null);
    }
  }, [product]);

  useEffect(() => {
    setTrimmedProductData({ price });
  }, [ price ]);

  useEffect(() => {
    onChange();
  }, [
    id,
    websiteTab,
    title,
    category,
    region,
    image,
    urlList,
    position,
    amazonURL,
    price,
    detailsHTML,
    region,
    attrsRating,
    finalRating,
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

        {/* Change Date */}
        <TextInput
          className="col-md-4"
          label='Change Date'
          id='change-date'
          value={lastModified?.slice(0, 10)}
          disabled
        />

        {/* Amazon URL */}
        <TextInput
          className="col-md-12"
          error={formErrors.amazon_url}
          label='Amazon URL'
          id='amazon-url'
          name='amazon-url'
          onChange={(value) => setAmazonURL(value)}
          value={amazonURL}
        />

        {/* Generate Amazon link with tag */}
        {/* <InputBlock className='col-md-2'>
          <Label>&nbsp;</Label>
          <Button
            data-for="amazon-url-tag"
            data-tip={'Generate Link'}
            color='secondary'
            icon={<FontAwesomeIcon icon='link' />}
            onClick={generateAmazonLink}
          />
          <Tooltip id='amazon-url-tag' />
        </InputBlock> */}

        {/* Position */}
        <NumberInput
          className='col-md-4'
          label='Position'
          id='position'
          name='position'
          value={position}
          onChange={(value) => setPosition(value)}
        />

        {/* Clicks Count */}
        <NumberInput
          className='col-md-4'
          label='Clicks Count'
          id='clicks-count'
          name='clicks-count'
          value={clicksCount}
          disabled
        />

        {/* Category */}
        <CategorySelect
          category={category}
          onChange={onCategorySelect}
          hasError={formErrors.categories?.length}
        />
        {formErrors.categories && (
          <Text className="col-sm-12" size="sm" color="red">{formErrors.categories.join('<br />')}</Text>
        )}

      </Panel>

      <Panel title='Scrapable Fields' className="product-form__panel product-form__panel--urls">
        {/* Title */}
        <TextInput
          className="col-md-12"
          label='Title'
          id='product-title'
          onChange={(value) => setTitle(value)}
          error={formErrors.title}
          value={title}
        />

        {/* Image */}
        <TextInput
          className="col-md-9"
          label='Image URL'
          id='product-image'
          onChange={(value) => setImage(value)}
          error={formErrors.image}
          value={image}
        />

        {/* Price */}
        <NumberInput
          className='col-md-3'
          label='Price'
          id='price'
          onChange={(value) => setPrice(value)}
          value={price}
        />

        {/* Details HTML */}
        <InputBlock className="col-md-12">
          <Label>Details HTML</Label>

