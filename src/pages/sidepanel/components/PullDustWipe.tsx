import { TextInput, Frame, Button, Separator } from 'react95';
import { styled } from 'styled-components';

import useStorage from '@src/shared/hooks/useStorage';
import settingsStorage from '@src/shared/storages/settingsStorage';

import { mssgPullDustWipe } from '../messages';

const InputGroup = styled.div`
    display: flex;
    align-items: center;
    column-gap: 1rem;
`;

export const PullDustWipe = () => {
    const settings = useStorage(settingsStorage);

    return (
        <Frame style={{ padding: '.5rem ', width: '100%' }}>
            <h2 style={{ margin: '.2rem', textAlign: 'center' }}>Find Entries</h2>
            <Separator style={{ margin: '3px 0' }} />
            <InputGroup>
                <label htmlFor="wo">Work Order #</label>
                <TextInput
                    style={{ flexGrow: 1 }}
                    required
                    id="wo"
                    name="wo"
                    placeholder="Work Order #"
                    defaultValue={settings.wo}
                    onChange={e => settingsStorage.update({ wo: e.target.value })}
                    onFocus={e => e.target.select()}
                />
            </InputGroup>
            <Button fullWidth onClick={() => mssgPullDustWipe(settings)}>
                Pull New Dust Wipe
            </Button>
        </Frame>
    );
};
