import { ModtoolRequestRoomInfoComposer, ModtoolRoomInfoEvent } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { CreateMessageHook, SendMessageHook } from '../../../../hooks/messages';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
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

    useEffect(() =>
    {
        if(infoRequested) return;
        
        SendMessageHook(new ModtoolRequestRoomInfoComposer(roomId));
        setInfoRequested(true);
    }, [ roomId, infoRequested, setInfoRequested ]);

    const onModtoolRoomInfoEvent = useCallback((event: ModtoolRoomInfoEvent) =>
    {
        const parser = event.getParser();

        setLoadedRoomId(parser.id);
        setName(parser.name);
        setOwnerId(parser.ownerId);
        setOwnerName(parser.ownerName);
        setOwnerInRoom(parser.ownerInRoom);
        setUsersInRoom(parser.playerAmount);
    }, [ setLoadedRoomId, setName, setOwnerId, setOwnerName, setOwnerInRoom, setUsersInRoom ]);

    CreateMessageHook(ModtoolRoomInfoEvent, onModtoolRoomInfoEvent);

    const handleClick = useCallback((action: string, value?: string) =>
    {
        if(!action) return;

        switch(action)
        {
            case 'close':
                onCloseClick();
                return;
        }
    }, [ onCloseClick ]);

    return (
        <NitroCardView className="nitro-mod-tools-room" simple={ true }>
            <NitroCardHeaderView headerText={ 'Room Info' + (name ? ': ' + name : '') } onCloseClick={ event => handleClick('close') } />
            <NitroCardContentView className="text-black">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <div>
                        <b>Room Owner:</b> <a href="#" className="fw-bold">{ ownerName }</a>
                    </div>
                    <button className="btn btn-sm btn-primary">Visit Room</button>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <div>
                        <b>Users in room:</b> { usersInRoom }
                    </div>
                    <button className="btn btn-sm btn-primary">Chatlog</button>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <b>Owner in room:</b> { ownerInRoom ? 'Yes' : 'No' }
                    </div>
                    <button className="btn btn-sm btn-primary">Edit in HK</button>
                </div>
                <div className="bg-muted rounded py-1 px-2 mb-2">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="kickUsers" />
                        <label className="form-check-label" htmlFor="kickUsers">
                            Kick users out of the room
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="lockRoom" />
                        <label className="form-check-label" htmlFor="lockRoom">
                            Change room lock to doorbell
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="lockRoom" />
                        <label className="form-check-label" htmlFor="lockRoom">
                            Change room name to "Inappro- priate to Hotel Management"
                        </label>
                    </div>
                </div>
                <textarea className="form-control mb-2" placeholder="Type a mandatory message to the users in this text box..."></textarea>
                <div className="d-flex justify-content-between">
                    <button className="btn btn-danger w-100 me-2">Send Caution</button>
                    <button className="btn btn-success w-100">Send Alert only</button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
