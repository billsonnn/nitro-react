import { RoomDataParser } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { CreateRoomSession, GoToDesktop, LocalizeText } from '../../../../api';
import { Button } from '../../../../common/Button';
import { Column } from '../../../../common/Column';
import { Text } from '../../../../common/Text';
import { UpdateDoorStateEvent } from '../../../../events';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';

export interface NavigatorRoomDoorbellViewProps
{
    roomData: RoomDataParser;
    state: string;
    onClose: (state: string) => void;
}

export const NavigatorRoomDoorbellView: FC<NavigatorRoomDoorbellViewProps> = props =>
{
    const { roomData = null, state = null, onClose = null } = props;

    const close = () =>
    {
        if(state === UpdateDoorStateEvent.STATE_WAITING) GoToDesktop();

        onClose(null);
    }

    const ring = () =>
    {
        if(!roomData) return;

        CreateRoomSession(roomData.roomId);

        onClose(UpdateDoorStateEvent.STATE_PENDING_SERVER);
    }

    return (
        <NitroCardView className="nitro-navigator-doorbell" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('navigator.doorbell.title') } onCloseClick={ close } />
            <NitroCardContentView>
                <Column gap={ 1 }>
                    { roomData &&
                        <Text bold>{ roomData.roomName }</Text> }
                    { (state === UpdateDoorStateEvent.START_DOORBELL) &&
                        <Text>{ LocalizeText('navigator.doorbell.info') }</Text> }
                    { (state === UpdateDoorStateEvent.STATE_WAITING) &&
                        <Text>{ LocalizeText('navigator.doorbell.waiting') }</Text> }
                    { (state === UpdateDoorStateEvent.STATE_NO_ANSWER) &&
                        <Text>{ LocalizeText('navigator.doorbell.no.answer') }</Text> }
                </Column>
                { (state === UpdateDoorStateEvent.START_DOORBELL) &&
                    <Button variant="success" size="sm" onClick={ ring }>
                        { LocalizeText('navigator.doorbell.button.ring') }
                    </Button> }
                <Button variant="danger" size="sm" onClick={ close }>
                    { LocalizeText('generic.cancel') }
                </Button>
            </NitroCardContentView>
        </NitroCardView>
    );
}
