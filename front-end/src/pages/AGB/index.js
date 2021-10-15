import BasicPage from '@templates/BasicPage';
import content from '@mocks/pages/agb';
import { withComponentName } from '@utilities/component';

const AGB = () => {
    return (
        <BasicPage title='AGB'>
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </BasicPage>
    )
};

export default withComponentName('AGBPage')(AGB);