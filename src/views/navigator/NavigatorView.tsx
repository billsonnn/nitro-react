import { RoomDataParser, RoomForwardEvent, RoomInfoComposer, RoomInfoEvent, RoomInfoOwnerEvent } from 'nitro-renderer';
import { GetRoomSessionManager, GetSessionDataManager } from '../../api';
import { CreateMessageHook, SendMessageHook } from '../../hooks/messages/message-event';
import { NavigatorViewProps } from './NavigatorView.types';

export function NavigatorView(props: NavigatorViewProps): JSX.Element
{
    const onRoomForwardEvent = (event: RoomForwardEvent) =>
    {
        const parser = event.getParser();

        SendMessageHook(new RoomInfoComposer(parser.roomId, false, true));
    };

    const onRoomInfoOwnerEvent = (event: RoomInfoOwnerEvent) =>
    {
        const parser = event.getParser();

        SendMessageHook(new RoomInfoComposer(parser.roomId, true, false));
    };

    const onRoomInfoEvent = (event: RoomInfoEvent) =>
    {
        const parser = event.getParser();

        if(parser.roomEnter)
        {
            // this._data.enteredGuestRoom = parser.data;
            // this._data.staffPick        = parser.data.roomPicker;

            // const isCreatedRoom = (this._data.createdRoomId === parser.data.roomId);

            // if(!isCreatedRoom && parser.data.displayRoomEntryAd)
            // {
            //     // display ad
            // }

            // this._data.createdRoomId = 0;
        }

        else if(parser.roomForward)
        {
            if((parser.data.ownerName !== GetSessionDataManager().userName) && !parser.isGroupMember)
            {
                switch(parser.data.doorMode)
                {
                    case RoomDataParser.DOORBELL_STATE:
                        console.log('open doorbell');
                        return;
                    case RoomDataParser.PASSWORD_STATE:
                        console.log('open password');
                        return;
                }
            }

            GetRoomSessionManager().createSession(parser.data.roomId);
        }

        else
        {
            // this._data.enteredGuestRoom = parser.data;
            // this._data.staffPick        = parser.data.roomPicker;
        }
    };

    CreateMessageHook(new RoomForwardEvent(onRoomForwardEvent));
    CreateMessageHook(new RoomInfoOwnerEvent(onRoomInfoOwnerEvent));
    CreateMessageHook(new RoomInfoEvent(onRoomInfoEvent));
    
    return (
        <div>navigator</div>
    );
}
