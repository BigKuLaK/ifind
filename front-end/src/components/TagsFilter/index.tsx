import { useState, useCallback, useEffect, MouseEventHandler } from "react";
import { useTags } from "@contexts/tagsContext";
import { useGlobalState } from "@contexts/globalStateContext";
import { useLanguages } from "@contexts/languagesContext";
import { useBreakpoints } from "@utilities/breakpoints";

import TagsFiterItem from "./item";
import { allFilter } from "./translations";

import "./styles.module.scss";

const TagsFilter = ({ activeTag = "all", onUpdate }: TagsFilterProps) => {
  const { tags } = useTags();
  const { toggleBodyScroll } = useGlobalState();
  const { userLanguage } = useLanguages();
  const [tagOptions, setTagOptions] = useState<SelectableTag[]>([]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [overlap, setOverlap] = useState<boolean>(false);
  const currentBreakpoint = useBreakpoints();

  const classNames = [
    "tags-filter",
    expanded ? "tags-filter--expanded" : "",
    overlap ? "tags-filter--overlap" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const selected = tagOptions.filter((tag: SelectableTag) => tag.selected);

  const onTagClick = useCallback(
    (tag) => {
      const willActivate = String(activeTag) !== String(tag.id);

      // Do nothing if tag is still active
      if (!willActivate) {
        return;
      }

      const updatedTagOptions = tagOptions.map((tagOption: SelectableTag) => {
        tagOption.selected = tag.id === tagOption.id ? true : false;
        return tagOption;
      });

      setTagOptions(updatedTagOptions);

      // Return only active tag
      if (typeof onUpdate === "function") {
        onUpdate(tag.id === "all" ? null : tag.id);
      }
    },
    [tagOptions, onUpdate, activeTag]
  );

  const checkTagOptions = useCallback(() => {
    if (tags?.length) {
      const mappedTags: SelectableTag[] = tags?.map((tag: Tag) => ({
        ...tag,
        selected: String(activeTag) === String(tag.id),
      }));

      // Add "all" option
      if (mappedTags.length > 1) {
        mappedTags.unshift({
          id: "all",
          selected: activeTag === "all",
          label: Object.entries(allFilter).map(([code, label]) => ({
            id: code,
            label,
            language: { code },
          })),
        });
      }

      setTagOptions(mappedTags);
    } else {
      setTagOptions([]);
    }
  }, [tags, activeTag, allFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const onToggleClick = useCallback<MouseEventHandler>(
    (e) => {
      e.preventDefault();

      if (!expanded) {
        setOverlap(true);
      }

      setExpanded(!expanded);
    },
    [expanded]
  );

  const onCloseClick = useCallback<MouseEventHandler>((e) => {
    e.preventDefault();
    setExpanded(false);
  }, []);

  const onTransitionEnd = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        if (!expanded) {
          setOverlap(false);
        }
      }
    },
    [expanded]
  );

  const extractTagLabel = useCallback(
    (tag: SelectableTag) => {
      if (userLanguage) {
        const matchedLabel = tag.label?.find(
          (label) => label?.language?.code === userLanguage
        );

        if (matchedLabel) {
          return matchedLabel.label;
        }
      }

      const englishLabel = tag.label?.find(
        (label) => label?.language?.code === "en"
      );

      if (englishLabel) {
        return englishLabel.label;
      }

      const firstLabel = tag && tag.label ? tag && tag.label[0] : null;
      return firstLabel?.label || "";
    },
    [userLanguage]
  );

  useEffect(() => {
    if (!/sm|md/i.test(currentBreakpoint)) {
      setExpanded(false);
    }
  }, [currentBreakpoint]);

  useEffect(() => {
    if (toggleBodyScroll) {
      toggleBodyScroll(!expanded);
    }
  }, [expanded, toggleBodyScroll]);

  useEffect(() => {
    checkTagOptions();
  }, [tags, activeTag, checkTagOptions]);

  return (
    <div className={classNames}>
      <div className="tags-filter__heading">
        <div className="tags-filter__selected-list">
          {selected.map((tag) => (
            <span className="tags-filter__selected" key={tag.id}>
              {extractTagLabel(tag)}
            </span>
          ))}
        </div>
        <button className="tags-filter__toggle" onClick={onToggleClick}>
          +
        </button>
      </div>
      <div className="tags-filter__list" onTransitionEnd={onTransitionEnd}>
        {tagOptions.map((tag) => (
          <TagsFiterItem key={tag.id} tag={tag} onClick={onTagClick} />
        ))}
        <button
          className="tags-filter__close"
          onClick={onCloseClick}
          dangerouslySetInnerHTML={{ __html: "&times;" }}
        ></button>
      </div>
    </div>
  );
};

export default TagsFilter;
