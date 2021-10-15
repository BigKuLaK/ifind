import { component } from '@sb';
import HeaderMiddleComponent from '../HeaderMiddle';

export default component({
    title: 'Header/Header Middle',
    component: HeaderMiddleComponent,
});

// Define Templates in order to accept args
const Template = (args) => <HeaderMiddleComponent {...args} />

export const HeaderMiddle = Template.bind({});