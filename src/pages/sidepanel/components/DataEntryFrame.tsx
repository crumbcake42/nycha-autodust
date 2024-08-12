import { FC } from 'react';
import { NumberInput, Frame, GroupBox, Button, Separator, TextInput } from 'react95';
import styled from 'styled-components';

import useStorage from '@src/shared/hooks/useStorage';
import settingsStorage, { AMPM, Settings } from '@src/shared/storages/settingsStorage';

import { mssgAddAttachment, mssgEnterMetadata, mssgEnterResults } from '../messages';
import { useState } from 'react';

const InputGroup = styled.div`
    display: flex;
    align-items: center;
    column-gap: 1rem;
`;

const AmPm: FC<{ value: AMPM; onToggle: (ampm: AMPM) => void }> = ({ value, onToggle }) => (
    <Button onClick={() => onToggle(value === 'AM' ? 'PM' : 'AM')}>{value}</Button>
);

const EnterResultsButton = () => {
    const settings = useStorage(settingsStorage);

    return (
        <div style={{ display: 'flex' }}>
            <NumberInput
                defaultValue={settings.sampleId}
                min={1000000}
                max={9999999}
                onChange={sampleId => settingsStorage.update({ sampleId })}
            />
            <Button fullWidth onClick={() => mssgEnterResults(settings)}>
                Enter All Results
            </Button>
        </div>
    );
};

const isValidHH = (value: number) => value > 0 && value <= 12;
const isValidMM = (value: number) => value >= 0 && value < 60;

function padN(value: string | number, n = 2): string {
    const zeroes = '0'.repeat(n);
    console.log('UNTRIMMED', `${zeroes}${value}`);
    return `${zeroes}${value}`.slice(-n);
}

const InputFormattedTime: FC<{ id?: string; name?: string; defaultValue: string; onChange: (key: string) => void }> = ({
    defaultValue,
    onChange,
}) => {
    const [formattedTime, setFormattedTime] = useState(defaultValue);

    const formatTime = (value: string) => {
        const t = parseInt(value);

        let hh = 12;
        let mm = 0;
        if (!isNaN(t)) {
            if (isValidHH(t)) {
                // if is 1:00 - 12:00 etc...
                hh = t;
            } else if (t > 100 && t < 1000) {
                // if is 1:30, 4:45, etc...
                hh = parseInt(value[0]);
                mm = parseInt(value.slice(1));
            } else if (t > 999 && t < 10000) {
                // If is 10:30, 11:45, etc
                hh = parseInt(value.slice(0, 2));
                mm = parseInt(value.slice(2));
            }
        }
        if (!isValidHH(hh)) hh = 12;
        if (!isValidMM(mm)) mm = 0;

        const formatted = `${padN(hh)}:${padN(mm)}`;
        setFormattedTime(formatted);
        onChange(formatted);
    };

    return (
        <TextInput
            required
            id="receivedByTime"
            name="receivedByTime"
            value={formattedTime}
            onFocus={e => e.target.select()}
            onChange={e => setFormattedTime(e.target.value)}
            onBlur={e => formatTime(e.target.value)}
        />
    );
};
export const DataEntryFrame = () => {
    const settings = useStorage(settingsStorage);

    return (
        <Frame style={{ padding: '.5rem ', width: '100%' }}>
            <h2 style={{ margin: '.2rem', textAlign: 'center' }}>Enter Data</h2>
            <Separator style={{ margin: '3px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button style={{ flexGrow: 1 }} onClick={() => mssgAddAttachment(settings)}>
                    Add Attachment
                </Button>
                <Button style={{ flexGrow: 1 }} onClick={() => mssgEnterMetadata(settings)}>
                    Enter Metadata
                </Button>
            </div>
            <EnterResultsButton />

            <GroupBox label="Dates" style={{ marginTop: '1rem' }}>
                <InputGroup>
                    <label htmlFor="receivedBy">Received</label>
                    <div style={{ display: 'flex' }}>
                        <TextInput
                            required
                            id="receivedByDate"
                            name="receivedByDate"
                            defaultValue={settings.receivedByDate}
                            onChange={e => settingsStorage.update({ receivedByDate: e.target.value })}
                        />
                        <InputFormattedTime
                            id="receivedByTime"
                            name="receivedByTime"
                            defaultValue={settings.receivedByTime}
                            onChange={receivedByTime => settingsStorage.update({ receivedByTime })}
                        />
                        <AmPm
                            value={settings.receivedByAMPM}
                            onToggle={ampm => settingsStorage.update({ receivedByAMPM: ampm })}
                        />
                    </div>
                </InputGroup>

                <InputGroup>
                    <label htmlFor="analyzedBy">Analyzed</label>
                    <div style={{ display: 'flex' }}>
                        <TextInput
                            required
                            id="analyzedByDate"
                            name="analyzedByDate"
                            defaultValue={settings.analyzedByDate}
                            onChange={e => settingsStorage.update({ analyzedByDate: e.target.value })}
                        />
                        <InputFormattedTime
                            id="analyzedByTime"
                            name="analyzedByTime"
                            defaultValue={settings.analyzedByTime}
                            onChange={analyzedByTime => settingsStorage.update({ analyzedByTime })}
                        />
                        <AmPm
                            value={settings.analyzedByAMPM}
                            onToggle={ampm => settingsStorage.update({ analyzedByAMPM: ampm })}
                        />
                    </div>
                </InputGroup>
            </GroupBox>
        </Frame>
    );
};
