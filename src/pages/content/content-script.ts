/**
 * DO NOT USE import someModule from '...';
 *
 * @issue-url https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/160
 *
 * Chrome extensions don't support modules in content scripts.
 * If you want to use other modules in content scripts, you need to import them via these files.
 *
 */

import { delay } from '@shared/helpers';
import { Settings } from '@shared/storages/settingsStorage';
import { isInputTag } from '@shared/helpers/type-guards';

import { handlePullDustWipe } from './handlers/handlePullDustWipe';

chrome.runtime.onMessage.addListener(async ({ command, ...payload }, sender, sendResponse) => {
    let result: unknown = null;
    console.log({ command, sender, payload });
    switch (command) {
        case 'PULL_DUST_WIPES':
            result = await handlePullDustWipe(payload.wo);
            break;
        case 'ADD_ATTACHMENT':
            result = await handleAddAttachment(payload.wo, payload.suffix);
            break;
        case 'ENTER_METADATA':
            result = await handleEnterMetadata(payload.settings);
            break;
        case 'ENTER_RESULTS':
            result = await handleEnterResults(payload);
            break;
    }
    sendResponse({ result: result ?? 'None' });
});

const ID_BTN_OPEN_ATTACHMENT_MODAL = 'B565136846818198640';
const ID_INPUT_ATTACHMENT_DESC = 'P303_ATTACHMENT_DESCR';

const modal = () => document.querySelectorAll('iframe')[0]?.contentWindow.document;

async function handleAddAttachment(wo: string, suffix: string) {
    const openModalBtn = document.getElementById(ID_BTN_OPEN_ATTACHMENT_MODAL);

    if (!modal() && openModalBtn) {
        openModalBtn.click();
        await delay(500);
    }

    const attachmentDesc = modal().getElementById(ID_INPUT_ATTACHMENT_DESC);
    if (isInputTag(attachmentDesc)) {
        attachmentDesc.value = wo + suffix;
    }
}

async function handleEnterMetadata({
    receivedByDate,
    receivedByTime,
    receivedByAMPM,
    analyzedByDate,
    analyzedByTime,
    analyzedByAMPM,
}: Settings) {
    const metadata = {
        P8_LABID: '100986',
        P8_ANALYTIC_METHODOLOGY: 'EPA 7000B',
        P8_DATE_RECEIVED: `${receivedByDate} ${receivedByTime}${receivedByAMPM}`,
        P8_DATE_OF_ANALYSIS: `${analyzedByDate} ${analyzedByTime}${analyzedByAMPM}`,
    };

    for (const [key, val] of Object.entries(metadata)) {
        const input = document.getElementById(key);
        if (isInputTag(input)) input.value = val;
    }
}

type ResultsData = { initialSampleId: number } & Pick<
    Settings,
    'ugTotal' | 'areaA' | 'areaB' | 'ugPerAreaA' | 'ugPerAreaB'
>;
async function handleEnterResults({ initialSampleId, areaA, areaB, ugPerAreaA, ugPerAreaB, ugTotal }: ResultsData) {
    const areas = [areaA, areaB];
    const resultsPerSQFT = [ugPerAreaA, ugPerAreaB];
    const message = { type: 'crummy/SET_RESULTS', initialSampleId, areas, resultsTotal: ugTotal, resultsPerSQFT };
    console.log('SEND MESSAGE', message);
    window.postMessage(message);
}
