import { GetModeratorRoomInfoMessageComposer, ModerateRoomMessageComposer, ModeratorActionMessageComposer, ModeratorRoomInfoEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { TryVisitRoom } from '../../../../../api';
import { ModToolsOpenRoomChatlogEvent } from '../../../../../events/mod-tools/ModToolsOpenRoomChatlogEvent';
import { dispatchUiEvent } from '../../../../../hooks';
import { CreateMessageHook, SendMessageHook } from '../../../../../hooks/messages';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { ModToolsRoomViewProps } from './ModToolsRoomView.types';

export const ModToolsRoomView: FC<ModToolsRoomViewProps> = props =>
{
    const { roomId = null, onCloseClick = null } = props;

    const [ infoRequested, setInfoRequested ] = useState(false);
    const [ loadedRoomId, setLoadedRoomId ] = useState(null);

    const [ name, setName ] = useState(null);
    const [ ownerId, setOwnerId ] = useState(null);
    const [ ownerName, setOwnerName ] = useState(null);
    const [ ownerInRoom, setOwnerInRoom ] = useState(false);
    const [ usersInRoom, setUsersInRoom ] = useState(0);

    //form data
    const [kickUsers, setKickUsers] = useState(false);
    const [lockRoom, setLockRoom] = useState(false);
    const [changeRoomName, setChangeRoomName] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() =>
    {
        if(infoRequested) return;
        
        SendMessageHook(new GetModeratorRoomInfoMessageComposer(roomId));
        setInfoRequested(true);
    }, [ roomId, infoRequested, setInfoRequested ]);

    const onModtoolRoomInfoEvent = useCallback((event: ModeratorRoomInfoEvent) =>
    {
        const parser = event.getParser();

        if(!parser || parser.data.flatId !== roomId) return;

        setLoadedRoomId(parser.data.flatId);
        setName(parser.data.room.name);
        setOwnerId(parser.data.ownerId);
        setOwnerName(parser.data.ownerName);
        setOwnerInRoom(parser.data.ownerInRoom);
        setUsersInRoom(parser.data.userCount);
    }, [ setLoadedRoomId, setName, setOwnerId, setOwnerName, setOwnerInRoom, setUsersInRoom, roomId ]);

    CreateMessageHook(ModeratorRoomInfoEvent, onModtoolRoomInfoEvent);

    const handleClick = useCallback((action: string, value?: string) =>
    {
        if(!action) return;

        switch(action)
        {
            case 'alert_only':
                if(message.trim().length === 0) return;
                SendMessageHook(new ModeratorActionMessageComposer(ModeratorActionMessageComposer.ACTION_ALERT, message, ''));
                return;
            case 'send_message':
                if(message.trim().length === 0) return;
                SendMessageHook(new ModeratorActionMessageComposer(ModeratorActionMessageComposer.ACTION_MESSAGE, message, ''));
                SendMessageHook(new ModerateRoomMessageComposer(roomId, lockRoom ? 1 : 0, changeRoomName ? 1 : 0, kickUsers ? 1 : 0))
                return;
        }
    }, [changeRoomName, kickUsers, lockRoom, message, roomId]);

    return (
        <NitroCardView className="nitro-mod-tools-room" simple={ true }>
            <NitroCardHeaderView headerText={ 'Room Info' + (name ? ': ' + name : '') } onCloseClick={ () => onCloseClick() } />
            <NitroCardContentView className="text-black">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <div>
                        <b>Room Owner:</b> <span className="username fw-bold cursor-pointer">{ ownerName }</span>
                    </div>
                    <button className="btn btn-sm btn-primary" onClick={() => TryVisitRoom(roomId)}>Visit Room</button>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <div>
                        <b>Users in room:</b> { usersInRoom }
                    </div>
                    <button className="btn btn-sm btn-primary" onClick={() => dispatchUiEvent(new ModToolsOpenRoomChatlogEvent(roomId))}>Chatlog</button>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <b>Owner in room:</b> { ownerInRoom ? 'Yes' : 'No' }
                    </div>
                    <button className="btn btn-sm btn-primary">Edit in HK</button>
                </div>
                <div className="bg-muted rounded py-1 px-2 mb-2">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="kickUsers" checked={ kickUsers } onChange={e => setKickUsers(e.target.checked)}/>
                        <label className="form-check-label" htmlFor="kickUsers">
                            Kick users out of the room
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="lockRoom" checked={ lockRoom } onChange={e => setLockRoom(e.target.checked)}/>
                        <label className="form-check-label" htmlFor="lockRoom">
                            Change room lock to doorbell
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="roomName" checked={ changeRoomName } onChange={e => setChangeRoomName(e.target.checked)}/>
                        <label className="form-check-label" htmlFor="roomName">
                            Change room name to "Inappro- priate to Hotel Management"
                        </label>
                    </div>
                </div>
                <textarea className="form-control mb-2" placeholder="Type a mandatory message to the users in this text box..." value={message} onChange={e => setMessage(e.target.value)}></textarea>
                <div className="d-flex justify-content-between">
                    <button className="btn btn-danger w-100 me-2" onClick={() => handleClick('send_message')}>Send Caution</button>
                    <button className="btn btn-success w-100" onClick={() => handleClick('alert_only')}>Send Alert only</button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
