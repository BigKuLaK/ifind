import BasicPage from '@templates/BasicPage';
import { withComponentName } from '@utilities/component';

const AboutUs = () => (
    <BasicPage title="About Us">
        About Us works!
    </BasicPage>
);

export default withComponentName('AboutUsPage')(AboutUs);