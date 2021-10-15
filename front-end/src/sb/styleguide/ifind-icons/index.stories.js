import IfindIcon from '@components/IfindIcon';
import { iconsList, spriteContents } from 'ifind-icons';
import { styleguide } from '@sb';
import mdx from './ifind-icons.mdx';

import './ifind-icons.scss';

const IfindIconsComponent = ({ data, ...args}) => {
  return (
    <div className="styleguide-ifind-icons-wrapper">
      <div hidden dangerouslySetInnerHTML={{ __html: spriteContents }}></div>

      <div className="styleguide-ifind-icons">
        <div className="styleguide-ifind-icons__item">
          <IfindIcon icon='pillars' className="styleguide-ifind-icons__icon" />
          <div className="styleguide-ifind-icons__name">Default Render</div>
        </div>
        <div className="styleguide-ifind-icons__item">
          <IfindIcon icon='pillars' dark={true} />
          <div className="styleguide-ifind-icons__name">Dark (See Docs)</div>
        </div>
        <div className="styleguide-ifind-icons__item">
          <IfindIcon icon='pillars' className="my-icon" />
          <div className="styleguide-ifind-icons__name">Styled (See Docs)</div>
        </div>
      </div>

      <br /><br />

      <h2>Available Icons:</h2>
      <br />

      <div className="styleguide-ifind-icons">
        {iconsList.map(icon => (
            <div className="styleguide-ifind-icons__item" key={icon}>
                <IfindIcon icon={icon} className="styleguide-ifind-icons__icon" dark={args.dark} />
                <div className="styleguide-ifind-icons__name">{icon}</div>
            </div>
        ))}
        </div>
    </div>
  )
};

export default styleguide({
    title: 'IFIND Icons',
    component: IfindIconsComponent,
    argTypes: {
      dark: {
        control: { type: 'boolean' }
      }
    },
    parameters: {
      docs: {
        page: mdx
      }
    }
});

export const IFINDIcons = IfindIconsComponent.bind({});

IFINDIcons.args = {
   dark: false,
};