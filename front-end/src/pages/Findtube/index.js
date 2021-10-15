import BasicPage from '@templates/BasicPage';
import { withComponentName } from '@utilities/component';

const FindTube = () => (
    <BasicPage title="Findtube">
        Findtube works!
    </BasicPage>
)

export default withComponentName('FindTubePage')(FindTube);