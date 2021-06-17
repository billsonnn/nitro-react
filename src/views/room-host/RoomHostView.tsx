import { IRoomSession, RoomEngineEvent, RoomId, RoomSessionErrorMessageEvent, RoomSessionEvent } from 'nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { SetActiveRoomId } from '../../api/nitro/room/SetActiveRoomId';
import { GetRoomSession } from '../../api/nitro/session/GetRoomSession';
import { StartRoomSession } from '../../api/nitro/session/StartRoomSession';
import { useRoomEngineEvent } from '../../hooks/events/nitro/room/room-engine-event';
import { useRoomSessionManagerEvent } from '../../hooks/events/nitro/session/room-session-manager-event';
import { RoomView } from '../room/RoomView';
import { RoomHostViewProps } from './RoomHostView.types';

export const RoomHostView: FC<RoomHostViewProps> = props =>
{
    const [ roomSession, setRoomSession ] = useState<IRoomSession>(null);

    const onRoomEngineEvent = useCallback((event: RoomEngineEvent) =>
    {
        if(RoomId.isRoomPreviewerId(event.roomId)) return;

        const session = GetRoomSession();

        if(!session) return;

        switch(event.type)
        {
            case RoomEngineEvent.INITIALIZED:
                SetActiveRoomId(event.roomId);
                setRoomSession(session);
                return;
            case RoomEngineEvent.DISPOSED:
                setRoomSession(null);
                return;
        }
    }, []);

    useRoomEngineEvent(RoomEngineEvent.INITIALIZED, onRoomEngineEvent);
    useRoomEngineEvent(RoomEngineEvent.DISPOSED, onRoomEngineEvent);

    const onRoomSessionEvent = useCallback((event: RoomSessionEvent) =>
    {
        switch(event.type)
        {
            case RoomSessionEvent.CREATED:
                StartRoomSession(event.session);
                return;
            case RoomSessionEvent.ENDED:
                setRoomSession(null);
                return;
        }
    }, []);

    useRoomSessionManagerEvent(RoomSessionEvent.CREATED, onRoomSessionEvent);
    useRoomSessionManagerEvent(RoomSessionEvent.ENDED, onRoomSessionEvent);

    const onRoomSessionErrorMessageEvent = useCallback((event: RoomSessionErrorMessageEvent) =>
    {
        console.log(event);
    }, []);

    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_KICKED, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_PETS_FORBIDDEN_IN_HOTEL, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_PETS_FORBIDDEN_IN_FLAT, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_MAX_PETS, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_MAX_NUMBER_OF_OWN_PETS, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_NO_FREE_TILES_FOR_PET, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_SELECTED_TILE_NOT_FREE_FOR_PET, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_BOTS_FORBIDDEN_IN_HOTEL, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_BOTS_FORBIDDEN_IN_FLAT, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_BOT_LIMIT_REACHED, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_SELECTED_TILE_NOT_FREE_FOR_BOT, onRoomSessionErrorMessageEvent);
    useRoomSessionManagerEvent(RoomSessionErrorMessageEvent.RSEME_BOT_NAME_NOT_ACCEPTED, onRoomSessionErrorMessageEvent);

    return (
        <div className="nitro-room-host w-100 h-100">
            <RoomView roomSession={ roomSession } />
        </div>
    );
}
