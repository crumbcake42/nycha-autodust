import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

export type AMPM = 'AM' | 'PM';

export interface Settings {
    wo: string;
    receivedByDate: string;
    receivedByTime: string;
    receivedByAMPM: AMPM;
    analyzedByDate: string;
    analyzedByTime: string;
    analyzedByAMPM: AMPM;
    areaA: string;
    areaB: string;
    ugTotal: string;
    ugPerAreaA: string;
    ugPerAreaB: string;
    attachmentSuff: string;
    sampleId: number;
}

type SettingsStorage = BaseStorage<Settings> & {
    update: (update: Partial<Settings>) => void;
};

const initialSettings: Settings = {
    wo: '000000000',
    receivedByDate: '5/31/23',
    receivedByTime: '10:00',
    receivedByAMPM: 'AM',
    analyzedByDate: '5/31/23',
    analyzedByTime: '10:00',
    analyzedByAMPM: 'AM',
    ugTotal: '<5.00',
    areaA: '2',
    areaB: '1',
    ugPerAreaA: '<2.50',
    ugPerAreaB: '<7.50',
    attachmentSuff: '_finalreport',
    sampleId: 1000000,
};

const storage = createStorage('settings-storage-key', initialSettings, {
    storageType: StorageType.Local,
});

const settingsStorage: SettingsStorage = {
    ...storage,
    // TODO: extends your own methods
    update: (update: Partial<Settings>) => {
        storage.set(currentSettings => {
            return {
                ...currentSettings,
                ...update,
            };
        });
    },
};

export default settingsStorage;
