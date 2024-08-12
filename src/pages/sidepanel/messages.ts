import { Settings } from '@src/shared/storages/settingsStorage';

type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never;

const withTabId =
    <T extends (tabId: number, ...args: unknown[]) => unknown>(cb: T) =>
    (...args: DropFirst<Parameters<T>>) =>
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            cb(tabs[0].id, ...args);
        });

export const mssgPullDustWipe = withTabId((tabId, settings: Settings) => {
    chrome.tabs.sendMessage(tabId, { command: 'PULL_DUST_WIPES', wo: settings.wo });
});
export const mssgAddAttachment = withTabId((tabId, settings: Settings) => {
    chrome.tabs.sendMessage(tabId, { command: 'ADD_ATTACHMENT', wo: settings.wo, suffix: settings.attachmentSuff });
});

export const mssgEnterMetadata = withTabId((tabId, settings: Settings) => {
    chrome.tabs.sendMessage(tabId, { command: 'ENTER_METADATA', settings });
});

export const mssgEnterResults = withTabId(
    (tabId, { sampleId, ugTotal, areaA, areaB, ugPerAreaA, ugPerAreaB }: Settings) => {
        chrome.tabs.sendMessage(tabId, {
            command: 'ENTER_RESULTS',
            initialSampleId: sampleId,
            ugTotal,
            areaA,
            areaB,
            ugPerAreaA,
            ugPerAreaB,
        });
    },
);
