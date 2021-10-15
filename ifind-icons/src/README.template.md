# IFIND Custom Icons

These are custom-made icons which are purchased for IFIND's use. Please refer to [IFIND's Storybook](https://www.ifindilu.com/storybook/?path=/story/00-styleguide-ifind-icons--ifind-icons) for a live preview and usage docs.

## Instructions
1. Build the icons by running `npm run build`.
2. Prepare the sprite for usage:
   ```jsx
    // outside-ifind-icons/other-app/index.js
    import { spriteContents } from 'ifind-icons';

    // Render the sprite
    const App = () => {
        return (
            <>
                <div hidden dangerouslySetInnerHTML={{ __html: spriteContents }}></div>
                {* The rest of renders *}
            </>
        )
    }
   ```
3. Use within a component:
   ```jsx
    // outside-ifind-icons/other-app/some-component/index.js

    // Icon component
    const IfindIcon = () => {
        return (
            <svg>
                <use xlinkHref={`#whatever-icon`} ></use>
            </svg>
        )
    }
   ```

## Icons List
Here's a list of all the available icon names in the latest build. This package also exports **iconsList**, which is an array of all available icon names.  
{iconsTable}