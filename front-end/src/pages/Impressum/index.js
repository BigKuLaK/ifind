import content from '@mocks/pages/impressum';
import BasicPage from '@templates/BasicPage';
import { withComponentName } from '@utilities/component';

const Impressum = () => {
    return (
        <BasicPage title='Impressum'>
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </BasicPage>
    )
};

export default withComponentName('ImpressumPage')(Impressum);