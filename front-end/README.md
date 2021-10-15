# Front End Development Workflow

## Table of Contents
1. [Local Setup](#local-setup)  
2. [Folder Structure](#folder-structure)  
3. [Pattern Structure](#pattern-structure)  
4. [Composition](#composition)
5. [Styling](#styling)  
   a. [Stylesheet Format](#stylesheet-format)  
   b. [Naming Convention](#naming--convention)  
   c. [SCSS Functions](#scss-functions)  
   d  [SCSS Mixins](#scss-mixins)
6. [Pattern Library (Storybook)](#pattern-library-storybook)  
7. [Unit Testing (Jest)](#unit-testing-jest)  

---


## Local Setup
1. Run `npm install`.  
2. Copy and rename `.env.example` into `.env`.  
3. Run necessary scripts for development:  
   - `npm run proxy` to start proxy server handling requests to production API. This will use settings from .env.  
   - `npm run start` to start the front-end site. This will automatically refresh on file changes.  
   - `npm run test` to start the test watcher. This will automatically run tests on changed files.  
   - `npm run storybook` to start the Storybook. This contains the styleguide and component libraries.  


---


## Folder Structure  
Inside the front-end folder, there are 5 significant folders to take into account during development:

|Folder|Description|
|------|-----------|
|***.storybook***| Contains storybook configurations |
|***config***| Contains runtime configurations |
|***public***| Contains public assets that doesn't need to compile |
|***scripts***| Contains compile and build scripts |
|***src***| Contains source files that needs to be compiled. This is the main folder that where we develop |  


## Pattern Structure
The whole site is broken down into smaller parts for easier development and maintainability.  

| | |
|-----|-----|
|***components***| These are the smallest parts of the site. There are meant to be standalone parts and should not contain nested components. |
|***templates***| These are the templates that are used by the pages. |
|***pages***| Contains actual pages that uses the templates. Data fetching should only happen here and is then published into components using **React Context** |


## Composition
We are using React components extensively. File structure for the components should be as follows: 
```js
|- src
|  - components               // Or pages, templates, etc.
|    - ComponentName          // Component name in PascalCase
|      - index.js             // The main component file
|      - component-name.scss  // The component stylesheet
|    ...
```

## Styling
The front-end uses [SASS/SCSS](#https://sass-lang.com) precompiler to handle styles.  
There are some rules that need to take into account when styling components:

- Use mixins and functions as often as possible.
- Colors, Fonts, and other style configurations should be defined in Storybook and should be used.
- Every component/page/template style should be within their own folder (e.g., `src/components/Header/header.scss`), and should be imported inside their respective React component (e.g., `src/components/Header/index.js`).

### Stylesheet Format
The component stylesheet should be as follows:
```scss
// some-component.scss

/* Imports configs, mixins, functions, etc. */
@import "base/scss";

.some-component {
   /* Styles... */
}
```

### Naming Convention
Should follow the [BEM (Block-Element-Modifier) Convention](https://medium.com/@andrew_barnes/bem-and-sass-a-perfect-match-5e48d9bc3894)   
**Example:**
```jsx
// SomeComponent/index.js

<div className="some-component">
   <h2 className="some-component__heading">Heading</h2>
   <p className="some-component__content">Content</p>
</div>
```
  
```scss
// SomeComponent/some-component.scss

.some-component {       // Root Selector
   &__heading {         // .some-component__heading
      // Styles...
   }

   &__content {         // .some-component__content
      // Styles...
   }
}
```

### SCSS Functions
Custom SCSS Functions should be used as much as possible.  
| Function | Usage | Output | Description |
|---|---|---|---|
| ***color($color-name)*** | `background-color: color(red);` | `background-color: #ea0000;` | Uses a color defined in `src/base/scss/config/_colors.scss`|  

  
### SCSS Mixins  
Custom SCSS Mixins should be used as much as possible.  
| Function | Usage | Description |
|---|---|---|
| ***bootstrap($classnames)*** | `.content { @include bootstrap(col-lg-9 col-12); }` | Extends bootstrap utility classes. |



## Pattern Library (Storybook)
The front-end uses [Storybook](https://storybook.js.org/) to handle the pattern library.  
This should contain the styleguides, pages, templates, and components as reference during the development.



## Unit Testing (Jest)
Every component should have a unit test whenever possible.  

# TODO
Additional docs for:
- Styling  
- Unit Testing  