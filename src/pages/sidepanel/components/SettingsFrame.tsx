import useStorage from '@src/shared/hooks/useStorage';
import settingsStorage, { Settings } from '@src/shared/storages/settingsStorage';

import { NumberInput, TextInput, Frame, Separator, GroupBox } from 'react95';

import { styled } from 'styled-components';

const InputGroup = styled.div`
    display: flex;
    align-items: center;
    column-gap: 1rem;
`;

export const AppSettings = () => {
    const settings = useStorage(settingsStorage);

    return (
        <Frame style={{ padding: '.5rem ' }}>
            <h2 style={{ textAlign: 'center' }}>Settings</h2>
            <Separator />

            <InputGroup>
                <label htmlFor="wo">Default Result</label>
                <TextInput
                    style={{ flexGrow: 1 }}
                    required
                    id="wo"
                    name="wo"
                    placeholder="Work Order #"
                    defaultValue={settings.ugTotal}
                    onChange={e => settingsStorage.update({ ugTotal: e.target.value })}
                />
            </InputGroup>

            <GroupBox label="Areas A/B">
                <InputGroup>
                    <NumberInput
                        defaultValue={parseInt(settings.areaA)}
                        onChange={value => settingsStorage.update({ areaA: '' + value })}
                    />
                    <TextInput
                        required
                        id="ugPerAreaA"
                        name="ugPerAreaA"
                        defaultValue={settings.ugPerAreaA}
                        onChange={e => settingsStorage.update({ ugPerAreaA: e.target.value })}
                    />
                </InputGroup>

                <InputGroup>
                    <NumberInput
                        defaultValue={parseInt(settings.areaB)}
                        onChange={value => settingsStorage.update({ areaB: '' + value })}
                    />
                    <TextInput
                        required
                        id="ugPerAreaB"
                        name="ugPerAreaB"
                        defaultValue={settings.ugPerAreaB}
                        onChange={e => settingsStorage.update({ ugPerAreaB: e.target.value })}
                    />
                </InputGroup>
            </GroupBox>
        </Frame>
    );
};
