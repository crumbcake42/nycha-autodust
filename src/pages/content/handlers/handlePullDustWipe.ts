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
import { isInputTag } from '@shared/helpers/type-guards';

const ID_BTN_PULL_DUST_WIPES = 'B564500466648403911';
const ID_BTN_VALIDATE_WORK_ORDER = 'B565135074730198622';
const ID_BTN_LOCATION_MATCHES = 'B563882447591316845';
const ID_INPUT_WORK_ORDER = 'P11_REFWO';
const ID_INPUT_COC = 'P11_COCID';

export async function handlePullDustWipe(wo: string) {
    try {
        // const modal = () => document.querySelectorAll('iframe')[0]?.contentWindow.document;

        const pullDustWipesBtn = document.getElementById(ID_BTN_PULL_DUST_WIPES);
        if (!modal() && pullDustWipesBtn) {
            pullDustWipesBtn.click();
            await delay(500);
        }

        const inputWorkOrder = modal().getElementById(ID_INPUT_WORK_ORDER);
        const inputCOC = modal().getElementById(ID_INPUT_COC);
        const btnValidateWo = modal().getElementById(ID_BTN_VALIDATE_WORK_ORDER);
        const btnConfirmLocation = modal().getElementById(ID_BTN_LOCATION_MATCHES);

        if (btnValidateWo && isInputTag(inputWorkOrder) && isInputTag(inputCOC)) {
            inputWorkOrder.value = wo;
            inputCOC.value = `${wo}-C001`;
            btnValidateWo.click();
        } else if (btnConfirmLocation) {
            console.log('location ');
            btnConfirmLocation.click();
        } else {
            throw new Error('Missing inputs. Modal might not have opened in time');
        }

        return { success: true };
    } catch (err) {
        return { success: false, err };
    }
}
