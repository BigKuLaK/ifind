import React, { useState, useEffect, useCallback } from "react";
import { Select } from "@buffetjs/core";

import './styles.scss';

export type T_WebsiteTabValue = "home" | "product_comparison" | "findtube";

export interface I_WebsiteTabSelectProps {
  className?: string;
  onChange?: (tab: T_WebsiteTabValue) => any;
  label?: string;
  value?: string;
}

const WebsiteTabSelect = ({
  className,
  value,
  onChange,
  label,
}: I_WebsiteTabSelectProps): JSX.Element => {
  const id = Date.now() + "";

  const onSelect = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
      if (typeof onChange === "function") {
        onChange(value as T_WebsiteTabValue);
      }
    },
    [onChange]
  );

  return (
    <div className={["website-tab-select", className].join(" ")}>
      {label ? (
        <label className="website-tab-select__label" htmlFor={id}>
          {label}
        </label>
      ) : (
        ""
      )}
      <Select
        className="website-tab-select__select"
        id={id}
        value={value}
        onChange={onSelect}
        options={["home", "product_comparison", "findtube"]}
      />
    </div>
  );
};

export default WebsiteTabSelect;
