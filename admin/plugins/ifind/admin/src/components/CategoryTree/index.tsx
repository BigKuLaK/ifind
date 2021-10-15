import { CategoryInput } from "@custom-types/admin.graphql.d";

import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import Sortly from "react-sortly";
import { Header } from "@buffetjs/custom";

import { useCategoriesListing } from "../../providers/categoriesListingProvider";
import { useGlobal } from "../../providers/globalProvider";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addCategoryText, addCategoryDetailURL } from "./add-category-button";
import ItemRenderer from "./item-renderer";

import "./styles.scss";

export interface SortableItem {
  softParent?: number;
  softOrder?: number;
  softChildrenCount?: number;
  depth ?: number
}

export interface CategoryTreeItem extends Category, SortableItem {
  id: string
  ascendants?: number[]
  parent?: CategoryTreeItem
}

const CategoryTree = (onChange) => {
  const history = useHistory();
  const { setIsLoading } = useGlobal();
  const [isSaving, setIsSaving] = useState(false);

  // Original category data
  const {
    categories,
    updateCategories,
    error,
    loading: categoriesLoading,
  } = useCategoriesListing();

  // Local data
  const [itemsInView, setItemsInView] = useState<CategoryTreeItem[]>([]);
  const [changedItems, setChangedItems] = useState<CategoryTreeItem[]>([]);

  const filterChangedItems = useCallback((updatedItems: CategoryTreeItem[]) => {
    // Filter only changed items
    const _changedItems = updatedItems.filter(
      ({
        softParent,
        softOrder,
        parent,
        order,
        children_count,
        softChildrenCount,
      }) =>
        (parent?.id || 0) !== softParent ||
        order !== softOrder ||
        children_count !== softChildrenCount
    );
    return _changedItems;
  }, []);

  const handleChange = useCallback((newItems) => {
    const updatedItems = processCategories(newItems, true);
    const _changedItems = filterChangedItems(updatedItems);

    // Set changed items
    setChangedItems(_changedItems);

    // Apply updated items
    setItemsInView(updatedItems);
  }, []);

  const saveChanges = useCallback(() => {
    if (!changedItems.length) {
      return;
    }

    setIsSaving(true);

    // Format data to be passed into GraphQL
    const itemsToChange: CategoryTreeItem[] = changedItems.map(
      ({
        id,
        parent,
        softParent,
        order,
        softOrder,
        children_count,
        softChildrenCount,
      }: CategoryTreeItem) => ({
        id,
        parent: softParent,
        order: softOrder,
        children_count: softChildrenCount,
      }) as CategoryTreeItem
    );

    console.log({ itemsToChange });

    // Set ascendants IDs
    const itemsToUpdate = itemsToChange.map((newItemData: CategoryTreeItem) => {
      if ("parent" in newItemData) {
        const ascendants = [];
        let currentNode =
          itemsToChange.find((item) => item.id == newItemData.parent) ||
          categories.find(
            (category: Category) => category.id == newItemData.parent
          );

        while (currentNode) {
          ascendants.unshift(currentNode.id);

          if (currentNode.parent) {
            currentNode =
              itemsToChange.find((item) => item.id == currentNode.parent) ||
              categories.find(
                (category: Category) => category.id == currentNode.parent
              );
            continue;
          }

          break;
        }

        newItemData.ascendants = ascendants;
      }

      return newItemData;
    });

    updateCategories(itemsToUpdate);
  }, [changedItems, updateCategories, categories]);

  const processCategories = useCallback(
    (categoriesList, retainIndex = false) => {
      // Add softParent and softOrder used for temporary changes in UI
      const processedCategories = categoriesList.map(
        (category: CategoryTreeItem, index: number) => ({
          ...category,
          softParent: category.softParent || category.parent?.id || null,
          softOrder: retainIndex
            ? index
            : category.softOrder
            ? category.softOrder
            : category.order,
          softChildrenCount:
            category.softChildrenCount || category.children_count || 0,
        })
      );

      // Update softChildrenCount
      processedCategories.forEach((category: CategoryTreeItem) => {
        const matchedChildren = processedCategories.filter(
          ({ softParent }: CategoryTreeItem) => softParent === category.id
        );
        category.softChildrenCount = matchedChildren.length;
      });

      // Sort categories
      const sortedCategories = processedCategories.sort(
        (categoryA: CategoryTreeItem, categoryB: CategoryTreeItem) =>
          (categoryA?.softOrder || 0) > (categoryB?.softOrder || 0) ? 1 : -1
      );

      const updatedSoftParents = updateSoftParents(sortedCategories);
      return updatedSoftParents;
    },
    []
  );

  /**
   * Recursive function to update soft parents
   * of a flat list of categories
   * based on each item's depth
   */
  const updateSoftParents = useCallback((items: CategoryTreeItem[]) => {
    const updatedSoftParents: CategoryTreeItem[] = [];
    let currentParentPath: { id: string, depth?: number }[] = [
      // { id, depth } - parent id and depth, add as the level goes deeper
    ];

    items.forEach((item, index) => {
      const [previousItem] = updatedSoftParents.slice(-1);

      // Update softOrder, as this can still be null
      item.softOrder = index;

      // First item in the list
      if (!previousItem) {
        item.softParent = undefined;
        updatedSoftParents.push(item);
        return;
      }

      // One level deeper
      if ((item.depth || 0) > (previousItem.depth || 0)) {
        // Add previous item as a parent
        currentParentPath.push({
          id: previousItem.id,
          depth: previousItem.depth,
        });
      }
      // One level back
      else if ((item.depth || 0) < (previousItem.depth || 0)) {
        // Pop till we get to the direct parent
        while (
          currentParentPath.length &&
          (currentParentPath.slice(-1)[0].depth || 0) >= (item.depth || 0)
        ) {
          currentParentPath.pop();
        }
      }

      item.softParent = (currentParentPath.slice(-1)[0] || {}).id as string || undefined;
      updatedSoftParents.push(item);
    });

    return updatedSoftParents;
  }, []);

  /**
   * Initial effect,
   * Processes raw categories data
   * Into UI-consumable data
   */
  useEffect(() => {
    if (categories?.length) {
      setItemsInView(categories);

      window.strapi.notification.toggle({
        type: "success",
        message: "Categories Loaded!",
      });

      setIsSaving(false);
    }
  }, [categories]);

  useEffect(() => {
    if (error) {
      strapi.notification.toggle({
        type: "warning",
        title: "Unable to update categories",
        message: error.message,
      });
      setIsSaving(false);
      console.error(error);
    }
  }, [error]);

  useEffect(() => {
    setIsLoading(categoriesLoading);
  }, [categoriesLoading]);

  useEffect(() => {
    if (typeof onChange === "function") {
      onChange(changedItems);
    }
  }, [changedItems]);

  return (
    <>
      <div className="row category-tree__header">
        <Header
          title={{ label: "Categories Management" }}
          actions={[
            changedItems.length
              ? {
                  label: isSaving ? "Saving" : "Save",
                  color: isSaving ? "cancel" : "success",
                  icon: (
                    <FontAwesomeIcon
                      icon={isSaving ? "spinner" : "save"}
                      pulse={isSaving}
                    />
                  ),
                  onClick: saveChanges,
                }
              : null,
            {
              label: addCategoryText,
              onClick: () => history.push(addCategoryDetailURL),
              color: "primary",
              type: "button",
              icon: <FontAwesomeIcon icon="plus" />,
            },
          ].filter(Boolean)}
        />
      </div>
      <div className="row">
        <div className="category-tree col-md-6">
          {!categories?.length ? (
            <h3 className="pt-30">
              <FontAwesomeIcon icon="spinner" pulse size="md" />
              &nbsp;Loading...
            </h3>
          ) : (
            <Sortly items={itemsInView} onChange={handleChange}>
              {(props) => <ItemRenderer {...props} />}
            </Sortly>
          )}
        </div>
      </div>
    </>
  );
};

CategoryTree.PropTypes = {
  onChange: PropTypes.func,
};

CategoryTree.defaultProps = {
  onChange: () => {},
};

export default CategoryTree;
