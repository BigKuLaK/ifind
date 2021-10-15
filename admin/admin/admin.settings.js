import { generatePluginLink } from "@plugins/ifind/admin/src/helpers/url";

export const leftCollectionMenu = [
  {
    pattern: /product\.product/,
    override: {
      icon: "shopping-bag",
      destination: generatePluginLink("/products"),
    },
  },
  {
    pattern: /category/,
    override: {
      icon: "sitemap",
      destination: generatePluginLink("/categories"),
    },
  },
  {
    pattern: /attribute/,
    override: {
      icon: "star",
    },
  },
  {
    pattern: /source/,
    override: {
      icon: "external-link-alt",
    },
  },
  {
    pattern: /region/,
    override: {
      icon: "globe-americas",
    },
  },
  {
    pattern: /currency/,
    override: {
      icon: "dollar-sign",
    },
  },
  {
    pattern: /language/,
    override: {
      icon: "language",
    },
  },
  {
    pattern: /page/,
    override: {
      icon: "book",
    },
  },
  {
    pattern: /user/,
    override: {
      icon: "users",
    },
  },
];

export const pluginLinks = [
  {
    override: {
      destination: generatePluginLink("scheduled-tasks"),
      icon: "calendar-check",
      label: "Scheduled Tasks",
    },
  },
  { pattern: /\/icons/ },
  { pattern: /\/strapi-icons/ },
  { pattern: /\/content-type-builder/ },
  { pattern: /\/upload/ },
];
