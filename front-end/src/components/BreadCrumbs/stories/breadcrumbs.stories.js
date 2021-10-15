import { component } from '@sb';
import BreadcrumbsComponent from '../';

export default component({
    title: 'Breadcrumbs',
    component: BreadcrumbsComponent,
});

export const Breadcrumbs = () => (
    <div className="contact-us">
        <BreadcrumbsComponent />
    </div>
)