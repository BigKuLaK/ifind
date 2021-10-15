import { template } from '@sb';
import GeneralTemplateComponent from '../';

export default template({
    title: 'General Template',
    component: GeneralTemplateComponent,
});

export const GeneralTemplate = () => (
    <GeneralTemplateComponent>
        General Template
    </GeneralTemplateComponent>
)