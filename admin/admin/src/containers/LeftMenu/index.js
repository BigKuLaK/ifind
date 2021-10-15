import React, { memo, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import {
  LeftMenuLinksSection,
  LeftMenuFooter,
  LeftMenuHeader,
  LinksContainer,
} from "../../components/LeftMenu";
import Loader from "./Loader";
import Wrapper from "./Wrapper";
import useMenuSections from "./useMenuSections";

import { leftCollectionMenu, pluginLinks } from "../../../admin.settings";

const LeftMenu = ({ shouldUpdateStrapi, version, plugins, setUpdateMenu }) => {
  const location = useLocation();

  const {
    state: {
      isLoading,
      collectionTypesSectionLinks,
      singleTypesSectionLinks,
      generalSectionLinks,
      pluginsSectionLinks,
    },
    toggleLoading,
    generateMenu,
  } = useMenuSections(plugins, shouldUpdateStrapi);

  const mapped = leftCollectionMenu.map((menuSetting) => {
    const matchedMenu = collectionTypesSectionLinks.find((link) =>
      menuSetting.pattern.test(link.destination)
    );

    if (matchedMenu) {
      return {
        ...matchedMenu,
        ...menuSetting.override,
      };
    }
  });

  const filteredCollectionTypeLinks = mapped.filter(Boolean);
  const filteredSingleTypeLinks = singleTypesSectionLinks.filter(
    ({ isDisplayed }) => isDisplayed
  );

  const customPluginLinksMenu = pluginLinks
    .map((customPluginLink) => {
      const matchedBuiltInLink = pluginsSectionLinks.find(({ destination }) =>
        customPluginLink.pattern?.test(destination)
      );

      if (matchedBuiltInLink) {
        return {
          ...matchedBuiltInLink,
          ...customPluginLink,
        };
      }

      if (customPluginLink?.override?.label) {
        return customPluginLink.override;
      }
    })
    .filter(Boolean);

  // This effect is really temporary until we create the menu api
  // We need this because we need to regenerate the links when the settings are being changed
  // in the content manager configurations list
  useEffect(() => {
    setUpdateMenu(() => {
      toggleLoading();
      generateMenu();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <Loader show={isLoading} />
      <LeftMenuHeader />
      <LinksContainer>
        {filteredCollectionTypeLinks.length > 0 && (
          <LeftMenuLinksSection
            section="collectionType"
            name="collectionType"
            links={filteredCollectionTypeLinks}
            location={location}
            searchable
          />
        )}
        {filteredSingleTypeLinks.length > 0 && (
          <LeftMenuLinksSection
            section="singleType"
            name="singleType"
            links={filteredSingleTypeLinks}
            location={location}
            searchable
          />
        )}

        {customPluginLinksMenu.length > 0 && (
          <LeftMenuLinksSection
            section="plugins"
            name="plugins"
            links={customPluginLinksMenu}
            location={location}
            searchable={false}
            emptyLinksListMessage="app.components.LeftMenuLinkContainer.noPluginsInstalled"
          />
        )}
        {generalSectionLinks.length > 0 && (
          <LeftMenuLinksSection
            section="general"
            name="general"
            links={generalSectionLinks}
            location={location}
            searchable={false}
          />
        )}
      </LinksContainer>
      <LeftMenuFooter key="footer" version={version} />
    </Wrapper>
  );
};

LeftMenu.propTypes = {
  shouldUpdateStrapi: PropTypes.bool.isRequired,
  version: PropTypes.string.isRequired,
  plugins: PropTypes.object.isRequired,
  setUpdateMenu: PropTypes.func.isRequired,
};

export default memo(LeftMenu);
