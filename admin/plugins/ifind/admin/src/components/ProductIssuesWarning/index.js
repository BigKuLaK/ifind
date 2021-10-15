import React from "react";

import './styles.scss';

const ProductIssuesWarning = ({ productIssues, status }) => {
  return productIssues?.length ? (
    <div className="product-issues-warning">
      <h3>This product has issues. Kindly fix:</h3>
      <ul className="product-issues-warning__list">
        {productIssues.map((issue) => {
          switch (issue) {
            case "amazon_link_invalid":
              return (
                <li className="product-issues-warning__item">
                  Amazon link is invalid.
                </li>
              );
            case "amazon_link_unavailable":
              return (
                <li className="product-issues-warning__item">
                  Amazon link points to an unavailable page.
                </li>
              );
            case "ebay_link_invalid":
              return (
                <li className="product-issues-warning__item">
                  Ebay link is invalid.
                </li>
              );
            case "aliexpress_link_invalid":
              return (
                <li className="product-issues-warning__item">
                  AliExpress link is invalid. Either the URL is not an
                  AliExpress Product page, or the product link is{" "}
                  <strong>non-affiliate</strong>.
                </li>
              );
            default:
          }
        })}
      </ul>
      <p>This product will remain in <strong>Draft</strong> status until all issues are resolved.</p>
    </div>
  )
  : status == 'draft' ? (
    <div className="product-issues-warning product-issues-warning--clean">
      <h3>Product looks good.</h3>
      <p>This product has no apparent issues. This is ready for <strong>publish</strong>.</p>
    </div>
  ) : null;
};

export default ProductIssuesWarning;
