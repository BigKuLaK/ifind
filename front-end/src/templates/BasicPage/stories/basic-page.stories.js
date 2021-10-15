import { template } from '@sb';
import BasicPageTemplate from '../';

export default template({
    title: 'Basic Page',
    component: BasicPageTemplate,
});

export const BasicPage = () => (
    <BasicPageTemplate title="Sample Basic Page Template">
        Basic Page
    </BasicPageTemplate>
)