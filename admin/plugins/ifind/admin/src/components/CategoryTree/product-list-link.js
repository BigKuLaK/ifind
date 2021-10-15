import React from "react";
import { Link } from "react-router-dom";
import { generatePluginLink } from "../../helpers/url";

const ProductListLink = ({ count = 0, category }) => (
  <Link
    className="category-tree__products-link"
    to={generatePluginLink("products", { category })}
  >
    {count} Product(s)
  </Link>
);

export default ProductListLink;
