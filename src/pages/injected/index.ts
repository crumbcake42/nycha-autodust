const ID_BTN_EDIT_ALL_SAMPLES = 'B566341011916616898';
const LAB_SAMPLE_ID = 'LAB_SAMPLE_ID';
const AREA = 'AREASQFT';
const TOTAL_UG = 'RESULTSVALUEFROMLAB';
const RESULTS_UG = 'RESULTSVALUEPERSQFT';

interface SetResultsPayload {
    initialSampleId: number;
    resultsTotal: string;
    areas: [string, string];
    resultsPerSQFT: [string, string];
    type: 'crummy/SET_RESULTS';
}

// console.log('injected loaded');

const delay = async (t: number) =>
    new Promise(res => {
        setTimeout(res, t);
    });

const modal = () => document.querySelectorAll('iframe')[0]?.contentWindow.document;

function isValidTuple(x: unknown): x is [string, string] {
    return Array.isArray(x) && x.length === 2 && x.every(i => typeof i == 'string');
}

function isSetResultsEvent(msg: MessageEvent): msg is MessageEvent & { data: SetResultsPayload } {
    if (
        !['areas', 'initialSampleId', 'resultsPerSQFT', 'resultsTotal', 'type'].every(
            key => key in msg.data && !!msg.data[key],
        )
    ) {
        console.log('missing key', msg.data);
        return false;
    }
    const { areas, initialSampleId, resultsTotal, resultsPerSQFT, type } = msg.data;

    return (
        type === 'crummy/SET_RESULTS' &&
        typeof initialSampleId === 'number' &&
        typeof resultsTotal == 'string' &&
        isValidTuple(areas) &&
        isValidTuple(resultsPerSQFT)
    );
}

async function handleSetResults(data: SetResultsPayload) {
    const { initialSampleId, areas, resultsTotal, resultsPerSQFT } = data;
    let labSampleId = initialSampleId;

    const btnEditSamples = document.getElementById(ID_BTN_EDIT_ALL_SAMPLES);
    if (!modal() && btnEditSamples) {
        btnEditSamples.click();
        await delay(1500);
    }

    const innerWindow: any = window.document.querySelectorAll('iframe')[0].contentWindow.window;
    const ig$ = innerWindow.apex.region('R963527484603220065').widget();

    const model = ig$.interactiveGrid('getViews', 'grid').model;

    const records = Object.keys(model._index).map(row => model.getRecord(row));
    records.sort((...recs) => {
        const [idA, idB] = recs.map(rec => model.getValue(rec, 'SAMPLEID'));
        return idA.slice(-3).localeCompare(idB.slice(-3));
    });

    records.forEach((record, row) => {
        // Since second reow usually acts like an odd one, cheat definition
        const rowKey = row === 1 ? 0 : row % 2;

        // Set Lab Sample ID
        model.setValue(record, LAB_SAMPLE_ID, `${labSampleId}`);
        labSampleId++;
        // Set Area
        model.setValue(record, AREA, areas[rowKey]);
        // Set total ug to <5.00
        model.setValue(record, TOTAL_UG, resultsTotal);
        // Set ug/ft^2 according to results_ab and row index
        model.setValue(record, RESULTS_UG, resultsPerSQFT[rowKey]);
    });
}

window.addEventListener('message', function (message) {
    if (message.data.type !== 'crummy/SET_RESULTS') return;
    if (isSetResultsEvent(message)) handleSetResults(message.data);
});
