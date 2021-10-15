import colors from './colors';
import { styleguide } from '@sb';

import './colors.scss';

const ColorsComponent = () => (
  <div className="styleguide-colors">
    { Object.entries(colors).map(([colorName, colorValue]) => (
      <div key={colorName} className={`styleguide-colors__color`} >
        <div className={`styleguide-colors__preview bg-${colorName}`}>
          <div className="styleguide-colors__value">{colorValue}</div>  
        </div>
        <div className="styleguide-colors__name">{colorName}</div>
      </div>
    ))}
  </div>
);

export default styleguide({
    title: 'Colors',
    component: ColorsComponent,
});

export const Colors = () => <ColorsComponent />;