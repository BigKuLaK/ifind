import React, { useEffect, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@buffetjs/core";

import Panel from "../Panel";
import IconSelect from "../IconSelect";
import TranslatedLabelsInput from "../TranslatedLabelsInput";
import CategorySelect from "../CategorySelect";
import TextInput from "../TextInput";
import AttributesFactorInput from "../AttributesFactorInput";

import { useLanguages } from "../../providers/languageProvider";
import { useCategoriesListing } from "../../providers/categoriesListingProvider";
import { useProductAttributes } from "../../providers/productAttributesProvider";

import "./styles.scss";
import FontAwesomeIcon from "../FontAwesomeIcon";

const CategoryForm = ({
  category,
  setCategoryFormData,
  formErrors,
  onDelete,
}) => {
  const languages = useLanguages();
  const { productAttributes } = useProductAttributes();
  const { categories } = useCategoriesListing();

  // Form states
  const [icon, setIcon] = useState(null);
  const [translatedLabels, setTranslatedLabels] = useState([]);
  const [parent, setParent] = useState(null);
  const [labelPreview, setLabelPreview] = useState("");
  const [attributeFactors, setAttributeFactors] = useState([]);

  const onChange = useCallback(
    (newData) => {
      if (typeof setCategoryFormData === "function") {
        // Walk through category parents to build the ascendants
        if (parent) {
          const ascendants = [parent];
          let currentNode = categories.find(
            (category) => category.id == parent
          );

          while (currentNode && currentNode.parent) {
            ascendants.unshift(currentNode.parent.id);
            currentNode = categories.find(
              (category) => category.id == currentNode.parent
            );
          }

          newData.ascendants = ascendants;
        }

        setCategoryFormData(newData);
      }
    },
    [categories]
  );

  const onIconSelect = useCallback((value) => {
    setIcon(value);
  }, []);

  const onLabelsChange = useCallback((newLabels) => {
    setTranslatedLabels(newLabels);
  }, []);

  const onParentSelect = useCallback((parent, categoryPath) => {
    setParent(parent);
  }, []);

  const onFactorsChange = useCallback((attributesFactors) => {
    setAttributeFactors(attributesFactors);
  }, []);

  const setDefaultAttributeFactors = useCallback(() => {
    setAttributeFactors(
      productAttributes.map((product_attribute) => ({
        product_attribute,
        factor: 1,
      }))
    );
  }, [productAttributes]);

  const onFormChange = useCallback(() => {
    // Format attribute factors to match graphql requirements
    const formattedFactors = attributeFactors.map((attrFactor) => {
      const formattedFactor = {
        factor: attrFactor.factor,
        label_preview: attrFactor.label_preview,
        product_attribute: attrFactor.product_attribute.id,
      };

      if (attrFactor.id) {
        formattedFactor.id = attrFactor.id;
      }

      return formattedFactor;
    });

    // Format translated labels to match graphql requirements
    const formattedLabels = translatedLabels.map(({ id, language, label }) => {
      const formatedLabel = { language, label };

      if (id) {
        formatedLabel.id = id;
      }

      return formatedLabel;
    });

    onChange({
      parent,
      icon: icon?.replace(/-/g, "_"),
      label_preview: labelPreview,
      label: formattedLabels,
      product_attrs: formattedFactors,
    });
  }, [
    languages,
    // form data
    icon,
    translatedLabels,
    labelPreview,
    parent,
    attributeFactors,
  ]);

  useEffect(() => {
    onFormChange();
  }, [
    onFormChange,
    // form data
    icon,
    labelPreview,
    parent,
    attributeFactors,
  ]);

  useEffect(() => {
    const englishLabel = languages.find(({ code }) => code === "en");

    // Build label_preview
    const selectedLabel =
      translatedLabels.find((label) =>
        englishLabel ? englishLabel.id === label.language : label.label
      )?.label ||
      translatedLabels.find(({ label }) => label)?.label ||
      "";

    setLabelPreview(selectedLabel);
  }, [translatedLabels]);

  useEffect(() => {
    // Edit Category
    if (category) {
      setIcon(category.icon?.replace(/_/g, "-"));
      setParent(category.parent?.id);
      setLabelPreview(category.label_preview);
      setAttributeFactors(category.product_attrs);
      setTranslatedLabels(
        category.label.map(({ language, ...label }) => ({
          ...label,
          language: language?.id,
        }))
      );
    }
    // Create Category
    else {
      setDefaultAttributeFactors();
      setIcon(null);
      setParent(null);
      setLabelPreview("");
      setTranslatedLabels([]);
    }
  }, [category]);

  return (
    <form className="category-form row">
      <Panel
        title="General"
        className="category-form__panel category-form__panel--general"
      >
        <IconSelect
          id="icon"
          name="icon"
          value={icon}
          className="col-md-6"
          label="Icon"
          onChange={onIconSelect}
        />
        <TextInput
          label="Label Preview"
          className="col-md-6"
          value={labelPreview}
          disabled={true}
        />
        <TranslatedLabelsInput
          className="col-md-12"
          labels={translatedLabels}
          onChange={onLabelsChange}
        />
      </Panel>
      <Panel
        title="Parent Category"
        className="category-form__panel category-form__panel--parent"
      >
        <CategorySelect
          category={parent}
          onChange={onParentSelect}
          exclude={category?.id ? [category?.id] : []}
          allowParent={true}
          // hasError
          // emptyMessage
        />
      </Panel>
      <Panel
        title="Attributes Factoring"
        className="category-form__panel category-form__panel--factoring"
      >
        <AttributesFactorInput
          className="col-md-6"
          onChange={onFactorsChange}
          attributeFactors={attributeFactors}
        />
      </Panel>
      <Panel className="category-form__panel category-form__panel--delete">
        <div className="col-md-12">
          <Button
            color="delete"
            label="Delete this Category"
            icon={<FontAwesomeIcon icon="trash-alt" />}
            onClick={onDelete}
            className="category-form__delete"
          />
        </div>
      </Panel>
    </form>
  );
};

CategoryForm.propTypes = {
  category: PropTypes.object, // categoryData
  setCategoryFormData: PropTypes.func,
};

export default CategoryForm;
