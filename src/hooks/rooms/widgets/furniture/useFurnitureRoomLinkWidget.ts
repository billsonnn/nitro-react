import { GetGuestRoomMessageComposer, GetGuestRoomResultEvent, RoomEngineTriggerWidgetEvent, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { useEffect, useState } from 'react';
import { GetCommunication, GetRoomEngine, SendMessageComposer } from '../../../../api';
import { UseRoomEngineEvent } from '../../../events';

const INTERNALLINK = 'internalLink';

const useFurnitureRoomLinkWidgetState = () =>
{
    const [ roomIdToEnter, setRoomIdToEnter ] = useState(0);

    UseRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_ROOM_LINK, event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);
    
        if(!roomObject) return;

        const data = roomObject.model.getValue<any>(RoomObjectVariable.FURNITURE_DATA);

        let roomId = data[INTERNALLINK];

        if(!roomId || !roomId.length) roomId = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_INTERNAL_LINK);

        if(!roomId || !roomId.length) return;

        roomId = parseInt(roomId, 10);

        if(roomId === NaN) return;

        setRoomIdToEnter(roomId);

        SendMessageComposer(new GetGuestRoomMessageComposer(roomId, false, false));
    });

    useEffect(() =>
    {
        if(!roomIdToEnter) return;

        const onGetGuestRoomResultEvent = (event: GetGuestRoomResultEvent) =>
        {
            const parser = event.getParser();

            if(parser.data.roomId !== roomIdToEnter) return;

            setRoomIdToEnter(0);
        }

        const event = new GetGuestRoomResultEvent(onGetGuestRoomResultEvent);

        GetCommunication().registerMessageEvent(event);
        
        return () => GetCommunication().removeMessageEvent(event);
    }, [ roomIdToEnter ]);

    return {};
}

export const useFurnitureRoomLinkWidget = useFurnitureRoomLinkWidgetState;
