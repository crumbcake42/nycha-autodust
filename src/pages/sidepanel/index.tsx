import { createRoot } from 'react-dom/client';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import SidePanel from '@pages/sidepanel/SidePanel';
import Windows95ThemeProvider from '@root/src/shared/style/windows95';

refreshOnUpdate('pages/sidepanel');

function init() {
    const appContainer = document.querySelector('#app-container');
    if (!appContainer) {
        throw new Error('Can not find #app-container');
    }

    const root = createRoot(appContainer);
    root.render(
        <Windows95ThemeProvider>
            <SidePanel />
        </Windows95ThemeProvider>,
    );
}

init();
