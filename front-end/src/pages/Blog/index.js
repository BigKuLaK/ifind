import BasicPage from '@templates/BasicPage';
import { withComponentName } from '@utilities/component';

const Blog = () => (
    <BasicPage title="Blog">
        Blog works!
    </BasicPage>
);

export default withComponentName('BlogPage')(Blog);