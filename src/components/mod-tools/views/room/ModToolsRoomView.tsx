import { CreateLinkEvent, GetModeratorRoomInfoMessageComposer, ModerateRoomMessageComposer, ModeratorActionMessageComposer, ModeratorRoomInfoEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { SendMessageComposer, TryVisitRoom } from '../../../../api';
import { Button, Column, DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useMessageEvent } from '../../../../hooks';

interface ModToolsRoomViewProps
{
    roomId: number;
    onCloseClick: () => void;
}

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
    const [ kickUsers, setKickUsers ] = useState(false);
    const [ lockRoom, setLockRoom ] = useState(false);
    const [ changeRoomName, setChangeRoomName ] = useState(false);
    const [ message, setMessage ] = useState('');

    const handleClick = (action: string, value?: string) =>
    {
        if(!action) return;

        switch(action)
        {
            case 'alert_only':
                if(message.trim().length === 0) return;

                SendMessageComposer(new ModeratorActionMessageComposer(ModeratorActionMessageComposer.ACTION_ALERT, message, ''));
                SendMessageComposer(new ModerateRoomMessageComposer(roomId, lockRoom ? 1 : 0, changeRoomName ? 1 : 0, kickUsers ? 1 : 0));
                return;
            case 'send_message':
                if(message.trim().length === 0) return;

                SendMessageComposer(new ModeratorActionMessageComposer(ModeratorActionMessageComposer.ACTION_MESSAGE, message, ''));
                SendMessageComposer(new ModerateRoomMessageComposer(roomId, lockRoom ? 1 : 0, changeRoomName ? 1 : 0, kickUsers ? 1 : 0));
                return;
        }
    };

    useMessageEvent<ModeratorRoomInfoEvent>(ModeratorRoomInfoEvent, event =>
    {
        const parser = event.getParser();

        if(!parser || parser.data.flatId !== roomId) return;

        setLoadedRoomId(parser.data.flatId);
        setName(parser.data.room.name);
        setOwnerId(parser.data.ownerId);
        setOwnerName(parser.data.ownerName);
        setOwnerInRoom(parser.data.ownerInRoom);
        setUsersInRoom(parser.data.userCount);
    });

    useEffect(() =>
    {
        if(infoRequested) return;

        SendMessageComposer(new GetModeratorRoomInfoMessageComposer(roomId));
        setInfoRequested(true);
    }, [ roomId, infoRequested, setInfoRequested ]);

    return (
        <NitroCardView className="nitro-mod-tools-room" theme="primary-slim" windowPosition={ DraggableWindowPosition.TOP_LEFT }>
            <NitroCardHeaderView headerText={ 'Room Info' + (name ? ': ' + name : '') } onCloseClick={ event => onCloseClick() } />
            <NitroCardContentView className="text-black">
                <div className="flex gap-2">
                    <Column grow gap={ 1 } justifyContent="center">
                        <div className="items-center gap-2">
                            <Text bold align="end" className="col-span-7">Room Owner:</Text>
                            <Text pointer truncate underline>{ ownerName }</Text>
                        </div>
                        <div className="items-center gap-2">
                            <Text bold align="end" className="col-span-7">Users in room:</Text>
                            <Text>{ usersInRoom }</Text>
                        </div>
                        <div className="items-center gap-2">
                            <Text bold align="end" className="col-span-7">Owner in room:</Text>
                            <Text>{ ownerInRoom ? 'Yes' : 'No' }</Text>
                        </div>
                    </Column>
                    <div className="flex flex-col gap-1">
                        <Button onClick={ event => TryVisitRoom(roomId) }>Visit Room</Button>
                        <Button onClick={ event => CreateLinkEvent(`mod-tools/open-room-chatlog/${ roomId }`) }>Chatlog</Button>
                    </div>
                </div>
                <Column className="bg-muted rounded p-2" gap={ 1 }>
                    <div className="flex items-center gap-1">
                        <input checked={ kickUsers } className="form-check-input" type="checkbox" onChange={ event => setKickUsers(event.target.checked) } />
                        <Text small>Kick everyone out</Text>
                    </div>
                    <div className="flex items-center gap-1">
                        <input checked={ lockRoom } className="form-check-input" type="checkbox" onChange={ event => setLockRoom(event.target.checked) } />
                        <Text small>Enable the doorbell</Text>
                    </div>
                    <div className="flex items-center gap-1">
                        <input checked={ changeRoomName } className="form-check-input" type="checkbox" onChange={ event => setChangeRoomName(event.target.checked) } />
                        <Text small>Change room name</Text>
                    </div>
                </Column>
                <textarea className="min-h-[calc(1.5em+ .5rem+2px)] px-[.5rem] py-[.25rem]  rounded-[.2rem]" placeholder="Type a mandatory message to the users in this text box..." value={ message } onChange={ event => setMessage(event.target.value) }></textarea>
                <div className="flex justify-between">
                    <Button variant="danger" onClick={ event => handleClick('send_message') }>Send Caution</Button>
                    <Button onClick={ event => handleClick('alert_only') }>Send Alert only</Button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
