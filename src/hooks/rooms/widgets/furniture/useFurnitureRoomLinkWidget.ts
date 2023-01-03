import { GetGuestRoomMessageComposer, GetGuestRoomResultEvent, RoomEngineTriggerWidgetEvent, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { GetRoomEngine, SendMessageComposer } from '../../../../api';
import { useMessageEvent, useRoomEngineEvent } from '../../../events';

const INTERNALLINK = 'internalLink';

const useFurnitureRoomLinkWidgetState = () =>
{
    const [ roomIdToEnter, setRoomIdToEnter ] = useState(0);

    useRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_ROOM_LINK, event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);
    
        if(!roomObject) return;

        const data = roomObject.model.getValue<any>(RoomObjectVariable.FURNITURE_DATA);

        let roomId = data[INTERNALLINK];

        if(!roomId || !roomId.length) roomId = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_INTERNAL_LINK);

        if(!roomId || !roomId.length) return;

        roomId = parseInt(roomId, 10);

        if(isNaN(roomId)) return;

        setRoomIdToEnter(roomId);

        SendMessageComposer(new GetGuestRoomMessageComposer(roomId, false, false));
    });

    useMessageEvent<GetGuestRoomResultEvent>(GetGuestRoomResultEvent, event =>
    {
        if(!roomIdToEnter) return;

        const parser = event.getParser();

        if(parser.data.roomId !== roomIdToEnter) return;

        setRoomIdToEnter(0);
    });

    return {};
}

export const useFurnitureRoomLinkWidget = useFurnitureRoomLinkWidgetState;
