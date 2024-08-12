import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

console.log('BACKGROUND LOADED');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
// reloadOnUpdate('pages/content/style.scss');

const NYCHA_ORIGIN = 'https://webapxp1.nycha.info';

const SIDEPANEL = 'src/pages/sidepanel/index.html';
const isNychaTab = (tab: { url?: string }): boolean => {
    if (!tab.url) return false;
    const url = new URL(tab.url);
    return url.origin === NYCHA_ORIGIN;
};

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(error => console.error(error));

const enableSidePanel = (tabId: number) =>
    chrome.sidePanel.setOptions({
        tabId,
        path: SIDEPANEL,
        enabled: true,
    });

const disableSidePanel = (tabId: number) =>
    chrome.sidePanel.setOptions({
        tabId,
        enabled: false,
    });

function handlePanelPath(tabId: number, url?: string) {
    const toggle = isNychaTab({ url }) ? enableSidePanel : disableSidePanel;
    toggle(tabId);
}

chrome.tabs.onActivated.addListener(tab => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        let url = tabs[0].url;
        handlePanelPath(tab.tabId, url);
    });
});

chrome.tabs.onUpdated.addListener((tabId, _, tab) => {
    handlePanelPath(tabId, tab.url);
});
