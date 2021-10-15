import React, { useState, useEffect, useCallback, FormEvent } from "react";
import { Select, Label } from "@buffetjs/core";
import InputBlock from "../InputBlock";

import "./styles.scss";

export type T_DealTypes = [
  'amazon_flash_offers',
  'ebay_wow_offers',
  'aliexpress_value_deals',
];
export interface I_DealTypeOption {
  value: T_DealTypes;
  label: string;
}

export type T_DealTypeSelectProps = {
  value: string;
  onChange: (dealType: string) => any;
  error?: string;
  label: string;
  id?: string | number;
  disabled?: boolean;
  className?: string;
};

const DealTypeSelect = ({
  value = "",
  onChange,
  id,
  disabled,
  className,
  error,
  label,
}: T_DealTypeSelectProps): JSX.Element => {
  const [inputValue, setInputValue] = useState<string>(value);
  const options: I_DealTypeOption[] = [
    { value: "amazon_flash_offers", label: "Amazon Flash Offers" },
    { value: "ebay_wow_offers", label: "Ebay Wow Offers" },
    {
      value: "aliexpress_value_deals",
      label: "AliExpress Super Value Deals",
    },
  ];

  const onSelect = useCallback(
    (label: string) => {
      if (typeof onChange === "function") {
        const matchedOption = options.find(
          ({ label: optionLabel }) => optionLabel === label
        );

        if (typeof onChange === "function") {
          onChange(matchedOption?.value || "");
        }
      }
    },
    [onChange, options]
  );

  useEffect(() => {
    const matchedOption = options.find(
      ({ value: optionValue }) => optionValue === value
    );
    setInputValue(matchedOption?.label || "");
  }, [value, options]);

  return (
    <InputBlock
      className={["deal-type-select"].concat(className).join(" ")}
      error={error}
    >
      {label ? <Label htmlFor={id}>{label}</Label> : ""}
      <Select
        onChange={({
          target: { value },
        }: React.ChangeEvent<HTMLSelectElement>) => {
          onSelect(value);
        }}
        options={options.map((option) => option.label)}
        value={inputValue}
        disabled={disabled}
        className={"deal-type-select__select"}
      />
    </InputBlock>
  );
};

export default DealTypeSelect;
