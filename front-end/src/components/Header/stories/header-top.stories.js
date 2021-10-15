// import { BrowserRouter } from 'react-router-dom';
import { component } from '@sb';
import HeaderTopComponent from '../HeaderTop';

// Import mocks
import { phone, email } from '@mocks/global/contact';

export default component({
    title: 'Header/Header Top',
    component: HeaderTopComponent,
});

// Define Templates in order to accept args
const HeaderTopTemplate = (args) => <HeaderTopComponent {...args} />

export const HeaderTop = HeaderTopTemplate.bind({});
HeaderTop.args = { email, phone };