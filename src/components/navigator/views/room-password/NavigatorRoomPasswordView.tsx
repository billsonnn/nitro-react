import { RoomDataParser } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { CreateRoomSession, LocalizeText } from '../../../../api';
import { Button } from '../../../../common/Button';
import { Column } from '../../../../common/Column';
import { Text } from '../../../../common/Text';
import { UpdateDoorStateEvent } from '../../../../events';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';

export interface NavigatorRoomPasswordViewProps
{
    roomData: RoomDataParser;
    state: string;
    onClose: (state: string) => void;
}

export const NavigatorRoomPasswordView: FC<NavigatorRoomPasswordViewProps> = props =>
{
    const { roomData = null, state = null, onClose = null } = props;
    const [ password, setPassword ] = useState('');

    const close = () =>
    {
        onClose(null);
    }

    const tryEntering = useCallback(() =>
    {
        if(!roomData) return;

        CreateRoomSession(roomData.roomId, password);

        onClose(UpdateDoorStateEvent.STATE_PENDING_SERVER);
    }, [ roomData, password, onClose ]);

    return (
        <NitroCardView className="nitro-navigator-password" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('navigator.password.title') } onCloseClick={ close } />
            <NitroCardContentView>
                <Column gap={ 1 }>
                    { roomData &&
                        <Text bold>{ roomData.roomName }</Text> }
                    { (state === UpdateDoorStateEvent.START_PASSWORD) &&
                        <Text>{ LocalizeText('navigator.password.info') }</Text> }
                    { (state === UpdateDoorStateEvent.STATE_WRONG_PASSWORD) &&
                        <Text>{ LocalizeText('navigator.password.retryinfo') }</Text> }
                </Column>
                <Column gap={ 1 }>
                    <Text>{ LocalizeText('navigator.password.enter') }</Text>
                    <input type="password" className="form-control form-control-sm" onChange={ event => setPassword(event.target.value) } />
                </Column>
                <Button variant="success" size="sm" onClick={ tryEntering }>
                    { LocalizeText('navigator.password.button.try') }</Button>
                <Button variant="danger" size="sm" onClick={ close }>
                        { LocalizeText('generic.cancel') }
                    </Button>
            </NitroCardContentView>
        </NitroCardView>
    );
}
