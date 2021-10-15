import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { Label, Select, Text, Textarea } from "@buffetjs/core";

import Panel from "../Panel";
import InputBlock from "../InputBlock";
import ImagePreview from "../ImagePreview";
import CategorySelect from "../CategorySelect";
import ProductURLInput from "../ProductURLInput";
import RegionSelect from "../RegionSelect";
import DealTypeSelect from "../DealTypeSelect";
import TextInput from "../TextInput";
import NumberInput from "../NumberInput";
import ProductAttributesRating from "../ProductAttributesRating";
import ProductChangeHistoryTable from "../ProductChangeHistoryTable";
import ProductIssuesWarning from "../ProductIssuesWarning";

import "./styles.scss";

const _websiteTabOptions = ["home", "product_comparison", "find_tube"];

const ProductForm = ({ product, setProductFormData, formErrors }) => {
  const [websiteTabOptions] = useState(_websiteTabOptions);

  // Read-only fields
  const [id, setId] = useState(null);
  const [clicksCount, setClicksCount] = useState(null);

  // Product URL Input Data
  const [urlList, setUrlList] = useState([]);

  // Product Attributes Rating additional data
  const [trimmedProductData, setTrimmedProductData] = useState({});

  // Product Issues Data
  const [productIssues, setProductIssues] = useState([]);

  // Field states
  const [websiteTab, setWebsiteTab] = useState("product_comparison");
  const [dealType, setDealType] = useState("");
  const [region, setRegion] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(null);
  const [image, setImage] = useState("");
  const [position, setPosition] = useState("");
  const [amazonURL, setAmazonURL] = useState("");
  const [price, setPrice] = useState("");
  const [detailsHTML, setDetailsHTML] = useState("");
  const [productURLs, setProductURLs] = useState([]); // Initial data for ProductURLInput
  const [attrsRating, setAttrsRating] = useState([]);
  const [finalRating, setFinalRating] = useState(0); // Don't pass into ProductAttributesRating

  // Meta states
  const [lastModified, setLastModified] = useState("");

  const collectFormData = useCallback(() => {
    return {
      id,
      websiteTab,
      dealType,
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
    };
  }, [
    id,
    websiteTab,
    dealType,
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
    formData.category = formData.category;
    formData.details_html = formData.detailsHTML;
    formData.amazon_url = formData.amazonURL;
    formData.website_tab = formData.websiteTab;
    formData.deal_type = formData.dealType;

    // Process urlList
    formData.url_list = formData.urlList.length
      ? formData.urlList.map(({ source, region, is_base, price, url }) => ({
          source,
          region,
          is_base,
          url,
          price,
        }))
      : [];

    // Process attrs_rating
    formData.attrs_rating = formData.attrsRating.length
      ? formData.attrsRating.map((attrRating) => ({
          product_attribute: attrRating.product_attribute.id,
          points: attrRating.points,
          rating: attrRating.rating,
          id: attrRating.id,
          factor: attrRating.factor,
          min: attrRating.min,
          max: attrRating.max,
          use_custom_formula: attrRating.use_custom_formula,
          enabled: attrRating.enabled,
        }))
      : [];

    // Process final_rating
    formData.final_rating = formData.finalRating
      ? Number(formData.finalRating)
      : 0;

    // Format Position
    formData.position = Number(formData.position);

    // Delete unnecessary props for graphql request
    delete formData.urlType;
    delete formData.amazonURL;
    delete formData.detailsHTML;
    delete formData.websiteTab;
    delete formData.urlList;
    delete formData.attrsRating;
    delete formData.finalRating;
    delete formData.dealType;

    return formData;
  }, []);

  const onChange = useCallback(() => {
    const formData = collectFormData();
    const processedData = processFormData(formData);
    setProductFormData(processedData);
  }, [collectFormData, setProductFormData, processFormData]);

  const onCategorySelect = useCallback(
    (categoryID) => {
      setCategory(categoryID);
    },
    [setCategory]
  );

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
      setDealType(product.deal_type);
      setTitle(product.title);
      setImage(product.image);
      setCategory(product.category?.id);
      setClicksCount(product.clicks_count);
      setPosition(product.position);
      setAmazonURL(product.amazon_url);
      setPrice(product.price);
      setDetailsHTML(product.details_html);
      setRegion(product.region?.id);

      // Format product url list to match ProductURLInput
      setProductURLs(
        (product.url_list || []).map((urlData) => ({
          source: urlData?.source?.id,
          region: urlData?.region?.id,
          url: urlData?.url,
          is_base: urlData?.is_base,
          price: urlData?.price,
        }))
      );

      // Product attrs
      if (product.attrs_rating?.length) {
        setAttrsRating(product.attrs_rating);
      }

      // Set meta
      if (product.updated_at) {
        setLastModified(product.updated_at);
      }

      // List down product issues
      setProductIssues(
        Object.entries(product.product_issues || {})
          .filter((entry) => entry[1])
          .map((entry) => entry[0])
      );
    } else {
      // Reset to defaults
      setId(null);
      setWebsiteTab("product_comparison");
      setDealType('');
      setTitle("");
      setImage("");
      setCategory(null);
      setClicksCount(0);
      setPosition("");
      setAmazonURL("");
      setPrice("");
      setDetailsHTML("");
      setRegion(null);
      setProductURLs([]);
      setAttrsRating([]);
      setFinalRating(0);
      setProductIssues([]);
      // Meta
      setLastModified(null);
    }
  }, [product]);

  useEffect(() => {
    setTrimmedProductData({ price });
  }, [price]);

  useEffect(() => {
    onChange();
  }, [
    id,
    websiteTab,
    dealType,
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

  useEffect(() => {
    console.log({ dealType });
  }, [ dealType ]);

  return (
    <form className="product-form row">
      <div className="product-form__issues">
        <ProductIssuesWarning
          productIssues={productIssues}
          status={product?.status}
        />
      </div>

      <Panel
        title="Primary Fields"
        className="product-form__panel product-form__panel--general"
      >
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
        {websiteTab === "home" ? (
          <DealTypeSelect
            className="col-md-4"
            label="Deal Type"
            onChange={(deal) => setDealType(deal)}
            disabled={false}
            value={dealType}
            error={formErrors.dealType}
          />
        ) : null}

        {/* Change Date */}
        <TextInput
          className="col-md-4"
          label="Change Date"
          id="change-date"
          value={lastModified?.slice(0, 10)}
          disabled
        />

        {/* Amazon URL */}
        <TextInput
          className="col-md-12"
          error={formErrors.amazon_url}
          label="Amazon URL"
          id="amazon-url"
          name="amazon-url"
          onChange={(value) => setAmazonURL(value)}
          value={amazonURL}
          icon="external-link-alt"
          iconLink={amazonURL}
        />

        {/* Position */}
        <NumberInput
          className="col-md-4"
          label="Position"
          id="position"
          name="position"
          value={position}
          onChange={(value) => setPosition(value)}
        />

        {/* Clicks Count */}
        <NumberInput
          className="col-md-4"
          label="Clicks Count"
          id="clicks-count"
          name="clicks-count"
          value={clicksCount}
          disabled
        />

        {/* Region */}
        <RegionSelect
          className="col-md-4"
          label="Region"
          onChange={(regionID) => setRegion(regionID)}
          disabled={true}
          value={region}
          error={formErrors.region}
        />

        {/* Category */}
        <CategorySelect
          category={category}
          onChange={onCategorySelect}
          hasError={formErrors.category?.length}
        />
        {formErrors.category && (
          <Text className="col-sm-12" size="sm" color="red">
            {formErrors.category.join("<br />")}
          </Text>
        )}
      </Panel>

      <Panel
        title="Scrapable Fields"
        className="product-form__panel product-form__panel--urls"
      >
        {/* Title */}
        <TextInput
          className="col-md-12"
          label="Title"
          id="product-title"
          onChange={(value) => setTitle(value)}
          error={formErrors.title}
          value={title}
        />

        {/* Image */}
        <TextInput
          className="col-md-9"
          label="Image URL"
          id="product-image"
          onChange={(value) => setImage(value)}
          error={formErrors.image}
          value={image}
        />

        {/* Price */}
        <NumberInput
          className="col-md-3"
          label="Price"
          id="price"
          onChange={(value) => setPrice(value)}
          value={price}
        />

        {/* Details HTML */}
        <InputBlock className="col-md-12">
          <Label>Details HTML</Label>
          <div className="product-form__details-html">
            <div
              className="product-form__details-html-content"
              dangerouslySetInnerHTML={{ __html: detailsHTML }}
            ></div>
          </div>
        </InputBlock>
      </Panel>

      <Panel
        title="Other Site URLs"
        className="product-form__panel product-form__panel--urls"
      >
        {/* URL List */}
        <ProductURLInput
          className="col-md-12"
          urls={productURLs}
          error={formErrors.url_list}
          onChange={onProductURLsChange}
        />
      </Panel>

      <Panel
        title="General Product Attributes"
        className="product-form__panel product-form__panel--gen-prod-attrs"
      >
        <ProductAttributesRating
          category={category}
          productData={trimmedProductData}
          attributesRatings={attrsRating}
          onAttributesChange={onProductAttrsChange}
          onFinalRatingChange={onFinalRatingChange}
          className="col-md-12"
        />
      </Panel>

      <Panel
        className="product-form__panel product-form__panel--sidebar"
        title="Image Preview"
      >
        {/* Image Preview */}
        <InputBlock className="col-md-12">
          <ImagePreview url={image} />
        </InputBlock>
      </Panel>

      <Panel
        title="Revision History"
        className="product-form__panel product-form__panel--history"
      >
        <ProductChangeHistoryTable className="col-md-12" />
      </Panel>
    </form>
  );
};

export default memo(ProductForm);
