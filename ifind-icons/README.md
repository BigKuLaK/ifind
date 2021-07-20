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
|  |  |  |  |  |  
| --- | --- | --- | --- | --- |  
| adults-dress | aircon | alarm | avr | baby-arms-up |  
| baby-crawling | baby | badminton | ball-sports | balloons |  
| basketball | bed | beer-can | bicycle | binary-display |  
| binary-headset | blender | book-open | book-stack | bottle-2 |  
| bottle-3 | bottle-4 | bottle-5 | bottle-6 | bottle-beer-cans |  
| bottle-crown | bottle-wine-glass | bottle | bulb-plug | camera |  
| camping-night | camping-tent | car-cog | chair | cheese-chips |  
| chicken-leg-pack | chip | closet | coat | console |  
| controller | cookers | couch-drawers | couch | cpu |  
| crown | deer-crosshair | dine-house | dining-set | dj-equipment |  
| doctor | drawers | dress | duck | ebook |  
| facial-cream | factory-cog | fan-bulb | female | fingernail |  
| fish-hook | flower-shovel | football | foreign-books | freezer |  
| fruits-vegetables | function | gas-range-oven | gift-cards | graphics-card |  
| griller | hair-care | hands-twirl | hard-drisk | headphones |  
| helium-tank | herbal-pills | herbal-soap-shampoo | home-appliances | home-build |  
| infant-carrier-helmet | infant | infinity-dots | kettle | keyboard |  
| kids-clothes | kids-smiling | ladies-bag | ladies-shoe | laptop-2 |  
| laptop | long-hair | makeup-kit | microphone | monitor-screen |  
| motherboard | mouse | music-instruments | necklace-display | non-alcoholic-drink |  
| note | outdoor-activities | oven | ovens | paint-roller |  
| party-props | paw-circle | pc-accessories | pc-fan | pc-monitor |  
| pc-parts | pc | pen-ruler | perfume-spray | phone |  
| pillars | pizza-with-drink | play-tv | play | pressure-cooker |  
| ram-stick | refrigerator | rice-cooker | rope-loop | rum |  
| running | sale-tag | security | shirt | shoes |  
| showbiz-mask | sink | soccer-ball | social-icons | speakers |  
| spray-bucket | swimming | table-tennis-racket | table-with-chair | table |  
| tablet | tennis | tent-soccer | tv | unknown |  
| vacumm-cleaner | volleyball | vr | warp | washer |  
| washing-machine | watch | well-chair | xbox |