import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';

import { Window, WindowContent } from 'react95';

import { Header } from './Header';
import { AppSettings } from './components/SettingsFrame';
import { DataEntryFrame } from './components/DataEntryFrame';
import { PullDustWipe } from './components/PullDustWipe';

const SidePanel = () => (
    <Window>
        <Header />
        <WindowContent>
            <PullDustWipe />
            <DataEntryFrame />
            <AppSettings />
        </WindowContent>
    </Window>
);

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
