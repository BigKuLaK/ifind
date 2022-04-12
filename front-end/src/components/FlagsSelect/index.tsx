import { useCallback, useEffect, useRef, useState } from "react";

import PreloadedImage from "@components/PreloadedImage";
import useBodyClick from "@utilities/useBodyClick";

import "./styles.module.scss";

const FlagSelect = ({
  className,
  selected,
  placeholder = "",
  customLabels,
  onSelect,
}: FlagSelectProps) => {
  const flagSelectRef = useRef<HTMLDivElement>(null);
  const onBodyClick = useBodyClick();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [countryLabels, setCountryLabels] = useState<FlagSelectCountryLabel[]>(
    []
  );

  const classNames = [
    "flag-select",
    className,
    isExpanded ? "flag-select--expanded" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const getCountryFlagImage = useCallback(
    (countryCode) => (
      <PreloadedImage
        className="flag-select__image"
        src={`https://www.worldatlas.com/r/w30/img/flag/${countryCode.toLocaleLowerCase()}-flag.jpg`}
      />
    ),
    []
  );

  const getButtonLabel = useCallback(() => {
    const matchedCountryLabel = selectedCountry
      ? countryLabels.find(
          ({ country }) =>
            country.toLocaleLowerCase() === selectedCountry.toLocaleLowerCase()
        )
      : null;

    if (matchedCountryLabel) {
      return getCountryFlagImage(selectedCountry);
    }

    return placeholder;
  }, [selectedCountry, placeholder, countryLabels, getCountryFlagImage]);

  const onClick = useCallback(
    (e) => {
      setIsExpanded(!isExpanded);
    },
    [isExpanded]
  );

  const onOptionSelect = useCallback(
    (country: string) => {
      setSelectedCountry(country);
      setIsExpanded(false);
      if (typeof onSelect == "function") {
        onSelect(country);
      }
    },
    [onSelect]
  );

  const mapCustomLabels = useCallback(
    (customLabels: { [countryCode: string]: string }) => {
      const entries = Object.entries(customLabels || {});

      if (entries) {
        setCountryLabels(
          entries.map(([country, label]) => ({
            country,
            label,
          }))
        );
      }
    },
    []
  );

  const bodyClickHandler = useCallback<EventListener>(
    (e) => {
      if (flagSelectRef?.current) {
        if (!flagSelectRef.current.contains(e?.target as Node)) {
          setIsExpanded(false);
        }
      }
    },
    [flagSelectRef]
  );

  useEffect(() => {
    if (customLabels) {
      mapCustomLabels(customLabels);
    }
  }, [customLabels, mapCustomLabels]);

  useEffect(() => {
    onBodyClick(bodyClickHandler);
  }, [onBodyClick, bodyClickHandler]);

  useEffect(() => {
    setSelectedCountry(selected || '');
  }, [ selected ]);

  return (
    <div className={classNames} ref={flagSelectRef}>
      <button type="button" className="flag-select__button" onClick={onClick}>
        {getButtonLabel()}
        <span className="flag-select__caret">{isExpanded ? "▲" : "▼"}</span>
      </button>
      <ul className="flag-select__dropdown">
        {countryLabels.map(({ country, label = "" }) => (
          <li key={country} className="flag-select__option">
            <button
              type="button"
              className="flag-select__option-button"
              onClick={() => onOptionSelect(country)}
            >
              {getCountryFlagImage(country)}
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlagSelect;
