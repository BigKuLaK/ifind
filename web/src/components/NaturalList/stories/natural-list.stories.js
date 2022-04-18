import { component } from '@sb';
import NaturalListComponent from '..';

import { items } from '@mocks/components/natural-list';



export default component({
    title: 'Natural List',
    component: NaturalListComponent,
});

export const NaturalList = () => (
    <NaturalListComponent items={items} />
);
