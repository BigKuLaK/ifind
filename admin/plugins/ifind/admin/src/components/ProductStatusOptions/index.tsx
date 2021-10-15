import React, { useCallback } from "react";
import { Button } from "@buffetjs/core";
import { PropTypes } from "prop-types";
import productModelSettings from "../../../../../../api/product/models/product.settings.json";

import './styles.scss';

const ProductStatusOptions = ({ value, onChange }) => {
  const onSelect = useCallback(
    (status) => {
      if (typeof onChange === "function") {
        onChange(status);
      }
    },
    [onChange]
  );

  return (
    <div className="product-status-options">
      {productModelSettings.attributes.status.enum.map((status) => (
        <Button
          key={status}
          color={value === status ? "primary" : "cancel"}
          className="prodcut-status-options__button"
          onClick={() => onSelect(status)}
          label={status.toUpperCase()}
        />
      ))}
    </div>
  );
};

ProductStatusOptions.propTypes = {
  value: PropTypes.oneOf(productModelSettings.attributes.status.enum),
  onChange: PropTypes.func,
};

ProductStatusOptions.defaultProps = {
  value: productModelSettings.attributes.status.default,
  onChange: () => {},
};

export default ProductStatusOptions;
