// import { BrowserRouter } from 'react-router-dom';
import { component } from '@sb';
import HeaderNavComponent from '../HeaderNav';

export default component({
    title: 'Header/Header Nav',
    component: HeaderNavComponent,
});

// Define Templates in order to accept args
const Template = (args) => <HeaderNavComponent {...args} />

export const HeaderNav = Template.bind({});
HeaderNav.args = { withSideNav: false };